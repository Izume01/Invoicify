"use client";

import { Download, FileJson } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InvoiceDetail } from "@/types/invoice";

import InvoiceDocument from "./InvoiceDocument";

type InvoicePreviewModalProps = {
  open: boolean;
  invoice: InvoiceDetail | null;
  onClose: () => void;
  onDownloadPdf: () => void;
  onDownloadJson: () => void;
};

export default function InvoicePreviewModal({
  open,
  invoice,
  onClose,
  onDownloadPdf,
  onDownloadJson,
}: InvoicePreviewModalProps) {
  if (!invoice) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[92vh] max-w-[min(1180px,96vw)] overflow-hidden rounded-3xl p-0">
        <DialogHeader className="border-b border-border/70 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <DialogTitle>{invoice.invoiceNumber}</DialogTitle>
              <DialogDescription className="mt-1 text-xs uppercase tracking-[0.14em]">
                Full Invoice Preview
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={onDownloadPdf}>
                <Download className="size-4" />
                PDF
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onDownloadJson}>
                <FileJson className="size-4" />
                JSON
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-auto bg-background/60 px-4 py-6 sm:px-6">
          <div className="mx-auto w-fit rounded-2xl border border-border/75 bg-background/75 p-3 shadow-[0_30px_80px_-55px_hsl(var(--app-shadow)/1)]">
            <InvoiceDocument invoice={invoice} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
