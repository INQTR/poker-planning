import { Handle, Position, NodeProps } from "@xyflow/react";
import { ReactElement, memo, useMemo } from "react";

import { cn } from "@/lib/utils";

import type { PlayerNodeType } from "../types";

export const PlayerNode = memo(
  ({ data }: NodeProps<PlayerNodeType>): ReactElement => {
    const { user, isCurrentUser, isCardPicked, card } = data;

    const initials = useMemo(
      () =>
        user.username
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      [user.username],
    );

    const nodeClasses = useMemo(
      () =>
        cn(
          "flex flex-col items-center gap-2 p-3 rounded-lg shadow-lg border-2 transition-all",
          "bg-white dark:bg-gray-800",
          isCurrentUser
            ? "border-blue-500 dark:border-blue-400"
            : "border-gray-200 dark:border-gray-600",
          isCardPicked &&
            "ring-2 ring-green-400 dark:ring-green-500 ring-offset-2 dark:ring-offset-gray-900",
        ),
      [isCurrentUser, isCardPicked],
    );

    const avatarClasses = useMemo(
      () =>
        cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg",
          isCurrentUser ? "bg-blue-500" : "bg-gray-500",
        ),
      [isCurrentUser],
    );

    return (
      <div className="relative">
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
        <div
          className={nodeClasses}
          role="article"
          aria-label={`Player ${user.username}${isCurrentUser ? " (you)" : ""}${
            isCardPicked ? " has voted" : " has not voted yet"
          }`}
        >
          <div className={avatarClasses} aria-hidden="true">
            {initials}
          </div>

          <div
            className="text-sm font-medium text-gray-900 dark:text-gray-100 max-w-[100px] truncate"
            title={user.username}
          >
            {user.username}
          </div>

          {isCardPicked && (
            <div
              className="absolute -top-2 -right-2"
              aria-label={card ? `Voted: ${card}` : "Vote submitted"}
            >
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
                    aria-hidden="true"
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
          id="top"
          className="bg-gray-400! dark:bg-gray-600!"
          aria-hidden="true"
        />
      </div>
    );
  },
);

PlayerNode.displayName = "PlayerNode";
