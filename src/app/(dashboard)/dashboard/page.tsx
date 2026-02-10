import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardAnalytics from "@/features/dashboard/components/DashboardAnalytics";
import InvoiceWorkspace from "@/features/dashboard/components/InvoiceWorkspace";

const dashboardHighlights = [
  {
    label: "Guided Prompting",
    detail: "Generate polished invoices from briefs, pasted notes, and attachments.",
  },
  {
    label: "Versioned Updates",
    detail: "Every edit is stored as a snapshot for full history and recoverability.",
  },
  {
    label: "One-Click Export",
    detail: "Download JSON or print-ready PDF without leaving the workspace.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-5 pb-4">
      <section className="surface-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 42%, transparent), transparent 68%)",
          }}
          aria-hidden="true"
        />

        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-card/65">
              <Sparkles className="size-3" />
              AI invoice orchestration
            </Badge>
          </div>

          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Build invoices at command speed with complete context.
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Start with a prompt, attach files, review live output, and push revisions without context loss.
              Designed for dense workflows that still feel calm.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-2 sm:grid-cols-3">
              {dashboardHighlights.map((item) => (
                <article key={item.label} className="surface-soft rounded-2xl p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{item.detail}</p>
                </article>
              ))}
            </div>

            <Button asChild className="h-10 w-full lg:w-auto">
              <Link href="#invoice-workspace">
                Open Composer
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <DashboardAnalytics />

      <InvoiceWorkspace />
    </div>
  );
}
