import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { serializeInvoice } from "@/lib/invoice-response";
import { UnauthorizedError, requireDbUserForApi } from "@/lib/user";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function resolveParams(params: RouteContext["params"]): Promise<{ id: string }> {
  if (typeof (params as Promise<{ id: string }>).then === "function") {
    return await (params as Promise<{ id: string }>);
  }

  return params as { id: string };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { dbUser } = await requireDbUserForApi();
    const { id } = await resolveParams(context.params);

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
      include: {
        items: true,
        versions: {
          orderBy: {
            version: "desc",
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice: serializeInvoice(invoice) }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/invoice/[id]] Error:", error);
    
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = error instanceof Error ? error.message : "Failed to load invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
