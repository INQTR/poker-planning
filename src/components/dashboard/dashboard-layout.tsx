"use client";

import { type ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { DateRangeProvider } from "./date-range-context";

interface DashboardLayoutProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function DashboardLayout({
  children,
  defaultOpen = true,
}: DashboardLayoutProps) {
  return (
    <DateRangeProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </DateRangeProvider>
  );
}
