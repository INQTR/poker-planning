import { NodeProps } from "@xyflow/react";
import { ReactElement, memo, useCallback, useMemo } from "react";

import { usePickCardMutation } from "@/api";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import type { VotingCardNodeType } from "../types";

export const VotingCardNode = memo(
  ({ data, selected }: NodeProps<VotingCardNodeType>): ReactElement => {
    const { card, userId, roomId, isSelectable } = data;

    const [pickCardMutation] = usePickCardMutation({
      onError(error) {
        toast.error(`Pick card: ${error.message}`);
      },
    });

    const handleClick = useCallback(() => {
      if (!isSelectable || !userId) return;

      pickCardMutation({
        variables: {
          userId,
          roomId,
          card: card.value,
        },
      });
    }, [isSelectable, userId, roomId, card.value, pickCardMutation]);

    const containerClasses = useMemo(
      () =>
        cn(
          "transition-all duration-200 select-none",
          selected && "transform -translate-y-2",
          !isSelectable && "cursor-not-allowed",
        ),
      [selected, isSelectable],
    );

    const cardClasses = useMemo(
      () =>
        cn(
          "h-24 w-16 text-2xl rounded-xl shadow-md",
          "flex items-center justify-center font-bold",
          "bg-white dark:bg-gray-800 transition-all duration-200",
          "border-2",
          isSelectable && "hover:shadow-lg cursor-pointer",
          selected
            ? "border-blue-500 dark:border-blue-400 bg-blue-500 text-white dark:bg-blue-600"
            : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
          !isSelectable && "opacity-50 cursor-not-allowed",
        ),
      [selected, isSelectable],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && isSelectable) {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick, isSelectable],
    );

    return (
      <div
        role="button"
        tabIndex={isSelectable ? 0 : -1}
        aria-label={`Vote ${card.value}`}
        aria-pressed={selected}
        aria-disabled={!isSelectable}
        className={containerClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div className={cardClasses}>{card.value}</div>
      </div>
    );
  },
);

VotingCardNode.displayName = "VotingCardNode";
