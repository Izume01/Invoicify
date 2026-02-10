import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="surface-panel rounded-3xl p-8 sm:p-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Invoicify</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Generate polished invoices from prompts and files.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
        AI-assisted drafting, live preview, and one-click exports in a premium dark workspace.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/sign-up">Get Started</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </section>
  );
}
