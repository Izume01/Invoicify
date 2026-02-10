import { z } from "zod";

import type { InvoiceDetail } from "@/types/invoice";

const editableCurrency = z.enum(["USD", "EUR", "GBP", "INR"]);
const editableDiscountType = z.enum(["PERCENTAGE", "FIXED"]);

const itemInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative(),
});

const itemUpdateSchema = z.object({
  targetName: z.string().min(1),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().positive().optional(),
  unitPrice: z.coerce.number().nonnegative().optional(),
});

const structuredUpdateSchema = z.object({
  set: z
    .object({
      title: z.string().min(1).optional(),
      currency: editableCurrency.optional(),
      issueDate: z.string().min(1).optional(),
      dueDate: z.string().min(1).optional(),
      fromName: z.string().min(1).optional(),
      fromEmail: z.string().min(1).optional(),
      fromAddress: z.string().min(1).optional(),
      billToName: z.string().min(1).optional(),
      billToEmail: z.string().min(1).optional(),
      billToAddress: z.string().min(1).optional(),
      notes: z.string().optional(),
      discountType: editableDiscountType.optional(),
      discountRate: z.coerce.number().min(0).max(100).optional(),
      discountAmount: z.coerce.number().nonnegative().optional(),
      taxRate: z.coerce.number().min(0).max(100).optional(),
    })
    .optional(),
  adjustments: z
    .object({
      discountRateDelta: z.coerce.number().optional(),
      discountAmountDelta: z.coerce.number().optional(),
      taxRateDelta: z.coerce.number().optional(),
    })
    .optional(),
  addItems: z.array(itemInputSchema).optional(),
  updateItems: z.array(itemUpdateSchema).optional(),
  removeItems: z.array(z.string().min(1)).optional(),
});

export type StructuredInvoiceUpdate = z.infer<typeof structuredUpdateSchema>;

export type AppliedInvoiceUpdate = {
  title: string;
  currency: "USD" | "EUR" | "GBP" | "INR";
  issueDate: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  billToName: string;
  billToEmail: string;
  billToAddress: string;
  notes: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountRate: number;
  discountAmount: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

type GeminiPart = {
  text?: string;
};

type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[];
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

const DEFAULT_GEMINI_MODELS = ["gemini-2.0-flash-001", "gemini-1.5-flash-latest"] as const;
const RULE_FALLBACK_ENABLED = process.env.INVOICE_QUICK_EDIT_RULE_FALLBACK === "true";

export class InvoiceUpdateAiError extends Error {
  code: "MISSING_API_KEY" | "MODEL_REQUEST_FAILED";

  constructor(code: "MISSING_API_KEY" | "MODEL_REQUEST_FAILED", message: string) {
    super(message);
    this.name = "InvoiceUpdateAiError";
    this.code = code;
  }
}

function roundCurrency(value: number): number {
  return Number(value.toFixed(2));
}

function clampTaxRate(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, roundCurrency(value)));
}

function clampDiscountRate(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, roundCurrency(value)));
}

function clampDiscountAmount(value: number, subtotal: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(roundCurrency(subtotal), roundCurrency(value)));
}

function sanitizeQuantity(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.max(1, Math.round(value));
}

function sanitizePrice(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return roundCurrency(value);
}

function normalizeDate(value: string): string | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function extractJsonPayload(raw: string): string | null {
  const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return raw.slice(start, end + 1).trim();
}

function parseStructuredUpdate(raw: string): StructuredInvoiceUpdate | null {
  const payload = extractJsonPayload(raw);
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload) as unknown;
    const validated = structuredUpdateSchema.safeParse(parsed);

    if (!validated.success) {
      return null;
    }

    return validated.data;
  } catch {
    return null;
  }
}

