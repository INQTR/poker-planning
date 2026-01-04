"use client";

import { FC } from "react";
import { Lightbulb, TrendingUp } from "lucide-react";

interface InsightsPanelProps {
  insights: string[];
  recommendations: string[];
}

export const InsightsPanel: FC<InsightsPanelProps> = ({
  insights,
  recommendations,
}) => {
  if (insights.length === 0 && recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {insights.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h4 className="text-sm font-medium text-foreground/80 dark:text-foreground/80">
              Insights
            </h4>
          </div>
          <ul className="space-y-1">
            {insights.map((insight, idx) => (
              <li
                key={idx}
                className="text-xs text-muted-foreground flex items-start gap-1"
              >
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h4 className="text-sm font-medium text-foreground/80 dark:text-foreground/80">
              Recommendations
            </h4>
          </div>
          <ul className="space-y-1">
            {recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="text-xs text-muted-foreground flex items-start gap-1"
              >
                <span className="text-blue-500 mt-0.5">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};