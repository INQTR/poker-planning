import { Handle, Position, NodeProps } from "@xyflow/react";
import { ReactElement, memo, useMemo } from "react";

import { cn } from "@/lib/utils";

import type { StoryNodeType } from "../types";

export const StoryNode = memo(
  ({ data }: NodeProps<StoryNodeType>): ReactElement => {
    const { title, description } = data;
    const isActive = true; // Always active in current implementation

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

          {isActive && (
            <div className="mt-3 flex items-center gap-2" aria-live="polite">
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
          )}
        </div>
      </div>
    );
  },
);

StoryNode.displayName = "StoryNode";
