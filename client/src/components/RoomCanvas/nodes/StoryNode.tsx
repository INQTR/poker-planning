import { Handle, Position, NodeProps } from "@xyflow/react";
import { Play, RotateCcw } from "lucide-react";
import {
  ReactElement,
  memo,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

import { cn } from "@/lib/utils";

import type { StoryNodeType } from "../types";

export const StoryNode = memo(
  ({ data }: NodeProps<StoryNodeType>): ReactElement => {
    const {
      title,
      description,
      isGameOver,
      hasVotes,
      onRevealCards,
      onResetGame,
    } = data;
    const isActive = !isGameOver; // Active when game is not over

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

    const handleResetClick = useCallback(() => {
      if (resetCooldown === 0 && onResetGame) {
        setResetCooldown(3); // 3 second cooldown
        onResetGame();
      }
    }, [resetCooldown, onResetGame]);

    const nodeClasses = useMemo(
      () =>
        cn(
          "p-4 rounded-lg shadow-lg border-2 transition-all min-w-[200px] max-w-[300px]",
          isActive
            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-amber-600"
            : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
        ),
      [isActive],
    );

    const dotClasses = useMemo(
      () =>
        cn("w-2 h-2 rounded-full", isActive ? "bg-amber-500" : "bg-gray-400"),
      [isActive],
    );

    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Top}
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
        <Handle
          type="target"
          position={Position.Right}
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
        <Handle
          type="target"
          position={Position.Bottom}
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
        <Handle
          type="target"
          position={Position.Left}
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />

        <div
          className={nodeClasses}
          role="article"
          aria-label={`Story: ${title}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={dotClasses} aria-hidden="true" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>

          <p
            className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3"
            title={description}
          >
            {description}
          </p>

          {/* Status and Controls */}
          <div className="mt-3 space-y-2">
            {/* Status Display */}
            {isActive ? (
              <div className="flex items-center gap-2" aria-live="polite">
                <div
                  className="flex-1 bg-amber-200 dark:bg-amber-800 rounded-full h-2"
                  role="progressbar"
                  aria-label="Voting in progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="bg-amber-500 dark:bg-amber-400 h-2 rounded-full w-0 animate-pulse" />
                </div>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Voting...
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2" aria-live="polite">
                <svg
                  className="w-4 h-4 text-green-600 dark:text-green-400"
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
                <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                  Voting Complete
                </span>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              {!isGameOver && hasVotes && (
                <button
                  onClick={onRevealCards}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                  aria-label="Reveal all cards"
                >
                  <Play className="h-3 w-3" />
                  Reveal
                </button>
              )}
              {isGameOver && (
                <button
                  onClick={handleResetClick}
                  disabled={resetCooldown > 0}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    resetCooldown > 0
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600",
                  )}
                  aria-label={
                    resetCooldown > 0
                      ? `Wait ${resetCooldown} seconds`
                      : "Start new round"
                  }
                >
                  <RotateCcw
                    className={cn(
                      "h-3 w-3",
                      resetCooldown > 0 && "animate-spin",
                    )}
                  />
                  {resetCooldown > 0 ? `Wait ${resetCooldown}s` : "New Round"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

StoryNode.displayName = "StoryNode";
