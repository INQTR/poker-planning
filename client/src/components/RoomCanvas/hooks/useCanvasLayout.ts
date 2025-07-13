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
const TIMER_X = -500; // Timer in left corner
const TIMER_Y = -250; // Timer at top left corner
const SESSION_Y = -300; // Session box almost at top of screen
const PLAYERS_Y = 200; // Players positioned lower, above voting cards
const PLAYER_SPACING = 200; // Horizontal spacing between players
const VOTING_CARD_Y = 450; // Voting cards almost at bottom of screen
const VOTING_CARD_SPACING = 70; // Space between cards

interface UseCanvasLayoutProps {
  room: Room;
  roomId: string;
  currentUserId?: string;
  selectedCardValue: string | null;
  onRevealCards?: () => void;
  onResetGame?: () => void;
  onCardSelect?: (cardValue: string) => void;
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
  onCardSelect,
}: UseCanvasLayoutProps): UseCanvasLayoutReturn {
  const nodes = useMemo(() => {
    const allNodes: CustomNodeType[] = [];

    // Player nodes in horizontal layout
    if (room.users.length > 0) {
      // Calculate total width needed for all players
      const totalWidth = (room.users.length - 1) * PLAYER_SPACING;
      const startX = CANVAS_CENTER.x - totalWidth / 2;

      room.users.forEach((user, index) => {
        const x = startX + index * PLAYER_SPACING;
        const y = PLAYERS_Y;

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

    // Timer node (left corner)
    const timerNode: TimerNodeType = {
      id: "timer",
      type: "timer",
      position: { x: TIMER_X, y: TIMER_Y },
      data: {
        duration: 0,
        isRunning: false,
      },
    };
    allNodes.push(timerNode);

    // Session node (centered at top)
    // Session node is approximately 280px wide, so offset by half to center
    const sessionNode: SessionNodeType = {
      id: "session-current",
      type: "session",
      position: { x: CANVAS_CENTER.x - 140, y: SESSION_Y },
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

    // Controls are now in the floating navigation bar

    // Voting cards for current user
    if (currentUserId) {
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
              onCardSelect,
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
        position: { x: CANVAS_CENTER.x + 400, y: SESSION_Y + 100 },
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
    room.name,
    room.game.table,
    room.isGameOver,
    room.deck.cards,
    onRevealCards,
    onResetGame,
    onCardSelect,
    currentUserId,
    roomId,
    selectedCardValue,
  ]);

  const edges = useMemo(() => {
    const allEdges: Edge[] = [];

    // Session to Players edges
    room.users.forEach((user) => {
      allEdges.push({
        id: `session-to-player-${user.id}`,
        source: "session-current",
        sourceHandle: "bottom",
        target: `player-${user.id}`,
        targetHandle: "top",
        type: "default",
        animated: false,
        style: {
          stroke: "#3b82f6",
          strokeWidth: 2,
          strokeOpacity: 0.8,
        },
      });
    });

    // Session to Results edge (when game is over)
    if (room.isGameOver) {
      allEdges.push({
        id: "session-to-results",
        source: "session-current",
        target: "results",
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#10b981",
          strokeWidth: 3,
        },
      });
    }

    // Timer to Session edge
    allEdges.push({
      id: "timer-to-session",
      source: "timer",
      sourceHandle: "right",
      target: "session-current",
      targetHandle: "left",
      type: "straight",
      animated: false,
      style: {
        stroke: "#64748b",
        strokeWidth: 2,
        strokeDasharray: "5,5",
        strokeOpacity: 0.6,
      },
    });

    return allEdges;
  }, [room.users, room.isGameOver]);

  return { nodes, edges };
}
