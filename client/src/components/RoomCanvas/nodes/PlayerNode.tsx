import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { ReactElement, memo } from "react";

import { cn } from "@/lib/utils";
import { User } from "@/types";

type PlayerNodeData = {
  user: User;
  isCurrentUser: boolean;
  isCardPicked: boolean;
  card: string | null;
};

type PlayerNodeType = Node<PlayerNodeData, "player">;

export const PlayerNode = memo(
  ({ data }: NodeProps<PlayerNodeType>): ReactElement => {
    const { user, isCurrentUser, isCardPicked, card } = data;

    const initials = user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="relative">
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-gray-400 dark:!bg-gray-600"
        />
        <div
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-lg shadow-lg border-2 transition-all",
            "bg-white dark:bg-gray-800",
            isCurrentUser
              ? "border-blue-500 dark:border-blue-400"
              : "border-gray-200 dark:border-gray-600",
            isCardPicked &&
              "ring-2 ring-green-400 dark:ring-green-500 ring-offset-2 dark:ring-offset-gray-900",
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg",
              isCurrentUser ? "bg-blue-500" : "bg-gray-500",
            )}
          >
            {initials}
          </div>

          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 max-w-[100px] truncate">
            {user.username}
          </div>

          {isCardPicked && (
            <div className="absolute -top-2 -right-2">
              {card ? (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {card}
                </div>
              ) : (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-gray-400 dark:!bg-gray-600"
        />
      </div>
    );
  },
);

PlayerNode.displayName = "PlayerNode";
