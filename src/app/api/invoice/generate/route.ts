import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { InvoiceStatus, Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { generateInvoiceDraft } from "@/lib/invoice-generator";
import { serializeInvoice } from "@/lib/invoice-response";
import { UnauthorizedError, requireDbUserForApi } from "@/lib/user";

const requestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required."),
  extractedText: z.string().optional().default(""),
  invoiceId: z.string().optional(),
  stream: z.boolean().optional().default(true),
});

type GenerationActor = {
  clerkUserId: string;
  dbUserId: string;
  defaultFromName: string;
  defaultFromEmail: string;
};

function toDecimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

function toSsePayload(payload: Record<string, unknown>): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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

async function persistInvoice(args: {
  invoiceId?: string;
  clerkUserId: string;
  dbUserId: string;
  prompt: string;
  extractedText: string;
  defaultFromName: string;
  defaultFromEmail: string;
}) {
  const draft = generateInvoiceDraft({
    prompt: args.prompt,
    extractedText: args.extractedText,
    defaultFromName: args.defaultFromName,
    defaultFromEmail: args.defaultFromEmail,
  });

  const rawJson = {
    title: draft.title,
    invoiceNumber: draft.invoiceNumber,
    currency: draft.currency,
    issueDate: draft.issueDate,
    dueDate: draft.dueDate,
    from: {
      name: draft.fromName,
      email: draft.fromEmail,
      address: draft.fromAddress,
    },
    billTo: {
      name: draft.billToName,
      email: draft.billToEmail,
      address: draft.billToAddress,
    },
    notes: draft.notes,
    subtotal: draft.subtotal,
    discountType: draft.discountType,
    discountRate: draft.discountRate,
    discountAmount: draft.discountAmount,
    taxRate: draft.taxRate,
    taxAmount: draft.taxAmount,
    total: draft.total,
    items: draft.items,
    prompt: draft.prompt,
    sourceText: draft.sourceText,
  };

  const discountFields = {
    discountType: draft.discountType,
    discountRate: toDecimal(draft.discountRate),
    discountAmount: toDecimal(draft.discountAmount),
  };

  if (args.invoiceId) {
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: args.invoiceId,
        userId: args.dbUserId,
      },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!existingInvoice) {
      throw new Error("INVOICE_NOT_FOUND");
    }

    const nextVersion = (existingInvoice.versions[0]?.version ?? 0) + 1;

    const updatedInvoice = await withDiscountFieldFallback((includeDiscountFields) =>
      prisma.invoice.update({
        where: { id: existingInvoice.id },
        data: {
          title: draft.title,
          status: InvoiceStatus.READY,
          prompt: draft.prompt,
          sourceText: draft.sourceText,
          invoiceNumber: draft.invoiceNumber,
          currency: draft.currency,
          issueDate: draft.issueDate,
          dueDate: draft.dueDate,
          fromName: draft.fromName,
          fromEmail: draft.fromEmail,
          fromAddress: draft.fromAddress,
          billToName: draft.billToName,
          billToEmail: draft.billToEmail,
          billToAddress: draft.billToAddress,
          notes: draft.notes,
          subtotal: toDecimal(draft.subtotal),
          ...(includeDiscountFields ? discountFields : {}),
          taxRate: toDecimal(draft.taxRate),
          taxAmount: toDecimal(draft.taxAmount),
          total: toDecimal(draft.total),
          rawJson,
          items: {
            deleteMany: {},
            create: draft.items.map((item) => ({
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
              sourcePrompt: args.prompt,
              snapshot: rawJson,
            },
          },
        },
        include: {
          items: true,
          versions: true,
        },
      }),
    );

    return updatedInvoice;
  }

  const createdInvoice = await withDiscountFieldFallback((includeDiscountFields) =>
    prisma.invoice.create({
      data: {
        userId: args.dbUserId,
        clerkUserId: args.clerkUserId,
        title: draft.title,
        status: InvoiceStatus.READY,
        prompt: draft.prompt,
        sourceText: draft.sourceText,
        invoiceNumber: draft.invoiceNumber,
        currency: draft.currency,
        issueDate: draft.issueDate,
        dueDate: draft.dueDate,
        fromName: draft.fromName,
        fromEmail: draft.fromEmail,
        fromAddress: draft.fromAddress,
        billToName: draft.billToName,
        billToEmail: draft.billToEmail,
        billToAddress: draft.billToAddress,
        notes: draft.notes,
        subtotal: toDecimal(draft.subtotal),
        ...(includeDiscountFields ? discountFields : {}),
        taxRate: toDecimal(draft.taxRate),
        taxAmount: toDecimal(draft.taxAmount),
        total: toDecimal(draft.total),
        rawJson,
        items: {
          create: draft.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: toDecimal(item.unitPrice),
            lineTotal: toDecimal(item.lineTotal),
          })),
        },
        versions: {
          create: {
            version: 1,
            sourcePrompt: args.prompt,
            snapshot: rawJson,
          },
        },
      },
      include: {
        items: true,
        versions: true,
      },
    }),
  );

  return createdInvoice;
}

