import { Building2, Mail, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const clients = [
  {
    name: "Acme Labs",
    contact: "ops@acmelabs.com",
    invoices: 14,
    status: "Active",
  },
  {
    name: "Northfield Studio",
    contact: "hello@northfield.studio",
    invoices: 6,
    status: "Active",
  },
  {
    name: "Riverline Ventures",
    contact: "finance@riverline.vc",
    invoices: 2,
    status: "New",
  },
];

export default function ClientPage() {
  return (
    <div className="space-y-5 pb-4">
      <section className="surface-panel rounded-3xl p-6 sm:p-7">
        <Badge variant="outline">Client Context</Badge>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Clients</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Keep core client context close to your invoice flow so prompts stay consistent and billing details stay accurate.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Card className="surface-soft rounded-2xl">
          <CardContent className="py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Clients</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{clients.length}</p>
          </CardContent>
        </Card>
        <Card className="surface-soft rounded-2xl">
          <CardContent className="py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Active</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {clients.filter((item) => item.status === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card className="surface-soft rounded-2xl">
          <CardContent className="py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Invoices</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {clients.reduce((acc, item) => acc + item.invoices, 0)}
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="surface-panel rounded-3xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg">Client Directory</CardTitle>
            <Button type="button" size="sm">Add Client</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Invoices</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="rounded-md border border-primary/28 bg-primary/12 p-1 text-primary">
                        <Building2 className="size-3.5" />
                      </div>
                      <span className="font-medium text-foreground">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="size-3.5" />
                      {client.contact}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/90">{client.invoices}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === "Active" ? "default" : "outline"}>{client.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="surface-soft rounded-3xl">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="rounded-full border border-border/75 bg-card/75 p-3 text-muted-foreground">
            <Users2 className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Need richer CRM fields?</p>
            <p className="text-xs text-muted-foreground">Client metadata sync is available in a later release.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
