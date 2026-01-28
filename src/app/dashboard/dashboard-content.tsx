"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/navbar";
import {
  DateRangePicker,
  DateRange,
  StatsSummary,
  SessionHistory,
  AgreementChart,
  VelocityChart,
  VoteDistribution,
} from "@/components/dashboard";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function AuthRequired() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="text-center">
          <LayoutDashboard className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Join a planning room to start tracking your sessions
          </p>
          <Link href="/">
            <Button className="mt-4">Go to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </main>
    </div>
  );
}

export function DashboardContent() {
  const { authUserId, isLoading: authLoading, isAuthenticated } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Fetch all analytics data
  const summary = useQuery(
    api.analytics.getSummary,
    authUserId ? { authUserId, dateRange } : "skip"
  );

  const sessions = useQuery(
    api.analytics.getSessions,
    authUserId ? { authUserId, dateRange } : "skip"
  );

  const agreementTrend = useQuery(
    api.analytics.getAgreementTrend,
    authUserId ? { authUserId, dateRange } : "skip"
  );

  const velocityStats = useQuery(
    api.analytics.getVelocityStats,
    authUserId ? { authUserId, dateRange } : "skip"
  );

  const voteDistribution = useQuery(
    api.analytics.getVoteDistribution,
    authUserId ? { authUserId, dateRange } : "skip"
  );

  // Show loading while auth is checking
  if (authLoading) {
    return <LoadingState />;
  }

  // Show auth required if not authenticated
  if (!isAuthenticated || !authUserId) {
    return <AuthRequired />;
  }

  const isLoading =
    summary === undefined ||
    sessions === undefined ||
    agreementTrend === undefined ||
    velocityStats === undefined ||
    voteDistribution === undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Track your estimation sessions and team trends
              </p>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Stats Summary */}
          <div className="mb-8">
            <StatsSummary
              totalSessions={summary?.totalSessions ?? 0}
              totalIssuesEstimated={summary?.totalIssuesEstimated ?? 0}
              totalStoryPoints={summary?.totalStoryPoints ?? null}
              averageAgreement={summary?.averageAgreement ?? null}
              isLoading={isLoading}
            />
          </div>

          {/* Charts Grid */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <AgreementChart data={agreementTrend ?? []} isLoading={isLoading} />
            <VelocityChart data={velocityStats ?? []} isLoading={isLoading} />
          </div>

          {/* Vote Distribution */}
          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <VoteDistribution
                data={voteDistribution ?? []}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-2">
              <SessionHistory sessions={sessions ?? []} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
