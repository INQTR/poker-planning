import { ReactElement, useEffect, useState } from "react";

import { usePickCardMutation } from "@/api";
import { Card } from "@/components/Card";
import { useAuth } from "@/contexts";
import { useKeyboardControls } from "@/hooks";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { UserCard } from "@/types";
import { getPickedUserCard } from "@/utils";

interface DeckProps {
  roomId: string;
  isGameOver: boolean;
  cards: string[];
  table: UserCard[] | undefined;
}

export function Deck({
  roomId,
  isGameOver,
  cards,
  table,
}: DeckProps): ReactElement {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const { user } = useAuth();
  const { cardsContainerRef } = useKeyboardControls();

  const [pickCardMutation] = usePickCardMutation({
    onError(error) {
      setSelectedCard(null);
      toast.error(`Pick card: ${error.message}`);
    },
  });

  useEffect(() => {
    const pickedCart = getPickedUserCard(user?.id, table);
    if (!pickedCart) {
      setSelectedCard(null);
    }
  }, [table, user?.id]);

  const handleCardClick = (card: string) => () => {
    if (user) {
      pickCardMutation({
        variables: {
          userId: user.id,
          roomId,
          card,
        },
      });

      setSelectedCard(card);
    }
  };

  return (
    <div
      className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between items-end gap-1 sm:gap-2"
      ref={cardsContainerRef}
    >
      {cards.map((card) => {
        const isCardPicked = selectedCard === card;
        return (
          <div
            key={card}
            className={cn(
              "transition-all duration-100 flex-shrink-0",
              isCardPicked ? "mb-4 sm:mb-8" : "mb-0",
            )}
          >
            <Card
              onClick={handleCardClick(card)}
              disabled={isGameOver}
              variant={isCardPicked ? "default" : "outline"}
            >
              {card}
            </Card>
          </div>
        );
      })}
    </div>
  );
}
