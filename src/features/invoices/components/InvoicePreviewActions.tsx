"use client";

import Link from "next/link";
import { Download, FileJson, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

type InvoicePreviewActionsProps = {
  invoiceId: string;
  invoiceNumber: string;
  invoiceJson: string;
};

export default function InvoicePreviewActions({
  invoiceId,
  invoiceNumber,
  invoiceJson,
}: InvoicePreviewActionsProps) {
  const downloadJson = () => {
    const blob = new Blob([invoiceJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoiceNumber || `invoice-${invoiceId}`}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="secondary" onClick={() => window.print()}>
        <Download className="size-4" />
        Print / PDF
      </Button>

      <Button type="button" variant="outline" size="sm" onClick={downloadJson}>
        <FileJson className="size-4" />
        JSON
      </Button>

      <Button asChild>
        <Link href={`/dashboard?edit=${invoiceId}`}>
          <MessageSquare className="size-4" />
          Edit via Chat
        </Link>
      </Button>
    </div>
  );
}
