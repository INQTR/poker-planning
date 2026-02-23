"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth/auth-provider";
import {
  DashboardHeader,
  StatsSummary,
  SessionHistory,
  AgreementChart,
  VelocityChart,
  VoteDistribution,
} from "@/components/dashboard";
import { useDateRange } from "@/components/dashboard/date-range-context";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function AuthRequired() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
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
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}

export function DashboardContent() {
  const { authUserId, isLoading: authLoading, isAuthenticated } = useAuth();
  const { dateRange } = useDateRange();

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

  if (authLoading) {
    return <LoadingState />;
  }

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
    <>
      <DashboardHeader title="Overview" />
      <main className="flex-1 p-6">
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
      </main>
    </>
  );
}
