"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { ReactElement, memo, useCallback } from "react";

import { cn } from "@/lib/utils";
import { useTimerSync } from "../hooks/use-timer-sync";
import type { TimerNodeType } from "../types";

export const TimerNode = memo(
  ({ data }: NodeProps<TimerNodeType>): ReactElement => {
    // Extract required data for useTimerSync hook
    const { roomId, userId, nodeId } = data;

    // Use the synchronized timer hook instead of local state
    const {
      displayTime,
      isRunning,
      currentSeconds,
      onStart,
      onPause,
      onReset,
      isLoading,
      error,
    } = useTimerSync({
      roomId,
      nodeId: nodeId || "timer", // fallback to default timer nodeId
      userId,
    });

    // Handle toggle between start and pause
    const handleToggle = useCallback(() => {
      if (isRunning) {
        onPause();
      } else {
        onStart();
      }
    }, [isRunning, onStart, onPause]);

    // Use the onReset function from the hook
    const handleReset = useCallback(() => {
      onReset();
    }, [onReset]);

    // Show loading state if timer data is not yet available
    if (isLoading) {
      return (
        <div className="relative">
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="bg-gray-400! dark:bg-gray-600!"
            aria-hidden="true"
          />
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                aria-hidden="true"
              />
              <span className="text-lg font-mono font-medium text-gray-400 min-w-16">
                --:--
              </span>
              <div className="flex items-center gap-1">
                <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-700">
                  <Play className="h-4 w-4 text-gray-400" />
                </div>
                <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-700">
                  <RotateCcw className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
          {error && (
            <div className="mb-2 text-xs text-red-500 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isRunning ? "bg-red-500 animate-pulse" : "bg-gray-400"
              )}
              aria-hidden="true"
            />
            <span className="text-lg font-mono font-medium text-gray-700 dark:text-gray-300 min-w-16">
              {displayTime}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggle}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={isRunning ? "Pause timer" : "Start timer"}
                disabled={!!error}
              >
                {isRunning ? (
                  <Pause className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Play className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Reset timer"
                disabled={currentSeconds === 0 && !isRunning}
              >
                <RotateCcw
                  className={cn(
                    "h-4 w-4",
                    currentSeconds === 0 && !isRunning
                      ? "text-gray-400 dark:text-gray-600"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TimerNode.displayName = "TimerNode";
