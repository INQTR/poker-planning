"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { ReactElement, memo } from "react";

import type { PlayerNodeType } from "../types";

export const PlayerNode = memo(
  ({ data }: NodeProps<PlayerNodeType>): ReactElement => {
    const { user, isCurrentUser, isCardPicked, card, isGameOver } = data;

    // Match VotingCardNode card style
    const cardClasses =
      "h-24 w-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold bg-white dark:bg-surface-1 border-gray-300 dark:border-border shadow-md";

    // Vote status emoji logic:
    // - 🤔 thinking (voting in progress, hasn't voted)
    // - ✅ voted (voting in progress, vote hidden)
    // - 😴 didn't vote (game over, no vote)
    // - card value (game over, voted)
    const getVoteDisplay = () => {
      if (isGameOver) {
        return isCardPicked ? card : "😴";
      }
      return isCardPicked ? "✅" : "🤔";
    };

    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="bg-gray-400! dark:bg-surface-3!"
          aria-hidden="true"
        />
        <div
          className="flex flex-col items-center gap-2"
          role="article"
          aria-label={`Player ${user.name}${isCurrentUser ? " (you)" : ""}${
            isCardPicked ? ", has voted" : ", has not voted yet"
          }${card ? `, voted ${card}` : ""}`}
        >
          {/* Card */}
          <div className={cardClasses}>{getVoteDisplay()}</div>

          {/* Player Name */}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            {user.name}
            {isCurrentUser && (
              <span className="text-gray-400 dark:text-gray-500"> (you)</span>
            )}
          </span>
        </div>
      </div>
    );
  },
);

PlayerNode.displayName = "PlayerNode";