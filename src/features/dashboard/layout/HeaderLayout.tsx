"use client";

import { usePathname } from "next/navigation";

export default function HeaderLayout() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/dashboard/invoices")) return "Invoices";
    if (pathname.startsWith("/dashboard/clients")) return "Clients";
    if (pathname.startsWith("/dashboard/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        {getPageTitle()}
      </h1>
    </div>
  );
}