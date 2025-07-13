import { Edge } from "@xyflow/react";
import { useMemo } from "react";

import { Room } from "@/types";
import { getPickedUserCard } from "@/utils";

import type {
  PlayerNodeType,
  SessionNodeType,
  TimerNodeType,
  VotingCardNodeType,
  ResultsNodeType,
  CustomNodeType,
} from "../types";

// Layout constants for endless canvas
const CANVAS_CENTER = { x: 0, y: 0 };
const PLAYER_CIRCLE_RADIUS = 220;
const VOTING_CARD_Y = 400; // Fixed Y position at bottom
const VOTING_CARD_SPACING = 70; // Space between cards

interface UseCanvasLayoutProps {
  room: Room;
  roomId: string;
  currentUserId?: string;
  selectedCardValue: string | null;
  onRevealCards?: () => void;
  onResetGame?: () => void;
}

interface UseCanvasLayoutReturn {
  nodes: CustomNodeType[];
  edges: Edge[];
}

export function useCanvasLayout({
  room,
  roomId,
  currentUserId,
  selectedCardValue,
  onRevealCards,
  onResetGame,
}: UseCanvasLayoutProps): UseCanvasLayoutReturn {
  const nodes = useMemo(() => {
    const allNodes: CustomNodeType[] = [];

    // Player nodes in circle layout
    if (room.users.length > 0) {
      room.users.forEach((user, index) => {
        const angle = (index * 2 * Math.PI) / room.users.length;
        const x = CANVAS_CENTER.x + PLAYER_CIRCLE_RADIUS * Math.cos(angle);
        const y = CANVAS_CENTER.y + PLAYER_CIRCLE_RADIUS * Math.sin(angle);

        const pickedCard = getPickedUserCard(user.id, room.game.table);

        const playerNode: PlayerNodeType = {
          id: `player-${user.id}`,
          type: "player",
          position: { x, y },
          data: {
            user,
            isCurrentUser: user.id === currentUserId,
            isCardPicked: !!pickedCard,
            card: pickedCard?.card || null,
          },
        };

        allNodes.push(playerNode);
      });
    }

    // Session node (center)
    const sessionNode: SessionNodeType = {
      id: "session-current",
      type: "session",
      position: { x: CANVAS_CENTER.x - 140, y: CANVAS_CENTER.y - 80 },
      data: {
        sessionName: room.name || "Planning Session",
        participantCount: room.users.length,
        voteCount: room.game.table.length,
        isVotingComplete: room.isGameOver,
        hasVotes: room.game.table.length > 0,
        onRevealCards,
        onResetGame,
      },
      draggable: true,
    };
    allNodes.push(sessionNode);

    // Timer node
    const timerNode: TimerNodeType = {
      id: "timer",
      type: "timer",
      position: { x: CANVAS_CENTER.x - 40, y: CANVAS_CENTER.y - 200 },
      data: {
        duration: 0,
        isRunning: false,
      },
    };
    allNodes.push(timerNode);

    // Controls are now in the floating navigation bar

    // Voting cards for current user
    if (currentUserId && !room.isGameOver) {
      const currentUserIndex = room.users.findIndex(
        (u) => u.id === currentUserId,
      );
      if (currentUserIndex !== -1) {
        // Position cards in a horizontal row at the bottom
        const cardCount = room.deck.cards.length;
        const totalWidth = (cardCount - 1) * VOTING_CARD_SPACING;
        const startX = CANVAS_CENTER.x - totalWidth / 2;
        
        room.deck.cards.forEach((card, index) => {
          const x = startX + index * VOTING_CARD_SPACING;
          const y = VOTING_CARD_Y;
          
          const votingCardNode: VotingCardNodeType = {
            id: `card-${card}`,
            type: "votingCard",
            position: { x, y },
            data: {
              card: { value: card },
              userId: currentUserId,
              roomId,
              isSelectable: !room.isGameOver,
              isSelected: card === selectedCardValue,
            },
            selected: card === selectedCardValue,
            draggable: false,
          };
          allNodes.push(votingCardNode);
        });
      }
    }

    // Results node (when game is over)
    if (room.isGameOver) {
      const resultsNode: ResultsNodeType = {
        id: "results",
        type: "results",
        position: { x: CANVAS_CENTER.x + 300, y: CANVAS_CENTER.y },
        data: {
          votes: room.game.table,
          users: room.users,
        },
      };
      allNodes.push(resultsNode);
    }

    return allNodes;
  }, [
    room.users,
    room.game.table,
    room.deck.cards,
    room.isGameOver,
    roomId,
    currentUserId,
    selectedCardValue,
    onRevealCards,
    onResetGame,
  ]);

  const edges = useMemo(() => {
    return room.game.table.map((vote) => ({
      id: `vote-${vote.userId}`,
      source: `player-${vote.userId}`,
      target: "story-current",
      type: "smoothstep",
      animated: true,
      className: "stroke-green-500! dark:stroke-green-400!",
      style: { strokeWidth: 2 },
    }));
  }, [room.game.table]);

  return { nodes, edges };
}
