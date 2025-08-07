import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRegisterUser } from "@/features/auth/hooks/getRegisterUser";
import { shareInvoice } from "@/lib/permissions";
import { InvoiceAccessType } from "@prisma/client";
import { z } from "zod";

const shareInvoiceSchema = z.object({
  targetUserEmail: z.string().email(),
  accessTypes: z.array(z.nativeEnum(InvoiceAccessType)).min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, session } = await getRegisterUser();

  if (!user || !session) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const invoiceId = parseInt(params.id);
    
    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 }
      );
    }

    const requestData = await req.json();
    const parsedData = shareInvoiceSchema.parse(requestData);

    const checkUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!checkUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if the current user is the owner of the invoice
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: checkUser.id, // Only owners can share invoices
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found or you don't have permission to share it" },
        { status: 403 }
      );
    }

    // Find the target user by email
    const targetUser = await prisma.user.findUnique({
      where: { email: parsedData.targetUserEmail },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Don't allow sharing with yourself
    if (targetUser.id === checkUser.id) {
      return NextResponse.json(
        { error: "Cannot share invoice with yourself" },
        { status: 400 }
      );
    }

    // Share the invoice
    const success = await shareInvoice(
      invoiceId,
      targetUser.id,
      parsedData.accessTypes
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to share invoice" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Invoice shared with ${parsedData.targetUserEmail}`,
        sharedWith: {
          email: targetUser.email,
          name: targetUser.name,
          accessTypes: parsedData.accessTypes,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sharing invoice:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}