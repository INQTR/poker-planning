import { ReactElement } from "react";

import { cn } from "@/lib/utils";

interface AgreementAnalysisProps {
  consensusStrength: number;
  agreementLevel: "strong" | "moderate" | "weak";
  hasSplit: boolean;
  splitGroups?: string[];
  voteClusters?: string[];
}

export function AgreementAnalysis({
  consensusStrength,
  agreementLevel,
  hasSplit,
  splitGroups,
  voteClusters,
}: AgreementAnalysisProps): ReactElement {
  const getAgreementColor = () => {
    switch (agreementLevel) {
      case "strong":
        return "text-green-600 dark:text-green-400";
      case "moderate":
        return "text-amber-600 dark:text-amber-400";
      case "weak":
        return "text-red-600 dark:text-red-400";
    }
  };

  const getAgreementBgColor = () => {
    switch (agreementLevel) {
      case "strong":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "moderate":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      case "weak":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    }
  };

  const getAgreementIcon = () => {
    switch (agreementLevel) {
      case "strong":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "moderate":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "weak":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        Agreement Analysis
      </h4>

      <div className={cn("rounded-lg border p-3", getAgreementBgColor())}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={cn("", getAgreementColor())}>
              {getAgreementIcon()}
            </span>
            <span
              className={cn("font-semibold capitalize", getAgreementColor())}
            >
              {agreementLevel} Agreement
            </span>
          </div>
          <span className={cn("text-2xl font-bold", getAgreementColor())}>
            {consensusStrength.toFixed(0)}%{consensusStrength > 95 && " 🎉"}
          </span>
        </div>

        {/* Visual agreement bar */}
        <div className="mb-3">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                agreementLevel === "strong" && "bg-green-500 dark:bg-green-400",
                agreementLevel === "moderate" &&
                  "bg-amber-500 dark:bg-amber-400",
                agreementLevel === "weak" && "bg-red-500 dark:bg-red-400",
              )}
              style={{ width: `${consensusStrength}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Split detection */}
        {hasSplit && splitGroups && (
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-md p-2 mb-2">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <div className="text-xs">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Team Split Detected
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Votes divided between: {splitGroups.join(" and ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vote clusters */}
        {voteClusters && voteClusters.length > 0 && (
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-md p-2">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vote Patterns:
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
              {voteClusters.map((cluster, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-gray-400">•</span>
                  <span>{cluster}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Agreement level descriptions */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {agreementLevel === "strong" && (
          <p>✓ Team has strong consensus - ready to proceed</p>
        )}
        {agreementLevel === "moderate" && (
          <p>• Moderate agreement - consider brief discussion</p>
        )}
        {agreementLevel === "weak" && (
          <p>⚠ Low agreement - further discussion recommended</p>
        )}
      </div>
    </div>
  );
}
