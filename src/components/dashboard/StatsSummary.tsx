"use client";

import { Users, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtext && (
              <p className="text-xs text-muted-foreground">{subtext}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-7 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
