"use client";

import { AlertTriangle } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface OutlierItem {
  issueTitle: string;
  roomName: string;
  durationMs: number;
  multiplierVsAverage: number;
}

interface ConsensusOutliersProps {
  data: OutlierItem[];
  averageMs: number | null;
  isLoading?: boolean;
}

const chartConfig = {
  durationSec: {
    label: "Duration",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function getBarColor(multiplier: number): string {
  if (multiplier > 3) return "var(--chart-5)"; // red-ish
  if (multiplier > 2) return "var(--chart-4)"; // amber-ish
  return "var(--chart-3)"; // green-ish
}

export function ConsensusOutliers({
  data,
  averageMs,
  isLoading,
}: ConsensusOutliersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Consensus Outliers
          </CardTitle>
          <CardDescription>Issues that took longest to estimate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Consensus Outliers
          </CardTitle>
          <CardDescription>Issues that took longest to estimate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            {averageMs !== null
              ? "No outliers detected — great consistency!"
              : "No timing data yet"}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data (top 6)
  const chartData = data.slice(0, 6).map((item) => ({
    label:
      item.issueTitle.length > 20
        ? item.issueTitle.slice(0, 18) + "..."
        : item.issueTitle,
    durationSec: Math.round(item.durationMs / 1000),
    durationMs: item.durationMs,
    multiplier: item.multiplierVsAverage,
    roomName: item.roomName,
    fullTitle: item.issueTitle,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Consensus Outliers
        </CardTitle>
        <CardDescription>
          {data.length} issue{data.length !== 1 ? "s" : ""} took &gt;2x average
          time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}s`}
            />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              axisLine={false}
              width={80}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_value, _name, props) => {
                    const item = props.payload as (typeof chartData)[number];
                    return [
                      `${formatDuration(item.durationMs)} (${item.multiplier}x avg)`,
                      item.fullTitle,
                    ];
                  }}
                  labelFormatter={(_label, payload) => {
                    if (payload?.[0]) {
                      const item = payload[0]
                        .payload as (typeof chartData)[number];
                      return item.roomName;
                    }
                    return "";
                  }}
                />
              }
            />
            <Bar dataKey="durationSec" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.multiplier)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
