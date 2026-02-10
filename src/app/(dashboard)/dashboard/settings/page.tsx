import { Bell, Shield, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="space-y-5 pb-4">
      <section className="surface-panel rounded-3xl p-6 sm:p-7">
        <Badge variant="outline">Workspace Controls</Badge>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Settings</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Configure invoice defaults, notification behavior, and workspace-level preferences.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="surface-panel rounded-3xl xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SlidersHorizontal className="size-4 text-primary" />
              Invoice Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Invoicify Studio" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply-email">Reply Email</Label>
                <Input id="reply-email" type="email" defaultValue="billing@invoicify.app" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Tax</Label>
                <Select defaultValue="8">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tax" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="8">8%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Net 7</SelectItem>
                    <SelectItem value="14">Net 14</SelectItem>
                    <SelectItem value="30">Net 30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="surface-soft rounded-2xl p-4 text-sm text-muted-foreground">
              Defaults apply to new drafts only. Existing invoices keep their current values.
            </div>

            <div className="flex justify-end">
              <Button type="button">Save Defaults</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="surface-soft rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
              <label className="flex items-center justify-between gap-3 rounded-xl border border-border/75 bg-card/45 px-3 py-2">
                Invoice generated
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between gap-3 rounded-xl border border-border/75 bg-card/45 px-3 py-2">
                Export complete
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--primary)]" />
              </label>
              <label className="flex items-center justify-between gap-3 rounded-xl border border-border/75 bg-card/45 px-3 py-2">
                Weekly summary
                <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" />
              </label>
            </CardContent>
          </Card>

          <Card className="surface-soft rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="size-4 text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
              <p className="rounded-xl border border-border/75 bg-card/45 px-3 py-2">
                Session timeout: <span className="font-medium text-foreground">30 minutes</span>
              </p>
              <p className="rounded-xl border border-border/75 bg-card/45 px-3 py-2">
                Last login protection: <span className="font-medium text-foreground">Enabled</span>
              </p>
              <Button type="button" variant="outline" className="w-full">
                Manage Auth
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
