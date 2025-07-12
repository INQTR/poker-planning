import { ReloadIcon } from "@radix-ui/react-icons";
import { NodeProps, Node } from "@xyflow/react";
import { ReactElement, memo } from "react";

import { useResetGameMutation, useShowCardsMutation } from "@/api";
import { useModal } from "@/components";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

type ControlsNodeData = {
  roomId: string;
  isCardsPicked: boolean;
  isGameOver: boolean;
};

type ControlsNodeType = Node<ControlsNodeData, "controls">;

export const ControlsNode = memo(
  ({ data }: NodeProps<ControlsNodeType>): ReactElement => {
    const { roomId, isCardsPicked, isGameOver } = data;

    // Confirm before starting a new game.
    const startNewGame = useModal({
      title: "Are you sure you want to start a new game?",
      description: "This will reset the current game.",
      confirmationText: "Start new game",
      cancellationText: "Cancel",
    });

    const [showCardsMutation, { loading: showCardLoading }] =
      useShowCardsMutation({
        onError: (error) => {
          toast.error(`Show cards: ${error.message}`);
        },
      });

    const [resetGameMutation, { loading: resetGameLoading }] =
      useResetGameMutation({
        onError: (error) => {
          toast.error(`Reset game: ${error.message}`);
        },
      });

    function handleShowCards() {
      showCardsMutation({ variables: { roomId } });
    }

    function handleResetGame() {
      startNewGame().then(() => {
        resetGameMutation({ variables: { roomId } });
      });
    }

    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-purple-400 dark:border-purple-600">
        {isCardsPicked ? (
          isGameOver ? (
            <Button
              onClick={handleResetGame}
              disabled={resetGameLoading}
              className="w-36"
              size="lg"
            >
              {resetGameLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Start New Game
            </Button>
          ) : (
            <Button
              onClick={handleShowCards}
              disabled={showCardLoading}
              size="lg"
            >
              {showCardLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reveal cards
            </Button>
          )
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400 px-4">
            <span>Start picking cards to begin!</span>
          </div>
        )}
      </div>
    );
  },
);

ControlsNode.displayName = "ControlsNode";
