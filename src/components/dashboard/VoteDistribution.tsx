"use client";


import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoteDistributionItem {
  value: string;
  count: number;
  percentage: number;
}

interface VoteDistributionProps {
  data: VoteDistributionItem[];
  isLoading?: boolean;
}

const chartConfig = {
  count: {
    label: "Issues",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function VoteDistribution({ data, isLoading }: VoteDistributionProps) {
  const hasData = data.length > 0;
  const topValue = data[0]?.value;
  const totalIssues = data.reduce((sum, d) => sum + d.count, 0);

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-1.5">
            Vote Distribution
            <TooltipProvider delay={200}>
              <Tooltip>
                <TooltipTrigger render={<HelpCircle className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help shrink-0" />} />
                <TooltipContent className="max-w-[220px] text-center font-normal">
                  <p>Shows which estimates your team picks most often.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Most common estimates</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 min-h-[200px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card className="flex flex-col h-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-1.5">
            Vote Distribution
            <TooltipProvider delay={200}>
              <Tooltip>
                <TooltipTrigger render={<HelpCircle className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help shrink-0" />} />
                <TooltipContent className="max-w-[220px] text-center font-normal">
                  <p>Shows which estimates your team picks most often.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>Most common estimates</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex flex-1 min-h-[200px] items-center justify-center text-muted-foreground">
            No estimates yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Take top 8 values for the chart
  const chartData = data.slice(0, 8);

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-1.5">
            Vote Distribution
            <TooltipProvider delay={200}>
              <Tooltip>
                <TooltipTrigger render={<HelpCircle className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help shrink-0" />} />
                <TooltipContent className="max-w-[220px] text-center font-normal">
                  <p>Shows which estimates your team picks most often.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        <CardDescription>
          {topValue ? `Most common: ${topValue}` : "Most common estimates"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pb-6">
        <ChartContainer config={chartConfig} className="flex-1 min-h-[200px] w-full aspect-auto">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="value"
              type="category"
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, props) => {
                    const item = props.payload as VoteDistributionItem;
                    return [
                      `${value} issues (${item.percentage}%)`,
                      item.value,
                    ];
                  }}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Summary text */}
        <div className="mt-2 text-center text-xs text-muted-foreground">
          {totalIssues} total issues estimated
        </div>
      </CardContent>
    </Card>
  );
}
