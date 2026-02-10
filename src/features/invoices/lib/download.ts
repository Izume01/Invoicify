import type { InvoiceDetail } from "@/types/invoice";

const PRINT_WINDOW_FEATURES = "width=1100,height=800";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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

function toFileStem(invoice: InvoiceDetail): string {
  const preferred = invoice.invoiceNumber || `invoice-${invoice.id}`;
  return preferred.replace(/[^a-zA-Z0-9-_.]+/g, "-");
}

function formatDiscountLabel(invoice: InvoiceDetail): string {
  if (invoice.discountType === "FIXED") {
    return "Discount";
  }

  return `Discount (${invoice.discountRate}%)`;
}

function buildInvoicePrintHtml(invoice: InvoiceDetail): string {
  const rows = invoice.items
    .map((item) => {
      return `<tr style="border-bottom: 1px solid rgba(88, 113, 143, 0.22);">
        <td style="padding: 16px 12px; vertical-align: top;">
          <div style="font-weight: 700; font-size: 16px;">${escapeHtml(item.name)}</div>
          ${item.description ? `<div style="font-size: 12px; color: #9fb2c9; margin-top: 4px; line-height: 1.4;">${escapeHtml(item.description)}</div>` : ""}
        </td>
        <td style="padding: 16px 12px; text-align: center; vertical-align: top; font-weight: 500;">${item.quantity}</td>
        <td style="padding: 16px 12px; text-align: right; vertical-align: top; font-weight: 500;">${escapeHtml(formatCurrency(item.unitPrice, invoice.currency))}</td>
        <td style="padding: 16px 12px; text-align: right; vertical-align: top; font-weight: 700; font-size: 18px;">${escapeHtml(formatCurrency(item.lineTotal, invoice.currency))}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(toFileStem(invoice))}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
      
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #d6e1ef;
        background: #101923;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: #101923;
        padding: 48px;
        position: relative;
        display: flex;
        flex-direction: column;
      }
      @page {
        size: A4;
        margin: 0;
      }
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 48px;
        padding-top: 16px;
      }
      .invoice-title {
        font-family: 'Playfair Display', serif;
        font-size: 72px;
        font-weight: 700;
        margin: 0 0 24px 0;
        text-transform: uppercase;
        line-height: 0.8;
      }
      .label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #8fa2ba;
        margin-bottom: 4px;
        display: block;
      }
      .bill-to {
        margin-top: 24px;
      }
      .bill-to-name {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
      }
      .bill-to-address {
        font-size: 14px;
        color: #b6c5d9;
        white-space: pre-wrap;
        line-height: 1.5;
        margin-top: 4px;
      }
      .invoice-meta {
        text-align: right;
        display: grid;
        grid-template-columns: auto auto;
        gap: 4px 32px;
        align-items: baseline;
      }
      .meta-val {
        font-weight: 500;
        font-size: 16px;
      }
      .status-badge {
        background: #689fff;
        color: #0f1825;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 99px;
        display: inline-block;
        margin-top: 12px;
      }
      .items-container {
        background: #152333;
        color: #d6e1ef;
        border-radius: 32px;
        border: 1px solid #2d425e;
        padding: 32px;
        margin-bottom: 32px;
        flex: 1;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      th {
        text-align: left;
        padding-bottom: 16px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #8fa2ba;
        border-bottom: 1px solid #324862;
      }
      th.text-center { text-align: center; }
      th.text-right { text-align: right; }
      
      .footer-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 48px;
        margin-top: auto;
      }
      .asterisk {
        font-size: 64px;
        line-height: 1;
        color: #6f8fb7;
        margin-top: 32px;
      }
      .totals-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 14px;
      }
      .total-final {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-top: 24px;
        margin-bottom: 32px;
        border-top: 1px solid #2b3f59;
        padding-top: 16px;
      }
      .amount-large {
        font-family: 'Playfair Display', serif;
        font-size: 36px;
        font-weight: 700;
      }
      .terms-box {
        background: #131f2d;
        border: 1px solid #2c425d;
        border-radius: 12px;
        padding: 20px;
        font-size: 12px;
      }
      .terms-title {
        font-weight: 700;
        margin: 0 0 8px 0;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header-section">
        <div>
          <h1 class="invoice-title">Invoice</h1>
          <div class="bill-to">
            <span class="label">Bill To</span>
            <p class="bill-to-name">${escapeHtml(invoice.billToName)}</p>
            <div class="bill-to-address">${escapeHtml(invoice.billToAddress)}</div>
            <div style="font-size: 14px; color: #b6c5d9; margin-top: 4px;">${escapeHtml(invoice.billToEmail)}</div>
          </div>
        </div>

        <div style="text-align: right;">
          <div class="invoice-meta">
            <span class="label">Invoice Date</span>
            <span class="meta-val">${formatDate(invoice.issueDate)}</span>
            
            <span class="label">Invoice No.</span>
            <span class="meta-val">${escapeHtml(invoice.invoiceNumber)}</span>
            
            ${invoice.dueDate ? `<span class="label">Due Date</span><span class="meta-val">${formatDate(invoice.dueDate)}</span>` : ''}
          </div>
          <div class="status-badge">${escapeHtml(invoice.status)}</div>
        </div>
      </div>

      <div class="items-container">
        <table>
          <thead>
            <tr>
              <th width="40%">Item Description</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Rate</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <div class="footer-grid">
        <div>
            <span class="label">Payment Method</span>
            <div style="font-size: 14px; font-weight: 500; opacity: 0.8; margin-top: 8px;">
              <div>Bank Transfer</div>
              <div>Account Name: ${escapeHtml(invoice.fromName)}</div>
            </div>

            <div class="asterisk">&#10033;</div>
            <div style="font-size: 12px; opacity: 0.5; font-weight: 500; margin-top: 8px;">
               Project Reference: #${escapeHtml(invoice.invoiceNumber.replace(/\D/g,''))}
            </div>
        </div>

        <div>
           <div style="padding-bottom: 12px;">
             <div class="totals-row">
               <span class="label">Subtotal</span>
               <span style="font-weight: 700;">${escapeHtml(formatCurrency(invoice.subtotal, invoice.currency))}</span>
             </div>
             ${invoice.discountAmount > 0
               ? `<div class="totals-row">
               <span class="label">${escapeHtml(formatDiscountLabel(invoice))}</span>
               <span style="font-weight: 700;">-${escapeHtml(formatCurrency(invoice.discountAmount, invoice.currency))}</span>
             </div>`
               : ""}
             <div class="totals-row">
               <span class="label">Taxes (${invoice.taxRate}%)</span>
               <span style="font-weight: 700;">${escapeHtml(formatCurrency(invoice.taxAmount, invoice.currency))}</span>
             </div>
           </div>

           <div class="total-final">
             <span class="label">Total</span>
             <span class="amount-large">${escapeHtml(formatCurrency(invoice.total, invoice.currency))}</span>
           </div>

           <div class="terms-box">
             <p class="terms-title">Terms & Conditions</p>
             <div style="opacity: 0.7; line-height: 1.4;">
               Please send payment within 30 days of receiving this invoice. There will be a 5% interest charge per month on late invoices.
             </div>
           </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function openPrintWindow(): Window | null {
  return window.open("", "_blank", PRINT_WINDOW_FEATURES);
}

export function openInvoicePdfWindow(): Window | null {
  const printWindow = openPrintWindow();
  if (!printWindow) {
    return null;
  }

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Preparing invoice...</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        color: #d6e1ef;
        background: #101923;
      }
      p {
        font-size: 14px;
        color: #9eb4cc;
      }
    </style>
  </head>
  <body>
    <p>Preparing invoice PDF...</p>
  </body>
</html>`);
  printWindow.document.close();

  return printWindow;
}

export function downloadInvoiceJson(invoice: InvoiceDetail): void {
  const blob = new Blob([JSON.stringify(invoice, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${toFileStem(invoice)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadInvoicePdf(
  invoice: InvoiceDetail,
  targetWindow?: Window | null,
): boolean {
  const html = buildInvoicePrintHtml(invoice);
  let printWindow = targetWindow ?? openPrintWindow();

  // If the browser blocks the pop-up, fail gracefully instead of throwing.
  if (!printWindow) {
    return false;
  }

  try {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  } catch {
    printWindow = openPrintWindow();
    if (!printWindow) {
      return false;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  }

  // Try printing once the window has finished loading, with a timeout as a fallback.
  let hasTriggeredPrint = false;
  const triggerPrint = () => {
    if (hasTriggeredPrint) {
      return;
    }
    hasTriggeredPrint = true;

    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      // Ignore print errors; at worst the user can use the browser menu.
    }
  };

  if (printWindow.document.readyState === "complete") {
    window.setTimeout(triggerPrint, 50);
  } else if ("onload" in printWindow) {
    printWindow.onload = triggerPrint;
  }

  window.setTimeout(triggerPrint, 500);
  return true;
}
