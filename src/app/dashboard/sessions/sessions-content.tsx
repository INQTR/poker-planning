"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth/auth-provider";
import { DashboardHeader, SessionHistory } from "@/components/dashboard";
import { useDateRange } from "@/components/dashboard/date-range-context";

export function SessionsContent() {
  const { authUserId } = useAuth();
  const { dateRange } = useDateRange();

  const sessions = useQuery(
    api.analytics.getSessions,
    authUserId ? { authUserId, dateRange } : "skip"
  );

  const isLoading = sessions === undefined;

  return (
    <>
      <DashboardHeader title="Sessions" />
      <div className="flex-1 p-6">
        <SessionHistory sessions={sessions ?? []} isLoading={isLoading} />
      </div>
    </>
  );
}