async function generateAndSaveInvoice(args: {
  prompt: string;
  extractedText: string;
  invoiceId?: string;
  actor: GenerationActor;
}) {
  const invoice = await persistInvoice({
    invoiceId: args.invoiceId,
    clerkUserId: args.actor.clerkUserId,
    dbUserId: args.actor.dbUserId,
    prompt: args.prompt,
    extractedText: args.extractedText,
    defaultFromName: args.actor.defaultFromName,
    defaultFromEmail: args.actor.defaultFromEmail,
  });

  return serializeInvoice(invoice);
}

function getInvoiceGenerationErrorMessage(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return "You must be signed in to generate invoices.";
  }

  if (error instanceof Error && error.message === "INVOICE_NOT_FOUND") {
    return "Invoice not found.";
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Invoice number conflict. Please generate again.";
    }

    if (error.code === "P2025") {
      return "Invoice not found.";
    }
  }

  if (isUnknownDiscountArgumentError(error)) {
    return "Invoice schema mismatch detected. Restart the dev server and run Prisma generate.";
  }

  if (process.env.NODE_ENV !== "production" && error instanceof Error) {
    return error.message;
  }

  return "Invoice generation failed.";
}

export async function POST(request: NextRequest) {
  try {
    const body = requestSchema.parse(await request.json());
    const { clerkUserId, dbUser } = await requireDbUserForApi();
    const actor: GenerationActor = {
      clerkUserId,
      dbUserId: dbUser.id,
      defaultFromName: dbUser.name ?? "Your Business",
      defaultFromEmail: dbUser.email ?? "billing@example.com",
    };

    if (!body.stream) {
      const invoice = await generateAndSaveInvoice({
        prompt: body.prompt,
        extractedText: body.extractedText,
        invoiceId: body.invoiceId,
        actor,
      });

      return NextResponse.json({ invoice }, { status: 201 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(
              toSsePayload({ type: "progress", stage: "analyzing", message: "Analyzing your request..." }),
            ),
          );

          await wait(220);

          controller.enqueue(
            encoder.encode(
              toSsePayload({ type: "progress", stage: "drafting", message: "Drafting invoice structure..." }),
            ),
          );

          await wait(220);

          const invoice = await generateAndSaveInvoice({
            prompt: body.prompt,
            extractedText: body.extractedText,
            invoiceId: body.invoiceId,
            actor,
          });

          controller.enqueue(
            encoder.encode(
              toSsePayload({ type: "progress", stage: "saving", message: "Saving invoice to database..." }),
            ),
          );

          await wait(160);

          controller.enqueue(
            encoder.encode(toSsePayload({ type: "result", message: "Invoice ready", invoice })),
          );
        } catch (error) {
          console.error("[Generate Invoice SSE Error]:", error);

          controller.enqueue(
            encoder.encode(toSsePayload({ type: "error", message: getInvoiceGenerationErrorMessage(error) })),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
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

    if (error instanceof Error && error.message === "INVOICE_NOT_FOUND") {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ error: getInvoiceGenerationErrorMessage(error) }, { status: 500 });
  }
}
