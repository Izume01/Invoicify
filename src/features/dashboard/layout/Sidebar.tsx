"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, Settings, Users } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="surface-panel fixed left-4 top-4 h-[calc(100vh-2rem)] w-64 rounded-2xl p-4">
      <Link href="/dashboard" className="mb-6 block text-xl font-semibold tracking-tight text-foreground">
        Invoicify
      </Link>

      <nav>
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "border-primary/40 bg-primary/14 text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-card/70 hover:text-foreground"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
