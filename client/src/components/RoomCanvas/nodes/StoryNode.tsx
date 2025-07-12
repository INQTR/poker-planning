import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { ReactElement, memo } from "react";

import { cn } from "@/lib/utils";

type StoryNodeData = {
  title: string;
  description: string;
  storyId: string;
  isActive?: boolean;
};

type StoryNodeType = Node<StoryNodeData, "story">;

export const StoryNode = memo(
  ({ data }: NodeProps<StoryNodeType>): ReactElement => {
    const { title, description, isActive = true } = data;

    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-gray-400 dark:!bg-gray-600"
        />
        <Handle
          type="target"
          position={Position.Right}
          className="!bg-gray-400 dark:!bg-gray-600"
        />
        <Handle
          type="target"
          position={Position.Bottom}
          className="!bg-gray-400 dark:!bg-gray-600"
        />
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-gray-400 dark:!bg-gray-600"
        />

        <div
          className={cn(
            "p-4 rounded-lg shadow-lg border-2 transition-all min-w-[200px] max-w-[300px]",
            isActive
              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-amber-600"
              : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-amber-500" : "bg-gray-400",
              )}
            />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {description}
          </p>

          {isActive && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-amber-200 dark:bg-amber-800 rounded-full h-2">
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
