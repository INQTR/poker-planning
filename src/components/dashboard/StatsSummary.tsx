"use client";

import { Users, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsSummaryProps {
  totalSessions: number;
  totalIssuesEstimated: number;
  totalStoryPoints: number | null;
  averageAgreement: number | null;
  isLoading?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
}

function StatCard({ icon, label, value, subtext }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted mt-2" />
      </CardContent>
    </Card>
  );
}

export function StatsSummary({
  totalSessions,
  totalIssuesEstimated,
  totalStoryPoints,
  averageAgreement,
  isLoading,
}: StatsSummaryProps) {
  if (isLoading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </>
    );
  }

  return (
    <>
      <StatCard
        icon={<Users className="h-5 w-5" />}
        label="Total Sessions"
        value={totalSessions}
        subtext="Planning rooms joined"
      />
      <StatCard
        icon={<Target className="h-5 w-5" />}
        label="Issues Estimated"
        value={totalIssuesEstimated}
        subtext="Stories completed"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Story Points"
        value={totalStoryPoints ?? "—"}
        subtext={totalStoryPoints !== null ? "Total estimated" : "Non-numeric scale"}
      />
      <StatCard
        icon={<CheckCircle2 className="h-5 w-5" />}
        label="Avg Agreement"
        value={averageAgreement !== null ? `${averageAgreement}%` : "—"}
        subtext={averageAgreement !== null ? "Team alignment" : "No data yet"}
      />
    </>
  );
}
