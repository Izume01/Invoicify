"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
};

const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    hint: "Workspace status and generation flow",
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
    hint: "History, previews, and exports",
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: Users,
    hint: "Customer records and segmentation",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    hint: "Workspace preferences and profile",
  },
];

function getPageMeta(pathname: string): { title: string; subtitle: string } {
  if (pathname === "/dashboard") {
    return {
      title: "Command Center",
      subtitle: "Generate, update, and export invoices with full context.",
    };
  }

  if (pathname.startsWith("/dashboard/invoices")) {
    return {
      title: "Invoices",
      subtitle: "Track every draft, status, and downloadable version.",
    };
  }

  if (pathname.startsWith("/dashboard/clients")) {
    return {
      title: "Clients",
      subtitle: "Manage account context for cleaner invoice runs.",
    };
  }

  if (pathname.startsWith("/dashboard/settings")) {
    return {
      title: "Settings",
      subtitle: "Control workspace behavior, notifications, and defaults.",
    };
  }

  return {
    title: "Dashboard",
    subtitle: "Invoicify workspace",
  };
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const pageMeta = getPageMeta(pathname);

  return (
    <SidebarProvider>
      <Sidebar
        variant="inset"
        collapsible="icon"
        className="[&_[data-sidebar=sidebar]]:rounded-2xl [&_[data-sidebar=sidebar]]:border [&_[data-sidebar=sidebar]]:border-sidebar-border/70 [&_[data-sidebar=sidebar]]:bg-sidebar"
      >
        <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:px-2">
          <Link
            href="/dashboard"
            className="surface-soft group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-[background-color,border-color] duration-200 hover:border-primary/40 hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/18 text-primary shadow-[0_10px_24px_-18px_var(--primary)]">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Invoicify
              </p>
              <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
                Command Surface
              </p>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarSeparator className="mx-3 bg-sidebar-border/80 group-data-[collapsible=icon]:mx-2" />

        <SidebarContent className="px-2 py-3 group-data-[collapsible=icon]:px-1.5">
          <SidebarGroup className="gap-1 p-0">
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground group-data-[collapsible=icon]:hidden">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className="h-11 rounded-xl border border-transparent px-3 text-sidebar-foreground/82 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:border-primary/50 data-[active=true]:bg-primary/18 data-[active=true]:text-sidebar-foreground"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                            <span className="truncate text-sm font-medium">{item.label}</span>
                            <span className="truncate text-[11px] text-muted-foreground">
                              {item.hint}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-3 pb-3 group-data-[collapsible=icon]:px-2">
          <div className="surface-soft rounded-xl px-3 py-2.5 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
            <p className="font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/90">
              Workspace
            </p>
            <p className="mt-1 leading-relaxed">
              Press <span className="rounded bg-sidebar-accent px-1.5 py-0.5 text-[10px] text-sidebar-foreground">Ctrl/Cmd + B</span> to collapse navigation.
            </p>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="app-shell-bg text-foreground">
        <div className="mx-auto flex w-full max-w-[1360px] min-w-0 flex-1 flex-col px-3 py-4 sm:px-5 lg:px-7">
          <header className="surface-panel sticky top-3 z-20 mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg border border-border/75 bg-card/70 text-muted-foreground hover:bg-card hover:text-foreground" />
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {pageMeta.title}
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">{pageMeta.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                className="hidden h-9 items-center gap-2 rounded-lg border border-border/70 bg-input/65 px-3 text-xs text-muted-foreground transition-[border-color,background-color,color] duration-200 hover:border-primary/35 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:outline-none md:inline-flex"
              >
                <Search className="size-3.5" />
                Search workspace
                <span className="rounded border border-border/70 bg-card/80 px-1.5 py-0.5 text-[10px]">⌘K</span>
              </button>

              <Button asChild size="sm" className="h-9 px-3.5">
                <Link href="/dashboard">
                  <Plus className="size-4" />
                  New Run
                </Link>
              </Button>

              <div className="h-7 w-px bg-border/70" aria-hidden="true" />

              <div className="rounded-lg border border-border/70 bg-card/70 p-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-7 w-7",
                      userButtonPopoverCard:
                        "bg-popover border border-border shadow-[0_24px_60px_-42px_hsl(var(--app-shadow)/0.95)]",
                    },
                  }}
                />
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
