"use client";

import { Clock, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeToConsensusCardProps {
  averageMs: number | null;
  medianMs: number | null;
  trendBySession: Array<{
    date: string;
    roomName: string;
    averageMs: number;
  }>;
  isLoading?: boolean;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="h-3 w-48 animate-pulse rounded bg-muted mt-2" />
      </CardContent>
    </Card>
  );
}

export function TimeToConsensusCard({
  averageMs,
  medianMs,
  trendBySession,
  isLoading,
}: TimeToConsensusCardProps) {
  if (isLoading) {
    return <CardSkeleton />;
  }

  if (averageMs === null) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Time to Consensus</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">&mdash;</div>
          <p className="text-xs text-muted-foreground mt-1">No timing data yet</p>
        </CardContent>
      </Card>
    );
  }

  // Compute trend from session data (compare first half vs second half)
  let TrendIcon = Minus;
  let trendText = "Stable";
  let trendColor = "text-muted-foreground";

  if (trendBySession.length >= 2) {
    const midpoint = Math.floor(trendBySession.length / 2);
    const earlier = trendBySession.slice(0, midpoint);
    const recent = trendBySession.slice(midpoint);

    const earlierAvg =
      earlier.reduce((s, d) => s + d.averageMs, 0) / earlier.length;
    const recentAvg =
      recent.reduce((s, d) => s + d.averageMs, 0) / recent.length;
    const diffPct = ((recentAvg - earlierAvg) / earlierAvg) * 100;

    if (diffPct < -10) {
      TrendIcon = TrendingDown;
      trendText = `${Math.round(Math.abs(diffPct))}% faster`;
      trendColor = "text-green-600 dark:text-green-400";
    } else if (diffPct > 10) {
      TrendIcon = TrendingUp;
      trendText = `${Math.round(diffPct)}% slower`;
      trendColor = "text-amber-600 dark:text-amber-400";
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Avg Time to Consensus</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatDuration(averageMs)}</div>
        <div className="flex items-center gap-2 text-xs mt-1">
          <span className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            {trendText}
          </span>
          {medianMs !== null && (
            <span className="text-muted-foreground">
              — Median: {formatDuration(medianMs)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
