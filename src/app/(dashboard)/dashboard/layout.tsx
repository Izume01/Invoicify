import { requireUserIdForPage } from "@/lib/user";
import DashboardShell from "@/features/dashboard/layout/DashboardShell";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  await requireUserIdForPage();

  return (
    <DashboardShell>{children}</DashboardShell>
  );
}
