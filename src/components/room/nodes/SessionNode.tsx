"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { Play, RotateCcw, Users, Hash, Zap, X } from "lucide-react";
import {
  ReactElement,
  memo,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

import { cn } from "@/lib/utils";

import type { SessionNodeType } from "../types";

export const SessionNode = memo(
  ({ data }: NodeProps<SessionNodeType>): ReactElement => {
    const {
      sessionName,
      participantCount,
      voteCount,
      isVotingComplete,
      hasVotes,
      autoCompleteVoting,
      autoRevealCountdownStartedAt,
      onRevealCards,
      onResetGame,
      onToggleAutoComplete,
      onCancelAutoReveal,
      onExecuteAutoReveal,
    } = data;

    const isActive = !isVotingComplete;

    // Cooldown state for reset button
    const [resetCooldown, setResetCooldown] = useState(0);

    useEffect(() => {
      if (resetCooldown > 0) {
        const timer = setTimeout(() => {
          setResetCooldown(resetCooldown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [resetCooldown]);

    // Auto-reveal countdown state
    const COUNTDOWN_DURATION_SECONDS = 3;
    const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);

    useEffect(() => {
      if (!autoRevealCountdownStartedAt) {
        setCountdownSeconds(null);
        return;
      }

      const updateCountdown = () => {
        const elapsed = (Date.now() - autoRevealCountdownStartedAt) / 1000;
        const remaining = Math.max(0, COUNTDOWN_DURATION_SECONDS - elapsed);

        if (remaining <= 0) {
          setCountdownSeconds(0);
          // Trigger the reveal
          onExecuteAutoReveal?.();
        } else {
          setCountdownSeconds(Math.ceil(remaining));
        }
      };

      // Update immediately
      updateCountdown();

      // Then update every 100ms for smooth countdown
      const interval = setInterval(updateCountdown, 100);
      return () => clearInterval(interval);
    }, [autoRevealCountdownStartedAt, onExecuteAutoReveal]);

    const isCountdownActive = countdownSeconds !== null && countdownSeconds > 0;

    const handleResetClick = useCallback(() => {
      if (resetCooldown === 0 && onResetGame) {
        setResetCooldown(3); // 3 second cooldown
        onResetGame();
      }
    }, [resetCooldown, onResetGame]);

    const nodeClasses = useMemo(
      () =>
        cn(
          "p-4 rounded-lg shadow-lg border-2 transition-all min-w-[280px] max-w-[320px]",
          isActive
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-400 dark:border-blue-600"
            : "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 dark:border-green-600",
        ),
      [isActive],
    );

    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left"
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />

        <div
          className={nodeClasses}
          role="article"
          aria-label={`Planning session: ${sessionName}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {sessionName || "Planning Session"}
            </h3>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-blue-500 animate-pulse" : "bg-green-500",
              )}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {participantCount}{" "}
                {participantCount === 1 ? "participant" : "participants"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {voteCount} {voteCount === 1 ? "vote" : "votes"}
              </span>
            </div>
          </div>

          {/* Auto-reveal toggle */}
          <button
            onClick={onToggleAutoComplete}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-1.5 mb-3 rounded-md text-xs font-medium transition-colors",
              autoCompleteVoting
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
            )}
            aria-label={
              autoCompleteVoting
                ? "Disable auto-reveal when all vote"
                : "Enable auto-reveal when all vote"
            }
            aria-pressed={autoCompleteVoting}
          >
            <Zap
              className={cn(
                "h-3.5 w-3.5",
                autoCompleteVoting && "text-amber-500 dark:text-amber-400",
              )}
            />
            <span>Auto-reveal: {autoCompleteVoting ? "On" : "Off"}</span>
          </button>

          {/* Status */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {isActive ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-full h-2 overflow-hidden"
                    role="progressbar"
                    aria-label="Voting progress"
                    aria-valuemin={0}
                    aria-valuemax={participantCount}
                    aria-valuenow={voteCount}
                  >
                    <div
                      className="bg-blue-500 dark:bg-blue-400 h-2 transition-all duration-300"
                      style={{
                        width: `${
                          participantCount > 0
                            ? (voteCount / participantCount) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-blue-700 dark:text-blue-300 font-medium whitespace-nowrap">
                    {voteCount}/{participantCount}
                  </span>
                </div>

                {isCountdownActive ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                        {countdownSeconds}
                      </div>
                      <span className="text-sm text-amber-700 dark:text-amber-300">
                        Revealing...
                      </span>
                    </div>
                    <button
                      onClick={onCancelAutoReveal}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
                      aria-label="Cancel auto-reveal"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                ) : hasVotes ? (
                  <button
                    onClick={onRevealCards}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    aria-label="Reveal all cards"
                  >
                    <Play className="h-4 w-4" />
                    Reveal Cards
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Voting Complete</span>
                </div>

                <button
                  onClick={handleResetClick}
                  disabled={resetCooldown > 0}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    resetCooldown > 0
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200",
                  )}
                  aria-label={
                    resetCooldown > 0
                      ? `Wait ${resetCooldown} seconds`
                      : "Start new round"
                  }
                >
                  <RotateCcw
                    className={cn(
                      "h-4 w-4",
                      resetCooldown > 0 && "animate-spin",
                    )}
                  />
                  {resetCooldown > 0 ? `Wait ${resetCooldown}s` : "New Round"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

SessionNode.displayName = "SessionNode";