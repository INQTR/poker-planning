import { ReactElement } from "react";

import { VoteStatistics } from "../utils/calculations";

interface StatisticsPanelProps {
  stats: VoteStatistics;
  participationRate: number;
}

export function StatisticsPanel({
  stats,
  participationRate,
}: StatisticsPanelProps): ReactElement {
  const metrics = [
    {
      label: "Average",
      value: stats.average.toFixed(1),
      icon: (
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
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
      description: "Mean of numeric votes",
      available: stats.numericVotes.length > 0,
    },
    {
      label: "Median",
      value: stats.median.toFixed(1),
      icon: (
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
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
      ),
      description: "Middle value",
      available: stats.numericVotes.length > 0,
    },
    {
      label: "Std Dev",
      value: stats.standardDeviation.toFixed(1),
      icon: (
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
            d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
      description: "Vote spread",
      available: stats.numericVotes.length > 1,
    },
    {
      label: "Range",
      value: `${stats.range.min}-${stats.range.max}`,
      icon: (
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
            d="M3 6l3 3m0 0l3-3M6 9V4m13 2l-3 3m0 0l3 3m-3-3v12"
          />
        </svg>
      ),
      description: "Min to max",
      available: stats.numericVotes.length > 0,
    },
    {
      label: "Mode",
      value: stats.mode.join(", "),
      icon: (
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
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      description: "Most common",
      available: stats.mode.length > 0,
    },
    {
      label: "Participation",
      value: `${participationRate.toFixed(0)}%`,
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      description: "Voted members",
      available: true,
    },
  ];

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
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
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Key Metrics
      </h4>

      <div className="grid grid-cols-2 gap-2">
        {metrics
          .filter((m) => m.available)
          .map((metric) => (
            <div
              key={metric.label}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-500 dark:text-gray-400">
                  {metric.icon}
                </span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {metric.label}
                </span>
              </div>
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {metric.value || "—"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {metric.description}
              </div>
            </div>
          ))}
      </div>

      {stats.numericVotes.length > 2 && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <p className="font-medium">95% Confidence Interval</p>
              <p>
                {stats.confidenceInterval.lower.toFixed(1)} -{" "}
                {stats.confidenceInterval.upper.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
