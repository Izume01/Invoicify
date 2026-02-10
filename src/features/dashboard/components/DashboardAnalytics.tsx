"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import { AlertTriangle, Loader2, ReceiptText, TrendingUp, Wallet, Zap } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { InvoiceSummary } from "@/types/invoice";

type TrendRow = {
  month: string;
  invoiceCount: number;
  revenue: number;
};

type StatusRow = {
  status: string;
  count: number;
};

type MetricCard = {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
};

const trendConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  invoiceCount: {
    label: "Invoices",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const statusConfig = {
  count: {
    label: "Invoices",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function buildTrend(invoices: InvoiceSummary[]): TrendRow[] {
  const now = new Date();
  const months: TrendRow[] = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      invoiceCount: 0,
      revenue: 0,
    };
  });

  for (const invoice of invoices) {
    const createdAt = new Date(invoice.createdAt);
    const key = createdAt.toLocaleDateString("en-US", { month: "short" });
    const row = months.find((item) => item.month === key);
    if (!row) {
      continue;
    }
    row.invoiceCount += 1;
    row.revenue += invoice.total;
  }

  return months;
}

function buildStatusRows(invoices: InvoiceSummary[]): StatusRow[] {
  const map = new Map<string, number>();

  for (const invoice of invoices) {
    map.set(invoice.status, (map.get(invoice.status) ?? 0) + 1);
  }

  return ["READY", "GENERATING", "DRAFT", "ERROR"].map((status) => ({
    status,
    count: map.get(status) ?? 0,
  }));
}

export default function DashboardAnalytics() {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/invoices", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load dashboard analytics.");
      }

      const payload = (await response.json()) as { invoices: InvoiceSummary[] };
      setInvoices(payload.invoices ?? []);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Unable to load dashboard analytics.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInvoices();
  }, [fetchInvoices]);

  const { metricCards, trendRows, statusRows } = useMemo(() => {
    const totalRevenue = invoices.reduce((acc, invoice) => acc + invoice.total, 0);
    const readyCount = invoices.filter((invoice) => invoice.status === "READY").length;
    const activeCount = invoices.filter(
      (invoice) => invoice.status === "DRAFT" || invoice.status === "GENERATING",
    ).length;
    const avgValue = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    const cards: MetricCard[] = [
      {
        label: "Total Revenue",
        value: formatCurrency(totalRevenue),
        detail: `${formatCompact(totalRevenue)} billed across all invoices`,
        icon: Wallet,
      },
      {
        label: "Invoices Ready",
        value: readyCount.toString(),
        detail: `${invoices.length} total documents in history`,
        icon: ReceiptText,
      },
      {
        label: "Average Value",
        value: formatCurrency(avgValue),
        detail: "Mean invoice size across the workspace",
        icon: TrendingUp,
      },
      {
        label: "Active Drafts",
        value: activeCount.toString(),
        detail: "Draft or generating states in progress",
        icon: Zap,
      },
    ];

    return {
      metricCards: cards,
      trendRows: buildTrend(invoices),
      statusRows: buildStatusRows(invoices),
    };
  }, [invoices]);

  if (error) {
    return (
      <Card className="surface-panel rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
          <div className="rounded-full border border-destructive/40 bg-destructive/12 p-3 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold tracking-tight">Analytics unavailable</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button type="button" onClick={() => void fetchInvoices()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="surface-soft rounded-2xl">
                <CardContent className="space-y-3 py-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-muted/75" />
                  <div className="h-7 w-24 animate-pulse rounded bg-muted/70" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted/65" />
                </CardContent>
              </Card>
            ))
          : metricCards.map((card) => (
              <Card key={card.label} className="surface-soft rounded-2xl">
                <CardContent className="space-y-3 py-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {card.label}
                    </p>
                    <div className="rounded-md border border-primary/28 bg-primary/12 p-1 text-primary">
                      <card.icon className="size-3.5" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.detail}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="surface-panel rounded-2xl xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Revenue Velocity</CardTitle>
                <CardDescription>Last six months of invoice throughput and totals</CardDescription>
              </div>
              <Badge variant="outline">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex h-[250px] items-center justify-center rounded-xl border border-border/70 bg-card/45">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ChartContainer config={trendConfig} className="h-[250px] w-full">
                <AreaChart data={trendRows} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.42} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    fontSize={11}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    fontSize={11}
                    tickFormatter={(value) => formatCompact(Number(value))}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--chart-1)"
                    fill="url(#revenueFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle>Pipeline Status</CardTitle>
            <CardDescription>Current distribution by invoice state</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex h-[250px] items-center justify-center rounded-xl border border-border/70 bg-card/45">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ChartContainer config={statusConfig} className="h-[250px] w-full">
                <BarChart data={statusRows} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="status"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    fontSize={11}
                  />
                  <YAxis axisLine={false} tickLine={false} width={24} fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-2)"
                    radius={[8, 8, 2, 2]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
