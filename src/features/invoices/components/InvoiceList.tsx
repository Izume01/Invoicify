"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Download, Eye, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadInvoicePdf, openInvoicePdfWindow } from "@/features/invoices/lib/download";
import type { InvoiceDetail, InvoiceSummary } from "@/types/invoice";

type InvoiceListProps = {
  refreshToken?: number;
  activeInvoiceId?: string | null;
  onPreview?: (invoiceId: string) => void;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(total: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(total);
}

function statusVariant(status: InvoiceSummary["status"]): "default" | "secondary" | "destructive" | "outline" {
  if (status === "READY") return "default";
  if (status === "ERROR") return "destructive";
  if (status === "GENERATING") return "secondary";
  return "outline";
}

export default function InvoiceList({
  refreshToken = 0,
  activeInvoiceId = null,
  onPreview,
}: InvoiceListProps) {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  const refreshInvoices = useCallback(async () => {
    try {
      setErrorMessage(null);

      const response = await fetch("/api/invoices", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch invoices.");
      }

      const payload = (await response.json()) as { invoices: InvoiceSummary[] };
      setInvoices(payload.invoices ?? []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load invoices. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    void refreshInvoices();
  }, [refreshInvoices, refreshToken]);

  const handleDownload = async (invoiceId: string) => {
    const printWindow = openInvoicePdfWindow();
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups for this site to download PDFs.");
      return;
    }

    try {
      setDownloadingInvoiceId(invoiceId);

      const response = await fetch(`/api/invoice/${invoiceId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to load invoice for download.");
      }

      const payload = (await response.json()) as { invoice: InvoiceDetail };
      const didStartDownload = downloadInvoicePdf(payload.invoice, printWindow);
      if (!didStartDownload) {
        throw new Error("Pop-up blocked. Please allow pop-ups for this site to download PDFs.");
      }

      toast.success("Invoice ready to print or save as PDF.");
    } catch (error) {
      if (!printWindow.closed) {
        printWindow.close();
      }

      const message =
        error instanceof Error ? error.message : "Unable to download invoice PDF.";
      toast.error(message);
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  return (
    <Card className="surface-panel rounded-3xl">
      <CardHeader className="gap-1 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
            <CardDescription className="text-sm">
              {isLoading
                ? "Syncing invoice history..."
                : `${invoices.length} invoice${invoices.length === 1 ? "" : "s"} generated`}
            </CardDescription>
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => {
              setIsLoading(true);
              void refreshInvoices();
            }}
          >
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((slot) => (
              <div key={slot} className="h-12 animate-pulse rounded-xl border border-border/70 bg-card/55" />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-10 text-center">
            <div className="rounded-full border border-destructive/40 bg-destructive/14 p-3 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold">Unable to load invoice history</p>
            <p className="mt-1 text-xs text-muted-foreground">{errorMessage}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setIsLoading(true);
                void refreshInvoices();
              }}
            >
              Retry
            </Button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/75 bg-card/40 py-12 text-center">
            <p className="text-sm font-medium text-foreground">No invoices yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Generate one from the composer above.</p>
          </div>
        ) : (
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const isActive = activeInvoiceId === invoice.id;

                return (
                  <TableRow
                    key={invoice.id}
                    data-state={isActive ? "selected" : undefined}
                    className="data-[state=selected]:border-primary/40 data-[state=selected]:bg-primary/12 data-[state=selected]:hover:bg-primary/16"
                  >
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground">{invoice.title}</p>
                        <p className="text-xs text-muted-foreground">{invoice.clientName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(invoice.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/90">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(invoice.status)} className="font-semibold">
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {onPreview ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1.5"
                            onClick={() => onPreview(invoice.id)}
                          >
                            <Eye className="size-4" />
                            <span className="hidden sm:inline">Preview</span>
                            <span className="sr-only sm:hidden">Preview</span>
                          </Button>
                        ) : (
                          <Button asChild type="button" size="sm" variant="ghost" className="h-8 gap-1.5">
                            <Link href={`/dashboard/invoices/${invoice.id}`}>
                              <Eye className="size-4" />
                              <span className="hidden sm:inline">Preview</span>
                              <span className="sr-only sm:hidden">Preview</span>
                            </Link>
                          </Button>
                        )}

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1.5"
                          onClick={() => void handleDownload(invoice.id)}
                          disabled={downloadingInvoiceId === invoice.id}
                        >
                          {downloadingInvoiceId === invoice.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Download className="size-4" />
                          )}
                          <span className="hidden sm:inline">Download</span>
                          <span className="sr-only sm:hidden">Download PDF</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
