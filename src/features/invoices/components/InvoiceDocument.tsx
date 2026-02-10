import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InvoiceDetail } from "@/types/invoice";

type InvoiceDocumentProps = {
  invoice: InvoiceDetail;
  className?: string;
  compact?: boolean;
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusVariant(status: InvoiceDetail["status"]): "default" | "secondary" | "destructive" | "outline" {
  if (status === "READY") return "default";
  if (status === "ERROR") return "destructive";
  if (status === "GENERATING") return "secondary";
  return "outline";
}

function formatDiscountLabel(invoice: InvoiceDetail): string {
  if (invoice.discountType === "FIXED") {
    return "Discount";
  }

  return `Discount (${invoice.discountRate}%)`;
}

export default function InvoiceDocument({
  invoice,
  className,
}: InvoiceDocumentProps) {
  return (
    <article
      className={cn(
        "relative mx-auto flex min-h-[297mm] w-[210mm] flex-col overflow-hidden rounded-[30px] border border-[#2a3d57] bg-[#101923] p-10 font-sans text-[#d6e1ef] shadow-[0_40px_95px_-55px_rgba(3,10,19,0.98)]",
        className,
      )}
      id="invoice-document"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-80"
        style={{
          background: "radial-gradient(circle, rgba(104,159,255,0.25), transparent 68%)",
        }}
      />

      <header className="relative mb-10 grid gap-8 border-b border-[#2b3f5a] pb-8 sm:grid-cols-[1fr_auto]">
        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fa2ba]">Invoicify</p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight text-[#f2f7ff]">Invoice</h1>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#90a2ba]">Bill To</p>
            <p className="text-lg font-semibold text-[#f0f6ff]">{invoice.billToName}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#b6c5d9]">{invoice.billToAddress}</p>
            <p className="text-sm text-[#b6c5d9]">{invoice.billToEmail}</p>
          </div>
        </div>

        <div className="space-y-3 text-right">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-right text-sm">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8fa2ba]">Invoice Date</span>
            <span className="font-medium text-[#edf3fd]">{formatDate(invoice.issueDate)}</span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8fa2ba]">Invoice No.</span>
            <span className="font-medium text-[#edf3fd]">{invoice.invoiceNumber}</span>

            {invoice.dueDate ? (
              <>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8fa2ba]">Due Date</span>
                <span className="font-medium text-[#edf3fd]">{formatDate(invoice.dueDate)}</span>
              </>
            ) : null}
          </div>

          <div>
            <Badge variant={statusVariant(invoice.status)} className="px-3 py-1 text-[10px] uppercase tracking-[0.16em]">
              {invoice.status}
            </Badge>
          </div>
        </div>
      </header>

      <section className="relative mb-8 flex-1 rounded-3xl border border-[#2d425e] bg-[#152333] p-7">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#324862] text-left">
              <th className="w-[42%] pb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8fa2ba]">
                Item Description
              </th>
              <th className="pb-4 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8fa2ba]">
                Qty
              </th>
              <th className="pb-4 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8fa2ba]">
                Rate
              </th>
              <th className="pb-4 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8fa2ba]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b415b]">
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-5 pr-4 align-top">
                  <p className="text-base font-semibold text-[#ecf3fc]">{item.name}</p>
                  {item.description ? (
                    <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#9eb3cb]">{item.description}</p>
                  ) : null}
                </td>
                <td className="py-5 text-center align-top text-sm text-[#d2deec]">{item.quantity}</td>
                <td className="py-5 text-right align-top text-sm text-[#d2deec]">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="py-5 text-right align-top text-base font-semibold text-[#edf3fd]">
                  {formatCurrency(item.lineTotal, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="mt-auto grid gap-8 sm:grid-cols-2">
        <section className="space-y-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#90a2ba]">From</p>
            <p className="mt-2 text-sm font-medium text-[#ecf3fc]">{invoice.fromName}</p>
            <p className="text-sm text-[#b6c5d9]">{invoice.fromEmail}</p>
            <p className="whitespace-pre-wrap text-sm text-[#b6c5d9]">{invoice.fromAddress}</p>
          </div>

          <div className="rounded-xl border border-[#2c425d] bg-[#131f2d] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#90a2ba]">Notes</p>
            <p className="mt-2 text-xs leading-relaxed text-[#b6c5d9]">
              {invoice.notes?.trim() ||
                "Payment is due within 30 days. Late invoices are subject to a 5% monthly service fee."}
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-[#2c425d] bg-[#131f2d] p-5">
          <div className="space-y-2 border-b border-[#2b3f59] pb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#95a8c1]">Subtotal</span>
              <span className="font-semibold text-[#edf3fd]">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.discountAmount > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#95a8c1]">{formatDiscountLabel(invoice)}</span>
                <span className="font-semibold text-[#edf3fd]">
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
            ) : null}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#95a8c1]">Tax ({invoice.taxRate}%)</span>
              <span className="font-semibold text-[#edf3fd]">
                {formatCurrency(invoice.taxAmount, invoice.currency)}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#95a8c1]">Total</span>
            <span className="text-3xl font-semibold tracking-tight text-[#f6fbff]">
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>
        </section>
      </footer>
    </article>
  );
}
