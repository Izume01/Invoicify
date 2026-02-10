import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { InvoiceStatus, Prisma } from "@/generated/prisma/client";
import {
  applyStructuredInvoiceUpdate,
  buildStructuredInvoiceUpdate,
  InvoiceUpdateAiError,
  type StructuredInvoiceUpdate,
} from "@/lib/invoice-editor";
import { serializeInvoice } from "@/lib/invoice-response";
import prisma from "@/lib/prisma";
import { UnauthorizedError, requireDbUserForApi } from "@/lib/user";

const requestSchema = z.object({
  invoiceId: z.string().min(1, "invoiceId is required"),
  instruction: z.string().min(1, "instruction is required"),
});

function toDecimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

function isUnknownDiscountArgumentError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /Unknown argument `discount(?:Type|Rate|Amount)`/.test(error.message);
}

async function withDiscountFieldFallback<T>(
  operation: (includeDiscountFields: boolean) => Promise<T>,
): Promise<T> {
  try {
    return await operation(true);
  } catch (error) {
    if (!isUnknownDiscountArgumentError(error)) {
      throw error;
    }

    return operation(false);
  }
}

function hasStructuredChanges(update: StructuredInvoiceUpdate): boolean {
  const hasSetChanges = Boolean(update.set && Object.keys(update.set).length > 0);
  const hasAdjustmentChanges = Boolean(
    update.adjustments &&
      Object.values(update.adjustments).some((value) => value !== undefined),
  );
  const hasAddItems = Boolean(update.addItems && update.addItems.length > 0);
  const hasUpdateItems = Boolean(update.updateItems && update.updateItems.length > 0);
  const hasRemoveItems = Boolean(update.removeItems && update.removeItems.length > 0);

  return hasSetChanges || hasAdjustmentChanges || hasAddItems || hasUpdateItems || hasRemoveItems;
}

export async function POST(request: NextRequest) {
  try {
    const body = requestSchema.parse(await request.json());
    const { dbUser } = await requireDbUserForApi();

    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: body.invoiceId,
        userId: dbUser.id,
      },
      include: {
        items: true,
        versions: {
          orderBy: {
            version: "desc",
          },
          take: 1,
        },
      },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const serialized = serializeInvoice(existingInvoice);
    const { update: structuredUpdate, source } = await buildStructuredInvoiceUpdate({
      instruction: body.instruction,
      invoice: serialized,
    });

    if (!hasStructuredChanges(structuredUpdate)) {
      return NextResponse.json(
        {
          invoice: serialized,
          updateSource: source,
          structuredUpdate,
          message: "No changes detected from instruction.",
        },
        { status: 200 },
      );
    }

    const nextValues = applyStructuredInvoiceUpdate(serialized, structuredUpdate);
    const nextVersion = (existingInvoice.versions[0]?.version ?? 0) + 1;

    const sourceText = [existingInvoice.sourceText ?? "", `Edit instruction: ${body.instruction}`]
      .filter(Boolean)
      .join("\n");

    const rawJson = {
      title: nextValues.title,
      invoiceNumber: existingInvoice.invoiceNumber,
      currency: nextValues.currency,
      issueDate: nextValues.issueDate,
      dueDate: nextValues.dueDate,
      from: {
        name: nextValues.fromName,
        email: nextValues.fromEmail,
        address: nextValues.fromAddress,
      },
      billTo: {
        name: nextValues.billToName,
        email: nextValues.billToEmail,
        address: nextValues.billToAddress,
      },
      notes: nextValues.notes,
      subtotal: nextValues.subtotal,
      discountType: nextValues.discountType,
      discountRate: nextValues.discountRate,
      discountAmount: nextValues.discountAmount,
      taxRate: nextValues.taxRate,
      taxAmount: nextValues.taxAmount,
      total: nextValues.total,
      items: nextValues.items,
      prompt: existingInvoice.prompt ?? "",
      sourceText,
      editInstruction: body.instruction,
      structuredUpdate,
      updateSource: source,
    };

    const discountFields = {
      discountType: nextValues.discountType,
      discountRate: toDecimal(nextValues.discountRate),
      discountAmount: toDecimal(nextValues.discountAmount),
    };

    const updatedInvoice = await withDiscountFieldFallback((includeDiscountFields) =>
      prisma.invoice.update({
        where: {
          id: existingInvoice.id,
        },
        data: {
          title: nextValues.title,
          status: InvoiceStatus.READY,
          sourceText,
          currency: nextValues.currency,
          issueDate: new Date(nextValues.issueDate),
          dueDate: new Date(nextValues.dueDate),
          fromName: nextValues.fromName,
          fromEmail: nextValues.fromEmail,
          fromAddress: nextValues.fromAddress,
          billToName: nextValues.billToName,
          billToEmail: nextValues.billToEmail,
          billToAddress: nextValues.billToAddress,
          notes: nextValues.notes,
          subtotal: toDecimal(nextValues.subtotal),
          ...(includeDiscountFields ? discountFields : {}),
          taxRate: toDecimal(nextValues.taxRate),
          taxAmount: toDecimal(nextValues.taxAmount),
          total: toDecimal(nextValues.total),
          rawJson,
          items: {
            deleteMany: {},
            create: nextValues.items.map((item) => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: toDecimal(item.unitPrice),
              lineTotal: toDecimal(item.lineTotal),
            })),
          },
          versions: {
            create: {
              version: nextVersion,
              sourcePrompt: body.instruction,
              snapshot: rawJson,
            },
          },
        },
        include: {
          items: true,
          versions: {
            orderBy: {
              version: "desc",
            },
          },
        },
      }),
    );

    return NextResponse.json(
      {
        invoice: serializeInvoice(updatedInvoice),
        updateSource: source,
        structuredUpdate,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    if (error instanceof InvoiceUpdateAiError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    if (isUnknownDiscountArgumentError(error)) {
      return NextResponse.json(
        { error: "Invoice schema mismatch detected. Restart the dev server and run Prisma generate." },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}
