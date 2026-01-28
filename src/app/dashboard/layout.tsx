import { cookies } from "next/headers";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return <DashboardLayout defaultOpen={defaultOpen}>{children}</DashboardLayout>;
}
