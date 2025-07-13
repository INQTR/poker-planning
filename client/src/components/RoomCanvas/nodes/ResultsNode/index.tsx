import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { ReactElement, memo, useState } from "react";

import { cn } from "@/lib/utils";
import { UserCard, User } from "@/types";

import { AgreementAnalysis } from "./components/AgreementAnalysis";
import { InsightsPanel } from "./components/InsightsPanel";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { VoteDistribution } from "./components/VoteDistribution";
import { useVoteAnalysis } from "./hooks/useVoteAnalysis";

type ResultsNodeData = {
  votes: UserCard[];
  users: User[];
};

type ResultsNodeType = Node<ResultsNodeData, "results">;

export const ResultsNode = memo(
  ({ data }: NodeProps<ResultsNodeType>): ReactElement => {
    const { votes, users } = data;
    const [isExpanded, setIsExpanded] = useState(true);

    const {
      stats,
      participationRate,
      voteClusters,
      agreementQuality,
      insights,
      recommendations,
    } = useVoteAnalysis(votes, users);

    return (
      <div className="relative">
        <Handle
          type="source"
          position={Position.Left}
          className="bg-gray-400! dark:bg-gray-600!"
        />

        <div
          className={cn(
            "bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-green-400 dark:border-green-600 transition-all",
            isExpanded ? "min-w-[320px] max-w-[400px]" : "min-w-[250px]",
          )}
        >
          {/* Header */}
          <div className="p-4 pb-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                Voting Results
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {votes.filter((v) => v.card).length}/{votes.length} voted
                </span>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg
                    className={cn(
                      "w-4 h-4 transition-transform",
                      !isExpanded && "rotate-180",
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Summary (always visible) */}
            <div className="grid grid-cols-3 gap-2 pb-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Average
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stats.average.toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Median
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stats.median.toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Agreement
                </p>
                <p
                  className={cn(
                    "text-lg font-bold",
                    agreementQuality.consensusStrength > 80
                      ? "text-green-600 dark:text-green-400"
                      : agreementQuality.consensusStrength > 60
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {agreementQuality.consensusStrength.toFixed(0)}%
                  {agreementQuality.consensusStrength > 95 && " 🎉"}
                </p>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-4 border-t dark:border-gray-700">
              {/* Vote Distribution */}
              <div className="pt-4">
                <VoteDistribution
                  votes={votes}
                  users={users}
                  median={stats.median}
                />
              </div>

              {/* Agreement Analysis */}
              <AgreementAnalysis
                consensusStrength={agreementQuality.consensusStrength}
                agreementLevel={agreementQuality.agreementLevel}
                hasSplit={agreementQuality.hasSplit}
                splitGroups={agreementQuality.splitGroups}
                voteClusters={voteClusters}
              />

              {/* Statistics Panel */}
              <StatisticsPanel
                stats={stats}
                participationRate={participationRate}
              />

              {/* Insights Panel */}
              <InsightsPanel
                insights={insights}
                recommendations={recommendations}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

ResultsNode.displayName = "ResultsNode";
