"use client";

import {
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Handshake,
} from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface PredictabilityGaugeProps {
  score: number | null;
  averageVelocityPerSession: number;
  velocityTrend: "increasing" | "stable" | "decreasing";
  averageAgreement: number;
  agreementTrend: "improving" | "stable" | "declining";
  isLoading?: boolean;
}

const chartConfig = {
  score: {
    label: "Score",
  },
} satisfies ChartConfig;

function getScoreColor(score: number): string {
  if (score <= 40) return "var(--chart-4)"; // red
  if (score <= 70) return "var(--chart-5)"; // amber
  return "var(--chart-2)"; // green
}

function getScoreLabel(score: number): string {
  if (score <= 40) return "Needs Improvement";
  if (score <= 70) return "Getting There";
  return "Healthy";
}

function getScoreBadgeClasses(score: number): string {
  if (score <= 40) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (score <= 70)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
}

const trendIcons = {
  increasing: TrendingUp,
  stable: Minus,
  decreasing: TrendingDown,
  improving: TrendingUp,
  declining: TrendingDown,
} as const;

export function PredictabilityGauge({
  score,
  averageVelocityPerSession,
  velocityTrend,
  averageAgreement,
  agreementTrend,
  isLoading,
}: PredictabilityGaugeProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Predictability Score
          </CardTitle>
          <CardDescription>
            Estimation consistency across sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (score === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Predictability Score
          </CardTitle>
          <CardDescription>
            Estimation consistency across sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[250px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <Gauge className="h-10 w-10 opacity-50" />
            <p className="font-medium">Not enough data</p>
            <p className="text-sm">
              Need at least 3 sessions with story points
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const color = getScoreColor(score);
  const data = [{ name: "score", value: score, fill: color }];

  const VelocityIcon = trendIcons[velocityTrend];
  const AgreementIcon = trendIcons[agreementTrend];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Predictability Score
        </CardTitle>
        <CardDescription>
          Estimation consistency across sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {/* Gauge */}
          <ChartContainer config={chartConfig} className="h-[180px] w-[180px]">
            <RadialBarChart
              innerRadius="75%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                dataKey="value"
                background={{ fill: "var(--muted)" }}
                cornerRadius={8}
                angleAxisId={0}
              />
              {/* Center label */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-4xl font-bold"
              >
                {score}
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs"
              >
                / 100
              </text>
            </RadialBarChart>
          </ChartContainer>

          {/* Score label badge */}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getScoreBadgeClasses(score)}`}
          >
            {getScoreLabel(score)}
          </span>

          {/* Sub-indicators */}
          <div className="flex w-full gap-4">
            <div className="flex flex-1 items-center gap-2 rounded-lg border p-3">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Avg Velocity</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">
                    {averageVelocityPerSession} pts
                  </span>
                  <VelocityIcon className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-lg border p-3">
              <Handshake className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Avg Agreement</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">
                    {averageAgreement}%
                  </span>
                  <AgreementIcon className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
