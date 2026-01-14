"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { ReactElement, memo, useMemo } from "react";

import { cn } from "@/lib/utils";
import type { ResultsNodeType } from "../types";

export const ResultsNode = memo(
  ({ data, selected }: NodeProps<ResultsNodeType>): ReactElement => {
    const { votes, isNumericScale } = data;

    // Calculate average, median, agreement, and vote groups inline
    const { average, median, agreement, voteGroups, totalVotes } = useMemo(() => {
      const validVotes = votes.filter((v) => v.hasVoted && v.cardLabel);

      // Get numeric votes for average and median (only for numeric scales, exclude "?" and special cards)
      let avg = null;
      let med = null;
      if (isNumericScale) {
        const numericVotes = validVotes
          .map((v) => parseFloat(v.cardLabel || ""))
          .filter((v) => !isNaN(v));

        if (numericVotes.length > 0) {
          // Calculate average
          avg = numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length;

          // Calculate median
          const sorted = [...numericVotes].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          med = sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
        }
      }

      // Group votes by value
      const groups: Record<string, number> = {};
      validVotes.forEach((vote) => {
        const label = vote.cardLabel!;
        groups[label] = (groups[label] || 0) + 1;
      });

      // Sort: numeric first (ascending), then special chars
      const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        if (!isNaN(numA)) return -1;
        if (!isNaN(numB)) return 1;
        return a.localeCompare(b);
      });

      // Calculate agreement as percentage of votes on the most common value
      const counts = Object.values(groups);
      const maxCount = counts.length > 0 ? Math.max(...counts) : 0;
      const total = validVotes.length;
      const agreement = total > 0 ? Math.round((maxCount / total) * 100) : 0;

      return {
        average: avg,
        median: med,
        agreement,
        voteGroups: sortedGroups,
        totalVotes: total,
      };
    }, [votes, isNumericScale]);

    // Empty state
    if (totalVotes === 0) {
      return (
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            className="bg-gray-400! dark:bg-surface-3!"
            aria-hidden="true"
          />
          <div className={cn(
            "p-3 bg-white dark:bg-surface-1 rounded-lg shadow-md border border-gray-200 dark:border-border",
            selected && "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-surface-1"
          )}>
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full bg-gray-400"
                aria-hidden="true"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                No votes yet
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="bg-gray-400! dark:bg-surface-3!"
          aria-hidden="true"
        />
        <div className={cn(
          "p-3 bg-white dark:bg-surface-1 rounded-lg shadow-md border border-gray-200 dark:border-border",
          selected && "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-surface-1"
        )}>
          <div className="flex items-center gap-4">
            {/* Status indicator */}
            <div
              className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"
              aria-hidden="true"
            />

            {/* Average display - only for numeric scales */}
            {isNumericScale && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Avg
                </span>
                <span className="text-lg font-mono font-medium text-gray-700 dark:text-gray-300">
                  {average !== null ? average.toFixed(1) : "—"}
                </span>
              </div>
            )}

            {/* Median display - only for numeric scales */}
            {isNumericScale && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Med
                </span>
                <span className="text-lg font-mono font-medium text-gray-700 dark:text-gray-300">
                  {median !== null ? median.toFixed(1) : "—"}
                </span>
              </div>
            )}

            {/* Agreement display */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Agree
              </span>
              <span
                className={cn(
                  "text-lg font-mono font-medium",
                  agreement > 80
                    ? "text-green-600 dark:text-green-400"
                    : agreement >= 60
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-700 dark:text-gray-300"
                )}
              >
                {agreement}%
              </span>
            </div>

            {/* Simplified distribution bars */}
            <div className="flex-1 flex flex-col gap-0.5 min-w-24">
              {voteGroups.map(([label, count]) => {
                const percentage = (count / totalVotes) * 100;
                return (
                  <div key={label} className="flex items-center gap-1.5 h-4">
                    <span className="w-5 text-xs text-right text-gray-600 dark:text-gray-400 font-medium">
                      {label}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-surface-2 rounded">
                      <div
                        className="h-full bg-gray-400 dark:bg-surface-3 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-4 text-xs text-gray-500 dark:text-gray-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ResultsNode.displayName = "ResultsNode";
