import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const signUpHighlights = [
  "Draft invoices from prompts and attachments",
  "Apply tax, discounts, and revision commands",
  "Export JSON and print-ready PDF instantly",
];

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 14% 0%, color-mix(in oklab, var(--primary) 19%, transparent), transparent 34%), radial-gradient(circle at 82% 100%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 37%)",
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
            <Sparkles className="size-3" />
            Start premium workspace
          </Badge>

          <h1 className="mt-4 max-w-sm text-3xl font-semibold tracking-tight text-foreground">
            Create your dark-mode invoice workspace.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Set up your account and start shipping clean, consistent invoice workflows in minutes.
          </p>

          <div className="mt-8 space-y-3">
            {signUpHighlights.map((item) => (
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
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Create account</h2>
            <p className="mt-1 text-sm text-muted-foreground">Build your workspace and generate your first invoice.</p>
          </div>

          <SignUp
            path="/sign-up"
            signInUrl="/sign-in"
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
