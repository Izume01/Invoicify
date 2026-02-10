import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Receipt,
  ShieldCheck,
  Sparkles,
  Zap,
  Globe,
  Lock,
  TrendingUp,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "AI-Powered Drafting",
    description:
      "Transform natural language prompts into professionally structured invoices with intelligent tax and discount handling.",
    icon: Sparkles,
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    title: "Real-Time Preview",
    description:
      "Watch your invoice take shape instantly with a live document preview that updates as you type.",
    icon: FileText,
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Version Control",
    description:
      "Every edit creates a snapshot. Roll back anytime, maintain full audit trails, never lose work.",
    icon: Layers,
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Lightning Fast",
    description:
      "Generate complete invoices in seconds. From prompt to polished PDF in under a minute.",
    icon: Zap,
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Secure & Private",
    description:
      "Enterprise-grade security with encrypted storage and account-linked access control.",
    icon: Lock,
    gradient: "from-rose-500/20 to-pink-500/20",
  },
  {
    title: "Global Ready",
    description:
      "Multi-currency support with automatic formatting for USD, EUR, GBP, and INR.",
    icon: Globe,
    gradient: "from-indigo-500/20 to-blue-500/20",
  },
];

const steps = [
  {
    step: "01",
    title: "Describe Your Invoice",
    description:
      "Type a natural language prompt like 'Invoice for Acme Corp, 3 hours consulting at $150/hr, 10% discount'",
  },
  {
    step: "02",
    title: "Review & Refine",
    description:
      "See your invoice generated instantly. Make quick edits with AI-assisted refinements.",
  },
  {
    step: "03",
    title: "Export & Send",
    description:
      "Download as PDF, share directly, or save for later. Your invoice history is always accessible.",
  },
];

const stats = [
  { value: "10x", label: "Faster than manual" },
  { value: "99.9%", label: "Uptime guaranteed" },
  { value: "50K+", label: "Invoices generated" },
  { value: "4.9★", label: "User rating" },
];

