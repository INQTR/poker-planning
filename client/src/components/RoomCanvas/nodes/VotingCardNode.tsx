import { NodeProps, Node } from "@xyflow/react";
import { ReactElement, memo, useCallback } from "react";

import { usePickCardMutation } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type VotingCardNodeData = {
  card: { value: string };
  userId: string;
  roomId: string;
  isSelectable: boolean;
  isSelected?: boolean;
};

type VotingCardNodeType = Node<VotingCardNodeData, "votingCard">;

export const VotingCardNode = memo(
  ({ data, selected }: NodeProps<VotingCardNodeType>): ReactElement => {
    const { card, userId, roomId, isSelectable } = data;
    const { toast } = useToast();

    const [pickCardMutation] = usePickCardMutation({
      onError(error) {
        toast({
          title: "Error",
          description: `Pick card: ${error.message}`,
          variant: "destructive",
        });
      },
    });

    const handleClick = useCallback(() => {
      if (isSelectable && userId) {
        pickCardMutation({
          variables: {
            userId,
            roomId,
            card: card.value,
          },
        });
      }
    }, [isSelectable, userId, roomId, card.value, pickCardMutation]);

    return (
      <div
        role="button"
        tabIndex={isSelectable ? 0 : -1}
        aria-label={`Vote ${card.value}`}
        aria-pressed={selected}
        className={cn(
          "cursor-pointer transition-all duration-200 select-none",
          selected && "transform -translate-y-4 scale-110",
          !isSelectable && "opacity-50 cursor-not-allowed",
        )}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div
          className={cn(
            "h-20 min-w-[52px] text-xl py-6 px-3 border-2 leading-normal rounded-md",
            "flex items-center justify-center font-semibold",
            "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
            selected
              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100",
            !isSelectable && "hover:bg-white dark:hover:bg-gray-800",
          )}
        >
          {card.value}
        </div>
      </div>
    );
  },
);

VotingCardNode.displayName = "VotingCardNode";
