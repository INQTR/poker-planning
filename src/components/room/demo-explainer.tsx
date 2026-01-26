"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoExplainer() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="fixed bottom-4 left-4 z-40 max-w-sm"
      role="complementary"
      aria-label="Planning Poker Guide"
    >
      <div className="bg-white/95 dark:bg-surface-1/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-border overflow-hidden">
        {/* Header - always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-surface-2 transition-colors"
          aria-expanded={isExpanded}
          aria-controls="demo-explainer-content"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
              What is Planning Poker?
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* Content - collapsible */}
        <div
          id="demo-explainer-content"
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 pb-4 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Planning Poker</strong> (also called <strong>Scrum Poker</strong>) is an agile estimation technique used by development teams to estimate the effort of user stories.
            </p>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                How It Works
              </h3>
              <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5 list-decimal list-inside">
                <li>A story or task is presented to the team</li>
                <li>Each member privately selects a card representing their estimate</li>
                <li>All cards are revealed simultaneously</li>
                <li>Team discusses differences and reaches consensus</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                Why Use It?
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
                <li>Prevents anchoring bias from vocal team members</li>
                <li>Encourages participation from everyone</li>
                <li>Reveals hidden complexity early</li>
                <li>Builds shared understanding of the work</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-border space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This demo shows a live planning poker session. Cards use the Fibonacci sequence (1, 2, 3, 5, 8, 13...) to reflect increasing uncertainty in larger estimates.
              </p>
              <Link
                href="/blog/how-to-facilitate-planning-poker"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Learn how to facilitate a session
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
