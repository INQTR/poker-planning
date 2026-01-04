"use client";

import { FC } from "react";

interface StatisticsPanelProps {
  stats: {
    average: number;
    median: number;
    mode: number[];
    standardDeviation: number;
    range: number;
    outliers: number[];
  };
  participationRate: number;
}

export const StatisticsPanel: FC<StatisticsPanelProps> = ({
  stats,
  participationRate,
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Statistics
      </h4>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Participation:</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {participationRate.toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Range:</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {stats.range}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Std Dev:</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {stats.standardDeviation.toFixed(1)}
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          {stats.mode.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Mode:</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {stats.mode.join(", ")}
              </span>
            </div>
          )}
          {stats.outliers.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Outliers:</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {stats.outliers.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {stats.standardDeviation > 5 && (
        <div className="mt-2 p-2 bg-amber-50 dark:bg-status-warning-bg rounded-md">
          <p className="text-xs text-amber-700 dark:text-status-warning-fg">
            High variance in estimates suggests need for discussion
          </p>
        </div>
      )}
    </div>
  );
};