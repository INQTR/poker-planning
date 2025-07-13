import { ReactElement, useMemo } from "react";

import { cn } from "@/lib/utils";
import { UserCard, User } from "@/types";

import { VoteDistributionData } from "../utils/calculations";

interface VoteDistributionProps {
  votes: UserCard[];
  users: User[];
  median?: number;
}

export function VoteDistribution({
  votes,
  users,
  median,
}: VoteDistributionProps): ReactElement {
  const distribution = useMemo(() => {
    const dist: Record<string, VoteDistributionData> = {};
    const totalVotes = votes.filter((v) => v.card).length;

    votes.forEach((vote) => {
      if (vote.card) {
        if (!dist[vote.card]) {
          dist[vote.card] = {
            value: vote.card,
            count: 0,
            percentage: 0,
            users: [],
            isNumeric: !isNaN(parseFloat(vote.card)),
            deviation: undefined,
          };
        }

        dist[vote.card].count++;
        const user = users.find((u) => u.id === vote.userId);
        if (user) {
          dist[vote.card].users.push(user.username);
        }
      }
    });

    // Calculate percentages and deviation from median
    Object.values(dist).forEach((item) => {
      item.percentage = (item.count / totalVotes) * 100;
      if (item.isNumeric && median !== undefined) {
        item.deviation = Math.abs(parseFloat(item.value) - median);
      }
    });

    return Object.entries(dist).sort(([a], [b]) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [votes, users, median]);

  const maxCount = Math.max(...distribution.map(([_, data]) => data.count));

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Vote Distribution
      </h4>

      <div className="space-y-2">
        {distribution.map(([card, data]) => {
          const isOutlier = data.deviation !== undefined && data.deviation > 5;
          const isMode = data.count === maxCount;

          return (
            <div key={card} className="group relative">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-14 text-center font-semibold rounded-md px-2 py-1.5 text-sm transition-all",
                    isMode && "ring-2 ring-blue-400 dark:ring-blue-500",
                    isOutlier
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                  )}
                >
                  {card}
                </div>

                <div className="flex-1 relative">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500 relative",
                        isMode
                          ? "bg-blue-500 dark:bg-blue-400"
                          : "bg-gray-400 dark:bg-gray-500",
                      )}
                      style={{ width: `${data.percentage}%` }}
                    >
                      <span className="absolute right-2 top-0 text-xs text-white font-medium leading-6">
                        {data.count}
                      </span>
                    </div>
                  </div>

                  {/* Hover tooltip */}
                  <div className="absolute left-0 -top-8 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {data.users.join(", ")}
                    {data.deviation !== undefined && (
                      <span className="ml-2 text-gray-300">
                        (±{data.deviation.toFixed(1)} from median)
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual indicators */}
                <div className="flex items-center gap-1">
                  {isMode && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Mode
                    </span>
                  )}
                  {isOutlier && (
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {distribution.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">
          No votes recorded yet
        </p>
      )}
    </div>
  );
}
