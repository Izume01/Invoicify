import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRegisterUser } from "@/features/auth/hooks/getRegisterUser";
import { getUserAccessibleInvoices } from "@/lib/permissions";

export async function GET() {
  const { user, session } = await getRegisterUser();

  if (!user || !session) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const checkUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!checkUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const invoices = await getUserAccessibleInvoices(checkUser.id);

    return NextResponse.json(
      { 
        success: true, 
        invoices: invoices.map(invoice => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          invoiceName: invoice.invoiceName,
          clientName: invoice.ClientName,
          status: invoice.status,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          currency: invoice.currency,
          total: invoice.items.reduce((sum, item) => sum + item.total, 0),
          itemCount: invoice._count.items,
          userPermissions: invoice.userPermissions,
          isOwner: invoice.isOwner,
        }))
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}