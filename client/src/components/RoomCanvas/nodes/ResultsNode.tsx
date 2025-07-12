import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { ReactElement, memo, useMemo } from "react";

import { cn } from "@/lib/utils";
import { UserCard, User } from "@/types";

type ResultsNodeData = {
  votes: UserCard[];
  users: User[];
};

type ResultsNodeType = Node<ResultsNodeData, "results">;

export const ResultsNode = memo(
  ({ data }: NodeProps<ResultsNodeType>): ReactElement => {
    const { votes, users } = data;

    const voteDistribution = useMemo(() => {
      const distribution: {
        [key: string]: { count: number; users: string[] };
      } = {};

      votes.forEach((vote) => {
        if (vote.card) {
          if (!distribution[vote.card]) {
            distribution[vote.card] = { count: 0, users: [] };
          }
          distribution[vote.card].count++;

          const user = users.find((u) => u.id === vote.userId);
          if (user) {
            distribution[vote.card].users.push(user.username);
          }
        }
      });

      return Object.entries(distribution).sort(([a], [b]) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });
    }, [votes, users]);

    const averageVote = useMemo(() => {
      const numericVotes = votes
        .map((vote) => parseFloat(vote.card || "0"))
        .filter((vote) => !isNaN(vote));
      const sum = numericVotes.reduce((acc, vote) => acc + vote, 0);
      return numericVotes.length > 0 ? sum / numericVotes.length : 0;
    }, [votes]);

    const agreement = useMemo(() => {
      const totalVotes = votes.length;
      const mostCommonVotes = Math.max(
        ...voteDistribution.map(([, data]) => data.count),
      );
      return totalVotes > 0 ? (mostCommonVotes / totalVotes) * 100 : 0;
    }, [votes, voteDistribution]);

    return (
      <div className="relative">
        <Handle
          type="source"
          position={Position.Left}
          className="!bg-gray-400 dark:!bg-gray-600"
        />

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-green-400 dark:border-green-600 min-w-[250px]">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" />
            Voting Results
          </h3>

          <div className="space-y-2 mb-4">
            {voteDistribution.map(([card, data]) => (
              <div key={card} className="flex items-center gap-2">
                <div className="w-12 text-center font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                  {card}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                    <div
                      className="bg-blue-500 dark:bg-blue-400 h-4 rounded-full"
                      style={{ width: `${(data.count / votes.length) * 100}%` }}
                    />
                    <span className="absolute right-2 top-0 text-xs text-gray-700 dark:text-gray-300 leading-4">
                      {data.count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t dark:border-gray-700 pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Average:
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {averageVote.toFixed(1)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Agreement:
              </span>
              <span
                className={cn(
                  "text-lg font-semibold",
                  agreement > 80
                    ? "text-green-600 dark:text-green-400"
                    : agreement > 60
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {agreement.toFixed(0)}%{agreement > 95 && " 🎉"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ResultsNode.displayName = "ResultsNode";
