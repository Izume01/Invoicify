import { Invoice, InvoiceItem, InvoiceVersion, Prisma } from "@/generated/prisma/client";

type InvoiceWithRelations = Invoice & {
  items: InvoiceItem[];
  versions?: InvoiceVersion[];
};

type RawInvoiceLike = {
  discountType?: unknown;
  discountRate?: unknown;
  discountAmount?: unknown;
};

function decimalToNumber(value: Prisma.Decimal | null | undefined): number {
  if (value == null) {
    return 0;
  }
  return Number(value.toString());
}

function parseNumberLike(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function asRawInvoiceLike(value: unknown): RawInvoiceLike | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as RawInvoiceLike;
}

export function serializeInvoice(invoice: InvoiceWithRelations) {
  const rawInvoice = asRawInvoiceLike(invoice.rawJson);
  const rawDiscountRate = parseNumberLike(rawInvoice?.discountRate);
  const rawDiscountAmount = parseNumberLike(rawInvoice?.discountAmount);
  const rawDiscountType = rawInvoice?.discountType;
  const discountType =
    invoice.discountType ??
    (rawDiscountType === "PERCENTAGE" || rawDiscountType === "FIXED"
      ? rawDiscountType
      : "PERCENTAGE");
  const discountRate =
    invoice.discountRate != null
      ? decimalToNumber(invoice.discountRate)
      : rawDiscountRate ?? 0;
  const discountAmount =
    invoice.discountAmount != null
      ? decimalToNumber(invoice.discountAmount)
      : rawDiscountAmount ?? 0;

  return {
    id: invoice.id,
    userId: invoice.userId,
    clerkUserId: invoice.clerkUserId,
    title: invoice.title,
    status: invoice.status,
    prompt: invoice.prompt,
    sourceText: invoice.sourceText,
    invoiceNumber: invoice.invoiceNumber,
    currency: invoice.currency,
    issueDate: invoice.issueDate.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
    fromName: invoice.fromName,
    fromEmail: invoice.fromEmail,
    fromAddress: invoice.fromAddress,
    billToName: invoice.billToName,
    billToEmail: invoice.billToEmail,
    billToAddress: invoice.billToAddress,
    notes: invoice.notes,
    subtotal: decimalToNumber(invoice.subtotal),
    discountType,
    discountRate,
    discountAmount,
    taxRate: decimalToNumber(invoice.taxRate),
    taxAmount: decimalToNumber(invoice.taxAmount),
    total: decimalToNumber(invoice.total),
    rawJson: invoice.rawJson,
    items: invoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: decimalToNumber(item.unitPrice),
      lineTotal: decimalToNumber(item.lineTotal),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    versions: invoice.versions?.map((version) => ({
      id: version.id,
      version: version.version,
      sourcePrompt: version.sourcePrompt,
      snapshot: version.snapshot,
      createdAt: version.createdAt.toISOString(),
    })),
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
  };
}

export function serializeInvoiceSummary(invoice: InvoiceWithRelations) {
  return {
    id: invoice.id,
    title: invoice.title,
    clientName: invoice.billToName,
    status: invoice.status,
    invoiceNumber: invoice.invoiceNumber,
    currency: invoice.currency,
    total: decimalToNumber(invoice.total),
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
  };
}