function summarizeInvoiceForPrompt(invoice: InvoiceDetail): Record<string, unknown> {
  return {
    title: invoice.title,
    currency: invoice.currency,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    fromName: invoice.fromName,
    fromEmail: invoice.fromEmail,
    fromAddress: invoice.fromAddress,
    billToName: invoice.billToName,
    billToEmail: invoice.billToEmail,
    billToAddress: invoice.billToAddress,
    notes: invoice.notes ?? "",
    discountType: invoice.discountType,
    discountRate: invoice.discountRate,
    discountAmount: invoice.discountAmount,
    taxRate: invoice.taxRate,
    items: invoice.items.map((item) => ({
      name: item.name,
      description: item.description ?? "",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
}

function fallbackStructuredUpdate(instruction: string): StructuredInvoiceUpdate {
  const update: StructuredInvoiceUpdate = {};
  const trimmed = instruction.trim();

  const directTax = trimmed.match(/(?:tax|gst|vat)(?:\s*rate)?\s*(?:to|=|at|is|of)?\s*(\d+(?:\.\d+)?)\s*%?/i);
  if (directTax?.[1]) {
    update.set = {
      ...(update.set ?? {}),
      taxRate: clampTaxRate(Number(directTax[1])),
    };
  }

  const relativeTax = trimmed.match(/(?:increase|raise)\s+(?:tax|gst|vat)(?:\s*rate)?\s+by\s+(\d+(?:\.\d+)?)\s*%?/i);
  if (relativeTax?.[1]) {
    update.adjustments = {
      ...(update.adjustments ?? {}),
      taxRateDelta: Math.abs(Number(relativeTax[1])),
    };
  }

  const relativeTaxDecrease = trimmed.match(/(?:decrease|reduce|lower)\s+(?:tax|gst|vat)(?:\s*rate)?\s+by\s+(\d+(?:\.\d+)?)\s*%?/i);
  if (relativeTaxDecrease?.[1]) {
    update.adjustments = {
      ...(update.adjustments ?? {}),
      taxRateDelta: -Math.abs(Number(relativeTaxDecrease[1])),
    };
  }

  const percentDiscount =
    trimmed.match(/(?:set|change|apply|add)\s+(?:a\s+)?(?:discount|discount rate)\s*(?:to|at|=|of)?\s*(\d+(?:\.\d+)?)\s*%/i) ??
    trimmed.match(/(\d+(?:\.\d+)?)\s*%\s*discount/i);
  if (percentDiscount?.[1]) {
    update.set = {
      ...(update.set ?? {}),
      discountType: "PERCENTAGE",
      discountRate: clampDiscountRate(Number(percentDiscount[1])),
    };
  }

  const fixedDiscount =
    trimmed.match(
      /(?:set|change|apply|add)\s+(?:a\s+)?(?:discount|discount amount)\s*(?:to|at|=|of)?\s*(?:USD|EUR|GBP|INR|\$|€|£|₹)?\s*(\d+(?:\.\d+)?)(?!\s*%)/i,
    ) ??
    trimmed.match(/discount\s+of\s+(?:USD|EUR|GBP|INR|\$|€|£|₹)?\s*(\d+(?:\.\d+)?)(?!\s*%)/i);
  if (fixedDiscount?.[1]) {
    update.set = {
      ...(update.set ?? {}),
      discountType: "FIXED",
      discountAmount: roundCurrency(Math.abs(Number(fixedDiscount[1]))),
    };
  }

  const increaseDiscountRate = trimmed.match(
    /(?:increase|raise)\s+(?:discount|discount rate)\s+by\s+(\d+(?:\.\d+)?)\s*%/i,
  );
  if (increaseDiscountRate?.[1]) {
    update.adjustments = {
      ...(update.adjustments ?? {}),
      discountRateDelta: Math.abs(Number(increaseDiscountRate[1])),
    };
  }

  const decreaseDiscountRate = trimmed.match(
    /(?:decrease|reduce|lower)\s+(?:discount|discount rate)\s+by\s+(\d+(?:\.\d+)?)\s*%/i,
  );
  if (decreaseDiscountRate?.[1]) {
    update.adjustments = {
      ...(update.adjustments ?? {}),
      discountRateDelta: -Math.abs(Number(decreaseDiscountRate[1])),
    };
  }

  const increaseDiscountAmount = trimmed.match(
    /(?:increase|raise)\s+(?:discount amount|discount)\s+by\s+(?:USD|EUR|GBP|INR|\$|€|£|₹)?\s*(\d+(?:\.\d+)?)(?!\s*%)/i,
  );
  if (increaseDiscountAmount?.[1]) {
    update.adjustments = {
      ...(update.adjustments ?? {}),
      discountAmountDelta: Math.abs(Number(increaseDiscountAmount[1])),
    };
    update.set = {
      ...(update.set ?? {}),
      discountType: "FIXED",
    };
  }

  const decreaseDiscountAmount = trimmed.match(
    /(?:decrease|reduce|lower)\s+(?:discount amount|discount)\s+by\s+(?:USD|EUR|GBP|INR|\$|€|£|₹)?\s*(\d+(?:\.\d+)?)(?!\s*%)/i,
  );
  if (decreaseDiscountAmount?.[1]) {
    update.adjustments = {
      ...(update.adjustments ?? {}),
      discountAmountDelta: -Math.abs(Number(decreaseDiscountAmount[1])),
    };
    update.set = {
      ...(update.set ?? {}),
      discountType: "FIXED",
    };
  }

  if (
    /(?:remove|clear)\s+(?:the\s+)?discount/i.test(trimmed) ||
    /(?:no|without)\s+discount/i.test(trimmed)
  ) {
    update.set = {
      ...(update.set ?? {}),
      discountType: "PERCENTAGE",
      discountRate: 0,
      discountAmount: 0,
    };
  }

  const addNote = trimmed.match(/(?:add|append)\s+note[s]?\s*[:\-]?\s*(.+)$/i);
  if (addNote?.[1]) {
    update.set = {
      ...(update.set ?? {}),
      notes: addNote[1].trim(),
    };
  }

  const dueDate = trimmed.match(/(?:set|change|move)\s+(?:the\s+)?due\s+date\s+(?:to|on)?\s*[:\-]?\s*(.+)$/i);
  if (dueDate?.[1]) {
    update.set = {
      ...(update.set ?? {}),
      dueDate: dueDate[1].trim(),
    };
  }

  const issueDate = trimmed.match(/(?:set|change|move)\s+(?:the\s+)?issue\s+date\s+(?:to|on)?\s*[:\-]?\s*(.+)$/i);
  if (issueDate?.[1]) {
    update.set = {
      ...(update.set ?? {}),
      issueDate: issueDate[1].trim(),
    };
  }

  const currency = trimmed.match(/(?:set|change)\s+(?:the\s+)?currency\s+(?:to)?\s*(USD|EUR|GBP|INR)/i);
  if (currency?.[1]) {
    update.set = {
      ...(update.set ?? {}),
      currency: currency[1].toUpperCase() as "USD" | "EUR" | "GBP" | "INR",
    };
  }

  const addItem = trimmed.match(
    /(?:add|include)\s+(?:an?\s+)?item\s*[:\-]?\s*(.+?)\s+x\s*(\d+(?:\.\d+)?)\s*@\s*(\d+(?:\.\d+)?)/i,
  );
  if (addItem?.[1] && addItem[2] && addItem[3]) {
    update.addItems = [
      {
        name: addItem[1].trim(),
        description: "",
        quantity: sanitizeQuantity(Number(addItem[2])),
        unitPrice: sanitizePrice(Number(addItem[3])),
      },
    ];
  }

  const removeItem = trimmed.match(/(?:remove|delete)\s+(?:the\s+)?item\s*[:\-]?\s*["“]?([^"”]+)["”]?/i);
  if (removeItem?.[1]) {
    update.removeItems = [removeItem[1].trim()];
  }

  return update;
}

async function generateStructuredUpdateWithGemini(
  instruction: string,
  invoice: InvoiceDetail,
): Promise<StructuredInvoiceUpdate> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new InvoiceUpdateAiError(
      "MISSING_API_KEY",
      "Quick Edit AI is not configured. Add GEMINI_API_KEY to use AI-powered updates.",
    );
  }

  const prompt = [
    "You are an invoice quick-edit engine.",
    "Return valid JSON only. Never return markdown, prose, or code fences.",
    "The response MUST always use this exact top-level shape:",
    '{"set":{},"adjustments":{},"addItems":[],"updateItems":[],"removeItems":[]}',
    "Only include fields that should change. Leave others out or keep containers empty.",
    "All text edits (title, names, emails, addresses, notes) must be plain strings inside `set`.",
    "Use this JSON syntax and field contract exactly:",
    JSON.stringify(
      {
        set: {
          title: "optional string",
          currency: "optional one of USD, EUR, GBP, INR",
          issueDate: "optional ISO date or parseable date string",
          dueDate: "optional ISO date or parseable date string",
          fromName: "optional string",
          fromEmail: "optional string",
          fromAddress: "optional string",
          billToName: "optional string",
          billToEmail: "optional string",
          billToAddress: "optional string",
          notes: "optional string",
          discountType: "optional one of PERCENTAGE or FIXED",
          discountRate: "optional number 0..100",
          discountAmount: "optional non-negative number",
          taxRate: "optional number 0..100",
        },
        adjustments: {
          discountRateDelta: "optional number",
          discountAmountDelta: "optional number",
          taxRateDelta: "optional number",
        },
        addItems: [
          {
            name: "string",
            description: "optional string",
            quantity: 1,
            unitPrice: 100,
          },
        ],
        updateItems: [
          {
            targetName: "existing item name to match",
            name: "optional replacement name",
            description: "optional replacement description",
            quantity: "optional replacement quantity",
            unitPrice: "optional replacement unitPrice",
          },
        ],
        removeItems: ["existing item name"],
      },
      null,
      2,
    ),
    "If the instruction is ambiguous, make the safest minimal edit.",
    "If no change is requested, return empty objects/arrays with the same top-level keys.",
    "Instruction:",
    instruction,
    "Current invoice:",
    JSON.stringify(summarizeInvoiceForPrompt(invoice), null, 2),
  ].join("\n\n");

  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const modelsToTry = configuredModel
    ? [configuredModel]
    : [...DEFAULT_GEMINI_MODELS];
  let lastErrorMessage = "Quick Edit AI request failed.";

  for (const model of modelsToTry) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        lastErrorMessage = `Quick Edit AI model '${model}' failed (${response.status}). ${bodyText.slice(0, 200)}`;
        continue;
      }

      const payload = (await response.json()) as GeminiResponse;
      const text = payload.candidates
        ?.flatMap((candidate) => candidate.content?.parts ?? [])
        .map((part) => part.text ?? "")
        .join("\n")
        .trim();

      if (!text) {
        lastErrorMessage = `Quick Edit AI model '${model}' returned an empty response.`;
        continue;
      }

      const parsed = parseStructuredUpdate(text);
      if (!parsed) {
        lastErrorMessage = `Quick Edit AI model '${model}' returned invalid JSON syntax.`;
        continue;
      }

      return parsed;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        lastErrorMessage = `Quick Edit AI model '${model}' timed out.`;
        continue;
      }

      const message = error instanceof Error ? error.message : "Unknown AI request error.";
      lastErrorMessage = `Quick Edit AI model '${model}' request failed: ${message}`;
      continue;
    }
  }

  throw new InvoiceUpdateAiError("MODEL_REQUEST_FAILED", lastErrorMessage);
}

