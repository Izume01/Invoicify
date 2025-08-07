import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRegisterUser } from "@/features/auth/hooks/getRegisterUser";
import { hasInvoiceAccess, getUserInvoicePermissions } from "@/lib/permissions";
import { InvoiceAccessType } from "@prisma/client";

export async function GET(
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

    const checkUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!checkUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if user has any access to this invoice
    const hasViewAccess = await hasInvoiceAccess(
      checkUser.id,
      invoiceId,
      InvoiceAccessType.VIEW
    );

    if (!hasViewAccess) {
      return NextResponse.json(
        { error: "Access denied. You don't have permission to view this invoice." },
        { status: 403 }
      );
    }

    // Get user permissions for this invoice
    const userPermissions = await getUserInvoicePermissions(
      checkUser.id,
      invoiceId
    );

    // Get the invoice with details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    const isOwner = invoice.userId === checkUser.id;

    return NextResponse.json(
      {
        success: true,
        invoice: {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          invoiceName: invoice.invoiceName,
          clientName: invoice.ClientName,
          clientEmail: invoice.ClientEmail,
          clientAddress: invoice.ClientAddress,
          status: invoice.status,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          currency: invoice.currency,
          fromName: invoice.FromName,
          fromEmail: invoice.FromEmail,
          fromAddress: invoice.FromAddress,
          paymentMethod: invoice.paymentMethod,
          notes: invoice.notes,
          cryptoAddress: invoice.cryptoAddress,
          paypalEmail: invoice.paypalEmail,
          bankAccountNumber: invoice.bankAccountNumber,
          bankName: invoice.bankName,
          bankSwiftCode: invoice.bankSwiftCode,
          items: invoice.items,
          client: invoice.client,
          owner: invoice.user,
          total: invoice.items.reduce((sum, item) => sum + item.total, 0),
          userPermissions,
          isOwner,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}