const testimonials = [
  {
    quote:
      "Invoicify cut our billing time from hours to minutes. The AI understands exactly what I need.",
    author: "Sarah Chen",
    role: "Freelance Designer",
  },
  {
    quote:
      "Finally, an invoicing tool that doesn't feel like it's from 2005. Clean, fast, and actually enjoyable to use.",
    author: "Marcus Johnson",
    role: "Agency Owner",
  },
  {
    quote:
      "The version history feature alone is worth it. No more 'final_final_v3' invoice files.",
    author: "Elena Rodriguez",
    role: "Consultant",
  },
];

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-foreground">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] animate-pulse rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, oklch(0.73 0.14 222 / 0.4), transparent 60%)",
            animationDuration: "8s",
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] animate-pulse rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, oklch(0.73 0.14 280 / 0.35), transparent 60%)",
            animationDuration: "10s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, oklch(0.73 0.14 200 / 0.3), transparent 60%)",
            animationDuration: "12s",
            animationDelay: "4s",
          }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary shadow-lg shadow-primary/20">
                <Receipt className="size-5" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">Invoicify</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Invoice Intelligence
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-8 md:flex">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Testimonials
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="shadow-lg shadow-primary/25">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <Badge
                variant="outline"
                className="mb-6 border-primary/30 bg-primary/10 px-4 py-1.5 text-primary shadow-lg shadow-primary/10"
              >
                <Sparkles className="mr-2 size-3.5" />
                AI-Powered Invoice Generation
              </Badge>

              <h1 className="bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text text-5xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                Create Beautiful Invoices
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text">
                  In Seconds
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Transform plain language into professional invoices. Powered by AI,
                designed for speed, built for modern teams who value their time.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40"
                >
                  <Link href="/sign-up">
                    Start Creating Free
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base"
                >
                  <Link href="#how-it-works">
                    <Clock className="mr-2 size-5" />
                    See How It Works
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-500" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="size-5 text-blue-500" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-violet-500" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Hero visual - Invoice preview mockup */}
            <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-50 blur-3xl" />
              <div className="surface-panel relative overflow-hidden rounded-2xl p-2 sm:p-3">
                <div className="overflow-hidden rounded-xl bg-neutral-900/80">
                  {/* Mock browser bar */}
                  <div className="flex items-center gap-2 border-b border-white/10 bg-neutral-800/80 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="ml-4 flex-1 rounded-md bg-neutral-700/50 px-4 py-1.5 text-xs text-neutral-400">
                      app.invoicify.ai/dashboard
                    </div>
                  </div>
                  {/* Mock dashboard */}
                  <div className="flex">
                    {/* Sidebar mock */}
                    <div className="hidden w-48 border-r border-white/5 bg-neutral-800/40 p-4 sm:block">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-lg bg-primary/20 px-3 py-2 text-sm text-primary">
                          <Receipt className="size-4" />
                          <span>Invoices</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500">
                          <Layers className="size-4" />
                          <span>Clients</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500">
                          <TrendingUp className="size-4" />
                          <span>Analytics</span>
                        </div>
                      </div>
                    </div>
                    {/* Main content mock */}
                    <div className="flex-1 p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-white">
                          Create Invoice
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        >
                          <Sparkles className="mr-1 size-3" />
                          AI Ready
                        </Badge>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-neutral-800/50 p-4">
                        <p className="text-sm text-neutral-300">
                          <span className="text-primary">→</span> Invoice for
                          Acme Corp, 3 hours consulting at $150/hr, 10%
                          discount...
                        </p>
                        <div className="mt-3 h-1.5 w-2/3 animate-pulse rounded-full bg-primary/40" />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-neutral-800/40 p-3">
                          <p className="text-xs text-neutral-500">Subtotal</p>
                          <p className="text-lg font-semibold text-white">
                            $450.00
                          </p>
                        </div>
                        <div className="rounded-lg bg-neutral-800/40 p-3">
                          <p className="text-xs text-neutral-500">Discount</p>
                          <p className="text-lg font-semibold text-emerald-400">
                            -$45.00
                          </p>
                        </div>
                        <div className="rounded-lg bg-primary/20 p-3">
                          <p className="text-xs text-primary/70">Total</p>
                          <p className="text-lg font-semibold text-primary">
                            $405.00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border/40 bg-surface-1/50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Everything you need to
                <br />
                <span className="text-primary">invoice like a pro</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features designed to save time, reduce errors, and make
                invoicing actually enjoyable.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-border/50 bg-card/50 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <CardContent className="relative space-y-4 p-6">
                    <div className="inline-flex rounded-xl border border-primary/30 bg-primary/15 p-3 text-primary shadow-lg shadow-primary/10">
                      <feature.icon className="size-6" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section
          id="how-it-works"
          className="border-y border-border/40 bg-surface-1/30 px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">
                How it Works
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Three steps to invoice freedom
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No complex setup. No learning curve. Just describe what you need.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {steps.map((item, index) => (
                <div key={item.step} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-20 hidden h-px w-full -translate-x-1/2 bg-gradient-to-r from-border via-primary/50 to-border lg:block" />
                  )}
                  <div className="surface-panel relative rounded-2xl p-8 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-2xl font-bold text-primary shadow-lg shadow-primary/20">
                      {item.step}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">
                Testimonials
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Loved by teams worldwide
              </h2>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.author}
                  className="border-border/50 bg-card/50"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="size-5 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-foreground/90">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="surface-accent relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16">
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-50"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.73 0.14 222 / 0.4), transparent 60%)",
                }}
              />
              <div
                className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.73 0.14 280 / 0.3), transparent 60%)",
                }}
              />

              <div className="relative mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Ready to transform your invoicing?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                  Join thousands of professionals who&apos;ve upgraded from
                  spreadsheets to smart invoicing.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-14 px-10 text-base shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40"
                  >
                    <Link href="/sign-up">
                      Create Your Free Account
                      <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>Free forever plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary">
                    <Receipt className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">Invoicify</p>
                    <p className="text-xs text-muted-foreground">
                      Invoice Intelligence
                    </p>
                  </div>
                </div>
                <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                  The modern way to create, manage, and send professional
                  invoices. Built for speed, designed for clarity.
                </p>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#features" className="hover:text-foreground">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="hover:text-foreground">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a href="#testimonials" className="hover:text-foreground">
                      Testimonials
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Invoicify. All rights reserved.
              </p>
              <p className="text-sm tracking-wide text-muted-foreground">
                Calm. Confident. Premium.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
