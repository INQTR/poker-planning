"use client";

import { Crosshair } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ZAxis,
  Cell,
} from "recharts";
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

interface ScatterPoint {
  userId: string;
  userName: string;
  x: number; // averageDelta
  y: number; // stdDev
}

interface VoterAlignmentChartProps {
  data: ScatterPoint[];
  isLoading?: boolean;
}

const chartConfig = {
  alignment: {
    label: "Alignment",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function getDotColor(x: number): string {
  const absX = Math.abs(x);
  if (absX <= 0.5) return "var(--chart-3)"; // green — aligned
  if (absX <= 1.5) return "var(--chart-4)"; // yellow — slight bias
  return "var(--chart-5)"; // red — significant bias
}

export function VoterAlignmentChart({
  data,
  isLoading,
}: VoterAlignmentChartProps) {
  if (isLoading) {
    return (
      <Card className="flex flex-col h-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Voter Alignment</CardTitle>
          <CardDescription>
            Estimation bias vs consistency across team members
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 min-h-[250px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="flex flex-col h-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Voter Alignment</CardTitle>
          <CardDescription>
            Estimation bias vs consistency across team members
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex flex-1 min-h-[250px] items-center justify-center text-muted-foreground">
            No individual vote data yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Voter Alignment</CardTitle>
        <CardDescription>
          X: avg bias (- under, + over) &middot; Y: variability (stddev)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pb-6">
        <ChartContainer config={chartConfig} className="flex-1 min-h-[250px] w-full aspect-auto">
          <ScatterChart
            accessibilityLayer
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Avg Delta"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Variability"
              tickLine={false}
              axisLine={false}
            />
            <ZAxis range={[60, 60]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_label, payload) => {
                    if (payload?.[0]) {
                      const item = payload[0].payload as ScatterPoint;
                      return item.userName;
                    }
                    return "";
                  }}
                  formatter={(_value, name) => {
                    if (name === "Avg Delta") return [_value, "Avg Bias"];
                    if (name === "Variability")
                      return [_value, "Variability"];
                    return [_value, name];
                  }}
                />
              }
            />
            <Scatter data={data} name="alignment">
              {data.map((point) => (
                <Cell key={point.userId} fill={getDotColor(point.x)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ChartContainer>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Center = aligned with consensus. Requires numeric scales.
        </p>
      </CardContent>
    </Card>
  );
}
