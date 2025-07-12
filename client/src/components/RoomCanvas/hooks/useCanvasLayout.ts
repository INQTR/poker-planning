import { Edge } from "@xyflow/react";
import { useMemo } from "react";

import { Room } from "@/types";
import { getPickedUserCard } from "@/utils";

import type {
  PlayerNodeType,
  StoryNodeType,
  TimerNodeType,
  ControlsNodeType,
  VotingCardNodeType,
  ResultsNodeType,
  CustomNodeType,
} from "../types";

// Layout constants
const CANVAS_CENTER = { x: 400, y: 300 };
const PLAYER_CIRCLE_RADIUS = 200;
const VOTING_CARD_START_X = 200;
const VOTING_CARD_Y = 450;
const VOTING_CARD_SPACING = 70;

interface UseCanvasLayoutProps {
  room: Room;
  roomId: string;
  currentUserId?: string;
  selectedCardValue: string | null;
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

    // Story node (center)
    const storyNode: StoryNodeType = {
      id: "story-current",
      type: "story",
      position: { x: CANVAS_CENTER.x - 100, y: CANVAS_CENTER.y - 50 },
      data: {
        title: "Current Story",
        description: "Ready to estimate",
        storyId: "current",
      },
      draggable: false,
    };
    allNodes.push(storyNode);

    // Timer node
    const timerNode: TimerNodeType = {
      id: "timer",
      type: "timer",
      position: { x: 50, y: 50 },
      data: {
        duration: 0,
        isRunning: false,
      },
    };
    allNodes.push(timerNode);

    // Controls node
    const controlsNode: ControlsNodeType = {
      id: "controls",
      type: "controls",
      position: { x: CANVAS_CENTER.x - 100, y: CANVAS_CENTER.y + 50 },
      data: {
        roomId,
        isCardsPicked: room.game.table.length > 0,
        isGameOver: room.isGameOver,
      },
      draggable: false,
    };
    allNodes.push(controlsNode);

    // Voting cards for current user
    if (currentUserId && !room.isGameOver) {
      const currentUserIndex = room.users.findIndex(
        (u) => u.id === currentUserId,
      );
      if (currentUserIndex !== -1) {
        room.deck.cards.forEach((card, index) => {
          const votingCardNode: VotingCardNodeType = {
            id: `card-${card}`,
            type: "votingCard",
            position: {
              x: VOTING_CARD_START_X + index * VOTING_CARD_SPACING,
              y: VOTING_CARD_Y,
            },
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
        position: { x: 600, y: 200 },
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
  ]);

  const edges = useMemo(() => {
    return room.game.table.map((vote) => ({
      id: `vote-${vote.userId}`,
      source: `player-${vote.userId}`,
      target: "story-current",
      type: "smoothstep",
      animated: true,
      className: "!stroke-green-500 dark:!stroke-green-400",
      style: { strokeWidth: 2 },
    }));
  }, [room.game.table]);

  return { nodes, edges };
}
