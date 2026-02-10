import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileJson } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import InvoicePreviewActions from "@/features/invoices/components/InvoicePreviewActions";
import InvoiceDocument from "@/features/invoices/components/InvoiceDocument";
import { serializeInvoice } from "@/lib/invoice-response";
import prisma from "@/lib/prisma";
import { requireUserIdForPage, syncUserRecord } from "@/lib/user";

type InvoicePreviewPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

async function resolveParams(
  params: InvoicePreviewPageProps["params"],
): Promise<{ id: string }> {
  if (typeof (params as Promise<{ id: string }>).then === "function") {
    return await (params as Promise<{ id: string }>);
  }

  return params as { id: string };
}

export default async function InvoicePreviewPage({ params }: InvoicePreviewPageProps) {
  const { id } = await resolveParams(params);
  const clerkUserId = await requireUserIdForPage();
  const dbUser = await syncUserRecord(clerkUserId);

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
    notFound();
  }

  const serialized = serializeInvoice(invoice);
  const invoiceJson = JSON.stringify(serialized, null, 2);

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-4 print:max-w-none print:space-y-2">
      <section className="surface-panel rounded-3xl p-5 print:hidden sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline">Invoice Detail</Badge>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {serialized.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {serialized.invoiceNumber} · {serialized.billToName}
              </p>
            </div>
          </div>

          <InvoicePreviewActions
            invoiceId={serialized.id}
            invoiceNumber={serialized.invoiceNumber}
            invoiceJson={invoiceJson}
          />
        </div>
      </section>

      <Card className="surface-panel rounded-3xl print:border-0 print:bg-transparent print:shadow-none">
        <CardContent className="pt-6 print:px-0">
          <div className="overflow-auto rounded-2xl border border-border/75 bg-background/45 p-4 print:border-0 print:bg-transparent print:p-0">
            <InvoiceDocument invoice={serialized} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 print:hidden">
            <Link
              href="/dashboard/invoices"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to invoices
            </Link>

            <Link
              href={`/dashboard?edit=${serialized.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/85"
            >
              <FileJson className="size-4" />
              Edit via chat workspace
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
