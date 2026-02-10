import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const signInHighlights = [
  "Live invoice generation and previews",
  "Snapshot history across every edit",
  "Secure account-linked invoice library",
];

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 34%), radial-gradient(circle at 86% 100%, color-mix(in oklab, var(--primary) 15%, transparent), transparent 36%)",
        }}
      />

      <div className="relative grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_440px] lg:gap-8">
        <section className="surface-soft hidden flex-col justify-center rounded-3xl p-8 lg:flex">
          <Link
            href="/"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>

          <Badge variant="outline" className="w-fit bg-card/70">
            <ShieldCheck className="size-3" />
            Secure sign-in
          </Badge>

          <h1 className="mt-4 max-w-sm text-3xl font-semibold tracking-tight text-foreground">
            Welcome back to your invoice command center.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Pick up exactly where you left off with your latest drafts, previews, and export-ready invoices.
          </p>

          <div className="mt-8 space-y-3">
            {signInHighlights.map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm text-foreground/90">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="surface-panel rounded-3xl p-4 sm:p-6">
          <div className="mb-5 px-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Invoicify</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Sign in</h2>
            <p className="mt-1 text-sm text-muted-foreground">Access your workspace and continue building invoices.</p>
          </div>

          <SignIn
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "bg-transparent shadow-none p-0",
                header: "hidden",
                formFieldLabel: "text-muted-foreground text-xs uppercase tracking-[0.12em]",
                formFieldInput:
                  "h-10 rounded-lg border border-border/80 bg-input/70 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/40",
                formButtonPrimary:
                  "h-10 rounded-lg border border-primary/30 bg-primary text-primary-foreground hover:bg-primary/92",
                socialButtonsBlockButton:
                  "h-10 rounded-lg border border-border/80 bg-card/65 text-foreground hover:bg-card",
                socialButtonsBlockButtonText: "text-sm text-foreground",
                dividerLine: "bg-border/80",
                dividerText: "text-xs uppercase tracking-[0.12em] text-muted-foreground",
                footerActionText: "text-xs text-muted-foreground",
                footerActionLink: "text-sm text-foreground hover:text-primary",
                formResendCodeLink: "text-primary hover:text-primary/85",
                otpCodeFieldInput:
                  "h-10 rounded-lg border border-border/80 bg-input/70 text-foreground focus:border-primary/50",
              },
            }}
          />
        </section>
      </div>
    </main>
  );
}
