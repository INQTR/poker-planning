"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "./DateRangePicker";
import { useDateRange } from "./date-range-context";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { dateRange, setDateRange } = useDateRange();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="flex-1 text-lg font-semibold">{title}</h1>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
    </header>
  );
}
