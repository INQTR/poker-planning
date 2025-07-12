import { NodeProps, Node } from "@xyflow/react";
import { ReactElement, memo, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type TimerNodeData = {
  duration: number;
  isRunning: boolean;
};

type TimerNodeType = Node<TimerNodeData, "timer">;

export const TimerNode = memo(
  ({ data }: NodeProps<TimerNodeType>): ReactElement => {
    const { isRunning } = data;
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
      if (!isRunning) {
        setSeconds(0);
        return;
      }

      const interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);

      return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (totalSeconds: number) => {
      const minutes = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    return (
      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isRunning ? "bg-red-500 animate-pulse" : "bg-gray-400",
            )}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
    );
  },
);

TimerNode.displayName = "TimerNode";
