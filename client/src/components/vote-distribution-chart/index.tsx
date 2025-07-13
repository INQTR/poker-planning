import { FC, useMemo } from "react";
import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts";

import { CardFooter, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Room } from "@/types";

interface VoteDistributionChartProps {
  room: Room;
}

export const VoteDistributionChart: FC<VoteDistributionChartProps> = ({
  room,
}) => {
  const voteCount = useMemo(() => {
    const voteCount: { [key: string]: number } = {};
    room.game.table.forEach((userCard) => {
      if (userCard.card) {
        voteCount[userCard.card] = (voteCount[userCard.card] || 0) + 1;
      }
    });

    return voteCount;
  }, [room.game.table]);

  const chartData = useMemo(() => {
    return Object.entries(voteCount).map(([card, votes]) => ({
      card,
      votes,
    }));
  }, [voteCount]);

  const maxCardCount = useMemo(() => {
    return Math.max(...chartData.map((card) => card.votes));
  }, [chartData]);

  const averageVote = useMemo(() => {
    const numericVotes = room.game.table
      .map((userCard) => parseFloat(userCard.card || "0"))
      .filter((vote) => !isNaN(vote));
    const sum = numericVotes.reduce((acc, vote) => acc + vote, 0);
    return numericVotes.length > 0 ? sum / numericVotes.length : 0;
  }, [room.game.table]);

  const agreement = useMemo(() => {
    const totalVotes = room.game.table.length;
    const mostCommonVotes = Math.max(...Object.values(voteCount));
    return totalVotes > 0 ? (mostCommonVotes / totalVotes) * 100 : 0;
  }, [room.game.table, voteCount]);

  return (
    <div
      className="flex flex-col items-center justify-center overflow-hidden"
      data-testid="vote-distribution-chart"
    >
      <ChartContainer
        className="min-h-[150px] max-h-[150px] w-full"
        config={{
          card: {
            label: "Votes",
            color: "var(--chart-1)",
          },
        }}
      >
        <BarChart
          accessibilityLayer
          margin={{
            left: -4,
            right: -4,
          }}
          data={chartData}
        >
          <Bar
            dataKey="votes"
            fill="var(--chart-1)"
            radius={5}
            fillOpacity={0.6}
            activeBar={<Rectangle fillOpacity={0.8} />}
          />
          <XAxis
            dataKey="card"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
          />
          <ChartTooltip
            content={(props) => (
              <ChartTooltipContent
                {...props}
                labelFormatter={(value) => `Card: ${value}`}
              />
            )}
            cursor={false}
          />
          <ReferenceLine
            y={((maxCardCount * agreement) / 100) * 0.8}
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            strokeWidth={1}
          >
            <Label
              position="insideBottomLeft"
              value="Agreement"
              offset={10}
              fill="var(--foreground)"
            />
            <Label
              position="insideTopLeft"
              value={`${agreement.toFixed(0)}% ${agreement > 95 ? "🎉" : ""}`}
              className="text-lg"
              fill="var(--foreground)"
              offset={10}
              startOffset={100}
            />
          </ReferenceLine>
        </BarChart>
      </ChartContainer>
      <CardFooter className="flex flex-row items-center justify-center pb-0">
        <CardTitle className="text-4xl tabular-nums mr-4">
          {averageVote.toFixed(1)}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            average
          </span>
        </CardTitle>
      </CardFooter>
    </div>
  );
};