export async function buildStructuredInvoiceUpdate(args: {
  instruction: string;
  invoice: InvoiceDetail;
}): Promise<{ update: StructuredInvoiceUpdate; source: "llm" | "fallback" }> {
  try {
    const llmUpdate = await generateStructuredUpdateWithGemini(args.instruction, args.invoice);
    return { update: llmUpdate, source: "llm" };
  } catch (error) {
    if (!RULE_FALLBACK_ENABLED) {
      throw error;
    }

    return {
      update: fallbackStructuredUpdate(args.instruction),
      source: "fallback",
    };
  }
}

function namesMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function ensureNotEmpty(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeCurrency(
  value: string,
): "USD" | "EUR" | "GBP" | "INR" {
  const parsed = editableCurrency.safeParse(value.toUpperCase());
  if (parsed.success) {
    return parsed.data;
  }

  return "USD";
}

export function applyStructuredInvoiceUpdate(
  invoice: InvoiceDetail,
  update: StructuredInvoiceUpdate,
): AppliedInvoiceUpdate {
  const set = update.set ?? {};

  let items = invoice.items.map((item) => ({
    name: item.name,
    description: item.description ?? "",
    quantity: sanitizeQuantity(item.quantity),
    unitPrice: sanitizePrice(item.unitPrice),
    lineTotal: roundCurrency(item.quantity * item.unitPrice),
  }));

  if (update.removeItems && update.removeItems.length > 0) {
    items = items.filter(
      (item) => !update.removeItems!.some((targetName) => namesMatch(item.name, targetName)),
    );
  }

  if (update.updateItems && update.updateItems.length > 0) {
    for (const itemUpdate of update.updateItems) {
      const index = items.findIndex((item) => namesMatch(item.name, itemUpdate.targetName));
      if (index === -1) {
        continue;
      }

      const current = items[index];
      const nextQuantity =
        itemUpdate.quantity !== undefined
          ? sanitizeQuantity(itemUpdate.quantity)
          : current.quantity;
      const nextUnitPrice =
        itemUpdate.unitPrice !== undefined
          ? sanitizePrice(itemUpdate.unitPrice)
          : current.unitPrice;

      items[index] = {
        name: itemUpdate.name ? ensureNotEmpty(itemUpdate.name, current.name) : current.name,
        description:
          itemUpdate.description !== undefined ? itemUpdate.description : current.description,
        quantity: nextQuantity,
        unitPrice: nextUnitPrice,
        lineTotal: roundCurrency(nextQuantity * nextUnitPrice),
      };
    }
  }

  if (update.addItems && update.addItems.length > 0) {
    for (const item of update.addItems) {
      const quantity = sanitizeQuantity(item.quantity);
      const unitPrice = sanitizePrice(item.unitPrice);

      items.push({
        name: ensureNotEmpty(item.name, "Service"),
        description: item.description ?? "",
        quantity,
        unitPrice,
        lineTotal: roundCurrency(quantity * unitPrice),
      });
    }
  }

  if (items.length === 0) {
    items = [
      {
        name: "Professional Services",
        description: "",
        quantity: 1,
        unitPrice: 0,
        lineTotal: 0,
      },
    ];
  }

  const normalizedIssueDate = set.issueDate ? normalizeDate(set.issueDate) : null;
  const normalizedDueDate = set.dueDate ? normalizeDate(set.dueDate) : null;

  let taxRate =
    set.taxRate !== undefined ? clampTaxRate(set.taxRate) : clampTaxRate(invoice.taxRate);

  if (update.adjustments?.taxRateDelta !== undefined) {
    taxRate = clampTaxRate(taxRate + update.adjustments.taxRateDelta);
  }

  const parsedDiscountType = editableDiscountType.safeParse(invoice.discountType);
  let discountType: "PERCENTAGE" | "FIXED" = set.discountType
    ? set.discountType
    : parsedDiscountType.success
      ? parsedDiscountType.data
      : "PERCENTAGE";
  let discountRate =
    set.discountRate !== undefined
      ? clampDiscountRate(set.discountRate)
      : clampDiscountRate(invoice.discountRate);
  let discountAmount =
    set.discountAmount !== undefined
      ? roundCurrency(Math.max(0, set.discountAmount))
      : roundCurrency(Math.max(0, invoice.discountAmount));

  if (!set.discountType && set.discountRate !== undefined) {
    discountType = "PERCENTAGE";
  }
  if (!set.discountType && set.discountAmount !== undefined && set.discountRate === undefined) {
    discountType = "FIXED";
  }

  if (update.adjustments?.discountRateDelta !== undefined) {
    discountType = "PERCENTAGE";
    discountRate = clampDiscountRate(discountRate + update.adjustments.discountRateDelta);
  }

  if (update.adjustments?.discountAmountDelta !== undefined) {
    discountType = "FIXED";
    discountAmount = roundCurrency(
      Math.max(0, discountAmount + update.adjustments.discountAmountDelta),
    );
  }

  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.lineTotal, 0));
  if (discountType === "PERCENTAGE") {
    discountRate = clampDiscountRate(discountRate);
    discountAmount = roundCurrency((subtotal * discountRate) / 100);
  } else {
    discountAmount = clampDiscountAmount(discountAmount, subtotal);
    discountRate = subtotal > 0 ? roundCurrency((discountAmount / subtotal) * 100) : 0;
  }

  const taxableSubtotal = roundCurrency(subtotal - discountAmount);
  const taxAmount = roundCurrency((taxableSubtotal * taxRate) / 100);
  const total = roundCurrency(taxableSubtotal + taxAmount);

  return {
    title: set.title ? ensureNotEmpty(set.title, invoice.title) : invoice.title,
    currency: set.currency ?? normalizeCurrency(invoice.currency),
    issueDate: normalizedIssueDate ?? invoice.issueDate,
    dueDate: normalizedDueDate ?? invoice.dueDate,
    fromName: set.fromName ? ensureNotEmpty(set.fromName, invoice.fromName) : invoice.fromName,
    fromEmail: set.fromEmail ? ensureNotEmpty(set.fromEmail, invoice.fromEmail) : invoice.fromEmail,
    fromAddress: set.fromAddress
      ? ensureNotEmpty(set.fromAddress, invoice.fromAddress)
      : invoice.fromAddress,
    billToName: set.billToName
      ? ensureNotEmpty(set.billToName, invoice.billToName)
      : invoice.billToName,
    billToEmail: set.billToEmail
      ? ensureNotEmpty(set.billToEmail, invoice.billToEmail)
      : invoice.billToEmail,
    billToAddress: set.billToAddress
      ? ensureNotEmpty(set.billToAddress, invoice.billToAddress)
      : invoice.billToAddress,
    notes: set.notes ?? invoice.notes ?? "",
    discountType,
    discountRate,
    discountAmount,
    taxRate,
    subtotal,
    taxAmount,
    total,
    items,
  };
}
