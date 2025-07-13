import { NodeProps } from "@xyflow/react";
import { ReactElement, memo, useCallback, useMemo, useState } from "react";

import { usePickCardMutation } from "@/api";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import type { VotingCardNodeType } from "../types";

export const VotingCardNode = memo(
  ({ data, selected }: NodeProps<VotingCardNodeType>): ReactElement => {
    const { card, userId, roomId, isSelectable, onCardSelect, isSelected } =
      data;
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    // Use either the node's selected prop or data.isSelected
    const isCardSelected = selected || isSelected;

    const [pickCardMutation] = usePickCardMutation({
      onError(error) {
        toast.error(`Pick card: ${error.message}`);
      },
    });

    const handleClick = useCallback(() => {
      if (!isSelectable || !userId) return;

      setIsClicking(true);

      // Update local state immediately for instant feedback
      if (onCardSelect) {
        onCardSelect(card.value);
      }

      pickCardMutation({
        variables: {
          userId,
          roomId,
          card: card.value,
        },
      });

      // Reset clicking state after animation
      setTimeout(() => setIsClicking(false), 200);
    }, [
      isSelectable,
      userId,
      roomId,
      card.value,
      pickCardMutation,
      onCardSelect,
    ]);

    const containerClasses = useMemo(
      () =>
        cn(
          "transition-all duration-200 select-none relative",
          isCardSelected && "transform -translate-y-3",
          isHovered &&
            isSelectable &&
            !isCardSelected &&
            "transform -translate-y-1",
          isClicking && "transform scale-95",
          !isSelectable && "cursor-not-allowed",
        ),
      [isCardSelected, isSelectable, isHovered, isClicking],
    );

    const cardClasses = useMemo(
      () =>
        cn(
          "h-24 w-16 text-2xl rounded-xl",
          "flex items-center justify-center font-bold",
          "bg-white dark:bg-gray-800 transition-all duration-200",
          "border-2 relative overflow-hidden",
          isSelectable && "cursor-pointer",
          isCardSelected
            ? "border-blue-500 dark:border-blue-400 bg-blue-500 text-white dark:bg-blue-600 shadow-lg shadow-blue-500/30"
            : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-md",
          isHovered &&
            isSelectable &&
            !isCardSelected &&
            "border-gray-400 dark:border-gray-500 shadow-lg",
          !isSelectable && "opacity-50 cursor-not-allowed shadow-sm",
        ),
      [isCardSelected, isSelectable, isHovered],
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
        aria-pressed={isCardSelected}
        aria-disabled={!isSelectable}
        className={containerClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsClicking(false);
        }}
      >
        <div className={cardClasses}>
          {/* Shimmer effect for selected cards */}
          {isCardSelected && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              style={{
                animation: "shimmer 2s infinite",
              }}
            />
          )}

          {/* Hover glow effect */}
          {isHovered && isSelectable && !isCardSelected && (
            <div
              className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"
              style={{
                animation: "fadeIn 0.2s ease-in-out",
              }}
            />
          )}

          <span className="relative z-10">{card.value}</span>
        </div>
      </div>
    );
  },
);

VotingCardNode.displayName = "VotingCardNode";
