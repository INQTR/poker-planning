import { NodeProps, Node, Handle, Position } from "@xyflow/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import {
  ReactElement,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type TimerNodeData = {
  duration: number;
  isRunning: boolean;
};

type TimerNodeType = Node<TimerNodeData, "timer">;

export const TimerNode = memo(
  (_props: NodeProps<TimerNodeType>): ReactElement => {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
      if (isRunning) {
        intervalRef.current = setInterval(() => {
          setSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isRunning]);

    const handleToggle = useCallback(() => {
      setIsRunning((prev) => !prev);
    }, []);

    const handleReset = useCallback(() => {
      setIsRunning(false);
      setSeconds(0);
    }, []);

    const formatTime = (totalSeconds: number) => {
      const minutes = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

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
              className={cn(
                "w-2 h-2 rounded-full",
                isRunning ? "bg-red-500 animate-pulse" : "bg-gray-400",
              )}
              aria-hidden="true"
            />
            <span className="text-lg font-mono font-medium text-gray-700 dark:text-gray-300 min-w-[4rem]">
              {formatTime(seconds)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggle}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={isRunning ? "Pause timer" : "Start timer"}
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
                disabled={seconds === 0 && !isRunning}
              >
                <RotateCcw
                  className={cn(
                    "h-4 w-4",
                    seconds === 0 && !isRunning
                      ? "text-gray-400 dark:text-gray-600"
                      : "text-gray-600 dark:text-gray-400",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

TimerNode.displayName = "TimerNode";
