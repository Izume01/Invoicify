import { FileText, History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import InvoiceList from "@/features/invoices/components/InvoiceList";

export default function InvoicesPage() {
  return (
    <div className="space-y-5 pb-4">
      <Card className="surface-panel rounded-3xl">
        <CardContent className="space-y-5 py-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              <History className="size-3" />
              Invoice History
            </Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Invoice Library</h2>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Review generated invoices, compare statuses, and jump into previews or downloads without
                leaving your workspace.
              </p>
            </div>

            <div className="surface-soft inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground">
              <FileText className="size-4 text-primary" />
              Version snapshots are preserved automatically.
            </div>
          </div>
        </CardContent>
      </Card>

      <InvoiceList />
    </div>
  );
}
