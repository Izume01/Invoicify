export type InvoiceStatus = "DRAFT" | "GENERATING" | "READY" | "ERROR";
export type InvoiceDiscountType = "PERCENTAGE" | "FIXED";

export type InvoiceSummary = {
  id: string;
  title: string;
  clientName: string;
  status: InvoiceStatus;
  invoiceNumber: string;
  currency: string;
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceItem = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceVersion = {
  id: string;
  version: number;
  sourcePrompt: string;
  snapshot: unknown;
  createdAt: string;
};

export type InvoiceDetail = {
  id: string;
  userId: string;
  clerkUserId: string;
  title: string;
  status: InvoiceStatus;
  prompt: string | null;
  sourceText: string | null;
  invoiceNumber: string;
  currency: string;
  issueDate: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  billToName: string;
  billToEmail: string;
  billToAddress: string;
  notes: string | null;
  subtotal: number;
  discountType: InvoiceDiscountType;
  discountRate: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  rawJson: unknown;
  items: InvoiceItem[];
  versions?: InvoiceVersion[];
  createdAt: string;
  updatedAt: string;
};
