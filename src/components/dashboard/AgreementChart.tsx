"use client";

import { TrendingUp } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
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

interface AgreementDataPoint {
  date: string;
  timestamp: number;
  agreement: number;
  issueTitle: string;
  roomName: string;
}

interface AgreementChartProps {
  data: AgreementDataPoint[];
  isLoading?: boolean;
}

const chartConfig = {
  agreement: {
    label: "Agreement",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Group data by date and calculate average
function aggregateByDate(
  data: AgreementDataPoint[]
): Array<{ date: string; agreement: number; count: number }> {
  const byDate: Record<string, { total: number; count: number }> = {};

  for (const point of data) {
    if (!byDate[point.date]) {
      byDate[point.date] = { total: 0, count: 0 };
    }
    byDate[point.date].total += point.agreement;
    byDate[point.date].count += 1;
  }

  return Object.entries(byDate)
    .map(([date, { total, count }]) => ({
      date,
      agreement: Math.round(total / count),
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AgreementChart({ data, isLoading }: AgreementChartProps) {
  const aggregated = aggregateByDate(data);
  const hasData = aggregated.length > 0;

  // Calculate trend
  let trendText = "";
  if (aggregated.length >= 2) {
    const recent = aggregated.slice(-3);
    const earlier = aggregated.slice(0, 3);
    const recentAvg =
      recent.reduce((s, d) => s + d.agreement, 0) / recent.length;
    const earlierAvg =
      earlier.reduce((s, d) => s + d.agreement, 0) / earlier.length;
    const diff = recentAvg - earlierAvg;

    if (Math.abs(diff) >= 5) {
      trendText =
        diff > 0
          ? `Trending up ${Math.round(diff)}%`
          : `Trending down ${Math.round(Math.abs(diff))}%`;
    } else {
      trendText = "Stable trend";
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Agreement Trend
          </CardTitle>
          <CardDescription>Team alignment over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Agreement Trend
          </CardTitle>
          <CardDescription>Team alignment over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No voting data yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Agreement Trend
        </CardTitle>
        <CardDescription>
          {trendText || "Team alignment over time"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={aggregated}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatDate}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => formatDate(label as string)}
                  formatter={(value) => [`${value}%`, "Agreement"]}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="agreement"
              stroke="var(--color-agreement)"
              strokeWidth={2}
              dot={{ fill: "var(--color-agreement)", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
