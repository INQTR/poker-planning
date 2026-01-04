"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";

interface AgreementAnalysisProps {
  consensusStrength: number;
  agreementLevel: "high" | "medium" | "low";
  hasSplit: boolean;
  splitGroups?: Array<{
    values: number[];
    count: number;
  }>;
  voteClusters: Array<{
    value: number;
    count: number;
    percentage: number;
    users: string[];
  }>;
}

export const AgreementAnalysis: FC<AgreementAnalysisProps> = ({
  consensusStrength,
  agreementLevel,
  hasSplit,
  splitGroups,
  voteClusters,
}) => {
  const getAgreementColor = () => {
    switch (agreementLevel) {
      case "high":
        return "text-green-600 dark:text-status-success-fg";
      case "medium":
        return "text-amber-600 dark:text-status-warning-fg";
      case "low":
        return "text-red-600 dark:text-status-error-fg";
    }
  };

  const getAgreementIcon = () => {
    switch (agreementLevel) {
      case "high":
        return "👍";
      case "medium":
        return "🤔";
      case "low":
        return "⚠️";
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Team Agreement
      </h4>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getAgreementIcon()}</span>
          <span className={cn("text-sm font-medium capitalize", getAgreementColor())}>
            {agreementLevel} Agreement
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {consensusStrength.toFixed(0)}% consensus
        </span>
      </div>

      {hasSplit && splitGroups && (
        <div className="mt-2 p-2 bg-amber-50 dark:bg-status-warning-bg rounded-md">
          <p className="text-xs text-amber-700 dark:text-status-warning-fg">
            Team opinion is split:
          </p>
          <div className="mt-1 space-y-1">
            {splitGroups.map((group, idx) => (
              <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                • {group.count} {group.count === 1 ? "person" : "people"} voted {group.values.join(", ")}
              </div>
            ))}
          </div>
        </div>
      )}

      {voteClusters.length > 0 && voteClusters[0].percentage > 60 && (
        <div className="mt-2 p-2 bg-green-50 dark:bg-status-success-bg rounded-md">
          <p className="text-xs text-green-700 dark:text-status-success-fg">
            Majority ({voteClusters[0].percentage.toFixed(0)}%) agrees on: {voteClusters[0].value}
          </p>
        </div>
      )}
    </div>
  );
};