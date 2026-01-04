"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";
import type { SanitizedVote } from "@/convex/model/rooms";

interface VoteDistributionProps {
  votes: SanitizedVote[];
  users: Doc<"users">[];
  median: number;
}

export const VoteDistribution: FC<VoteDistributionProps> = ({
  votes,
  users,
  median,
}) => {
  // Group votes by value
  const voteGroups = votes.reduce((acc: Record<string, Doc<"users">[]>, vote) => {
    if (vote.hasVoted && vote.cardLabel) {
      if (!acc[vote.cardLabel]) {
        acc[vote.cardLabel] = [];
      }
      const user = users.find((u) => u._id === vote.userId);
      if (user) {
        acc[vote.cardLabel].push(user);
      }
    }
    return acc;
  }, {});

  // Sort by card value
  const sortedGroups = Object.entries(voteGroups).sort(([a], [b]) => {
    const aNum = parseInt(a) || 999; // Put "?" at the end
    const bNum = parseInt(b) || 999;
    return aNum - bNum;
  });


  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Vote Distribution
      </h4>
      <div className="space-y-1">
        {sortedGroups.map(([value, voters]) => {
          const percentage = (voters.length / votes.filter(v => v.hasVoted).length) * 100;
          const isMedian = parseInt(value) === Math.floor(median);
          
          return (
            <div key={value} className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-8 text-center text-sm font-medium",
                  isMedian && "text-blue-600 dark:text-status-info-fg"
                )}
              >
                {value}
              </div>
              <div className="flex-1">
                <div className="relative h-6 bg-gray-100 dark:bg-surface-2 rounded">
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full rounded transition-all",
                      isMedian
                        ? "bg-blue-500 dark:bg-status-info-fg"
                        : "bg-gray-400 dark:bg-surface-3"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                      {voters.length} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[100px] truncate">
                {voters.map((v) => v.name).join(", ")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};