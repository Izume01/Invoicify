const CURRENCY_CODES = ["USD", "EUR", "GBP", "INR"] as const;

type CurrencyCode = (typeof CURRENCY_CODES)[number];
type InvoiceDiscountType = "PERCENTAGE" | "FIXED";

export type GeneratedInvoiceItem = {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type GeneratedInvoiceDraft = {
  title: string;
  invoiceNumber: string;
  currency: CurrencyCode;
  issueDate: Date;
  dueDate: Date;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  billToName: string;
  billToEmail: string;
  billToAddress: string;
  notes: string;
  discountType: InvoiceDiscountType;
  discountRate: number;
  discountAmount: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  items: GeneratedInvoiceItem[];
  prompt: string;
  sourceText: string;
};

type GenerateInvoiceInput = {
  prompt: string;
  extractedText?: string;
  defaultFromName?: string;
  defaultFromEmail?: string;
};

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function roundCurrency(value: number): number {
  return Number(value.toFixed(2));
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, roundCurrency(value)));
}

function clampAmount(value: number, maxValue: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(roundCurrency(maxValue), roundCurrency(value)));
}

function generateInvoiceNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `INV-${datePart}-${timePart}${randomPart}`;
}

function extractLineByLabel(content: string, labels: string[]): string | null {
  for (const label of labels) {
    const regex = new RegExp(`${label}\\s*[:\\-]\\s*(.+)`, "i");
    const match = content.match(regex);
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function detectCurrency(content: string): CurrencyCode {
  const upper = content.toUpperCase();
  if (upper.includes("EUR") || upper.includes("€")) return "EUR";
  if (upper.includes("GBP") || upper.includes("£")) return "GBP";
  if (upper.includes("INR") || upper.includes("₹")) return "INR";
  return "USD";
}

function parseDateLabel(content: string, labels: string[]): Date | null {
  const raw = extractLineByLabel(content, labels);
  if (!raw) return null;

  const candidate = new Date(raw);
  if (!Number.isNaN(candidate.getTime())) {
    return candidate;
  }

  return null;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function extractEmails(content: string): string[] {
  const matches = content.match(EMAIL_REGEX);
  if (!matches) return [];
  return [...new Set(matches.map((email) => email.toLowerCase()))];
}

function sanitizeQuantity(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.max(1, Math.round(value));
}

function sanitizePrice(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return roundCurrency(value);
}

function extractItems(content: string): GeneratedInvoiceItem[] {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items: GeneratedInvoiceItem[] = [];

  for (const line of lines) {
    // Supported line format: "- Design work x2 @ 150"
    const match = line.match(
      /^[-*]?\s*(.+?)\s+x\s*(\d+(?:\.\d+)?)\s*@\s*(?:USD|EUR|GBP|INR|\$|€|£|₹)?\s*(\d+(?:\.\d+)?)/i,
    );

    if (!match) continue;

    const name = match[1].trim();
    const quantity = sanitizeQuantity(Number(match[2]));
    const unitPrice = sanitizePrice(Number(match[3]));
    const lineTotal = roundCurrency(quantity * unitPrice);

    if (!name) continue;

    items.push({
      name,
      description: "",
      quantity,
      unitPrice,
      lineTotal,
    });
  }

  if (items.length > 0) {
    return items;
  }

  return [
    {
      name: "Professional Services",
      description: "Generated from chat prompt",
      quantity: 1,
      unitPrice: 500,
      lineTotal: 500,
    },
  ];
}

function extractTaxRate(content: string): number {
  if (/(?:no|without)\s+(?:tax|gst|vat)/i.test(content)) {
    return 0;
  }

  const directMatch =
    content.match(
      /(?:tax|gst|vat)(?:\s*rate)?\s*(?:to|=|at|is|of|:|-)?\s*(\d+(?:\.\d+)?)\s*%?/i,
    ) ??
    content.match(/(\d+(?:\.\d+)?)\s*%\s*(?:tax|gst|vat)/i);

  if (!directMatch?.[1]) {
    return 0;
  }

  return clampPercent(Number(directMatch[1]));
}

function extractDiscount(
  content: string,
  subtotal: number,
): {
  discountType: InvoiceDiscountType;
  discountRate: number;
  discountAmount: number;
} {
  if (
    /(?:no|without)\s+discount/i.test(content) ||
    /discount\s*[:\-]?\s*none/i.test(content) ||
    /remove\s+discount/i.test(content)
  ) {
    return {
      discountType: "PERCENTAGE",
      discountRate: 0,
      discountAmount: 0,
    };
  }

  const percentageMatch =
    content.match(/discount(?:\s*rate)?\s*(?:to|=|at|is|of|:|-)?\s*(\d+(?:\.\d+)?)\s*%/i) ??
    content.match(/(\d+(?:\.\d+)?)\s*%\s*discount/i);

  if (percentageMatch?.[1]) {
    const discountRate = clampPercent(Number(percentageMatch[1]));
    return {
      discountType: "PERCENTAGE",
      discountRate,
      discountAmount: roundCurrency((subtotal * discountRate) / 100),
    };
  }

  const fixedMatch =
    content.match(
      /discount(?:\s*(?:amount|value))?\s*(?:to|=|at|is|of|:|-)?\s*(?:USD|EUR|GBP|INR|\$|€|£|₹)?\s*(\d+(?:\.\d+)?)(?!\s*%)/i,
    ) ?? content.match(/discount\s+of\s+(?:USD|EUR|GBP|INR|\$|€|£|₹)?\s*(\d+(?:\.\d+)?)(?!\s*%)/i);

  if (fixedMatch?.[1]) {
    const discountAmount = clampAmount(Number(fixedMatch[1]), subtotal);
    const discountRate = subtotal > 0 ? roundCurrency((discountAmount / subtotal) * 100) : 0;
    return {
      discountType: "FIXED",
      discountRate,
      discountAmount,
    };
  }

  return {
    discountType: "PERCENTAGE",
    discountRate: 0,
    discountAmount: 0,
  };
}

function extractTitle(content: string): string {
  const explicitTitle = extractLineByLabel(content, ["title", "invoice title", "invoice"]);
  if (explicitTitle) {
    return explicitTitle;
  }

  const forMatch = content.match(/invoice\s+(?:for|to)\s+([^\n,.]+)/i);
  if (forMatch?.[1]) {
    return `Invoice for ${forMatch[1].trim()}`;
  }

  return "AI Generated Invoice";
}

export function generateInvoiceDraft(input: GenerateInvoiceInput): GeneratedInvoiceDraft {
  const prompt = input.prompt.trim();
  const sourceText = input.extractedText?.trim() ?? "";
  const mergedContent = [prompt, sourceText].filter(Boolean).join("\n");

  const issueDate =
    parseDateLabel(mergedContent, ["issue date", "invoice date", "date"]) ?? new Date();
  const dueDate = parseDateLabel(mergedContent, ["due date", "payment due"]) ?? addDays(issueDate, 14);

  const fromName =
    extractLineByLabel(mergedContent, ["from", "sender", "company"]) ??
    input.defaultFromName ??
    "Your Business";
  const fromEmailLabel = extractLineByLabel(mergedContent, ["from email", "sender email"]);

  const billToName =
    extractLineByLabel(mergedContent, ["bill to", "client", "to"]) ?? "Client";
  const billToEmailLabel = extractLineByLabel(mergedContent, ["bill to email", "client email", "to email"]);

  const emails = extractEmails(mergedContent);

  const fromEmail =
    fromEmailLabel ?? input.defaultFromEmail ?? emails[0] ?? "billing@example.com";
  const billToEmail = billToEmailLabel ?? emails[1] ?? emails[0] ?? "client@example.com";

  const fromAddress =
    extractLineByLabel(mergedContent, ["from address", "sender address", "company address"]) ??
    "Business Address";
  const billToAddress =
    extractLineByLabel(mergedContent, ["bill to address", "client address", "to address"]) ??
    "Client Address";

  const notes = extractLineByLabel(mergedContent, ["notes", "note", "memo"]) ?? "";
  const title = extractTitle(mergedContent);
  const currency = detectCurrency(mergedContent);

  const items = extractItems(mergedContent);
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const discount = extractDiscount(mergedContent, subtotal);
  const taxRate = extractTaxRate(mergedContent);
  const taxableSubtotal = roundCurrency(subtotal - discount.discountAmount);
  const taxAmount = roundCurrency((taxableSubtotal * taxRate) / 100);
  const total = roundCurrency(taxableSubtotal + taxAmount);

  return {
    title,
    invoiceNumber: generateInvoiceNumber(),
    currency,
    issueDate,
    dueDate,
    fromName,
    fromEmail,
    fromAddress,
    billToName,
    billToEmail,
    billToAddress,
    notes,
    discountType: discount.discountType,
    discountRate: discount.discountRate,
    discountAmount: discount.discountAmount,
    taxRate,
    subtotal,
    taxAmount,
    total,
    items,
    prompt,
    sourceText,
  };
}
