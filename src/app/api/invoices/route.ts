import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { serializeInvoiceSummary } from "@/lib/invoice-response";
import { UnauthorizedError, requireDbUserForApi } from "@/lib/user";

export async function GET() {
  try {
    const { dbUser } = await requireDbUserForApi();

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: dbUser.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        invoices: invoices.map((invoice) => serializeInvoiceSummary(invoice)),
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to load invoices" }, { status: 500 });
  }
}
