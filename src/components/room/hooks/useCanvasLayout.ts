import { Edge } from "@xyflow/react";
import { useMemo } from "react";

import type {
  PlayerNodeType,
  SessionNodeType,
  TimerNodeType,
  VotingCardNodeType,
  ResultsNodeType,
  CustomNodeType,
} from "../types";
import type { RoomWithRelatedData, SanitizedVote } from "@/convex/model/rooms";
import type { Doc, Id } from "@/convex/_generated/dataModel";

// Layout constants for endless canvas
const CANVAS_CENTER = { x: 0, y: 0 };
const TIMER_X = -500; // Timer in left corner
const TIMER_Y = -250; // Timer at top left corner
const SESSION_Y = -300; // Session box almost at top of screen
const PLAYERS_Y = 200; // Players positioned lower, above voting cards
const PLAYER_SPACING = 200; // Horizontal spacing between players
const VOTING_CARD_Y = 450; // Voting cards almost at bottom of screen
const VOTING_CARD_SPACING = 70; // Space between cards

// Default card deck
const DEFAULT_CARDS = ["0", "1", "2", "3", "5", "8", "13", "21", "?"];

interface UseCanvasLayoutProps {
  roomData: RoomWithRelatedData;
  currentUserId?: string;
  selectedCardValue: string | null;
  onRevealCards?: () => void;
  onResetGame?: () => void;
  onCardSelect?: (cardValue: string) => void;
  onToggleAutoComplete?: () => void;
  onCancelAutoReveal?: () => void;
  onExecuteAutoReveal?: () => void;
}

interface UseCanvasLayoutReturn {
  nodes: CustomNodeType[];
  edges: Edge[];
}

export function useCanvasLayout({
  roomData,
  currentUserId,
  selectedCardValue,
  onRevealCards,
  onResetGame,
  onCardSelect,
  onToggleAutoComplete,
  onCancelAutoReveal,
  onExecuteAutoReveal,
}: UseCanvasLayoutProps): UseCanvasLayoutReturn {
  const nodes = useMemo(() => {
    if (!roomData) return [];

    const { room, users, votes } = roomData;
    const allNodes: CustomNodeType[] = [];

    // Player nodes in horizontal layout
    if (users.length > 0) {
      // Calculate total width needed for all players
      const totalWidth = (users.length - 1) * PLAYER_SPACING;
      const startX = CANVAS_CENTER.x - totalWidth / 2;

      users.forEach((user: Doc<"users">, index: number) => {
        const x = startX + index * PLAYER_SPACING;
        const y = PLAYERS_Y;

        const userVote = votes.find((v: SanitizedVote) => v.userId === user._id);

        const playerNode: PlayerNodeType = {
          id: `player-${user._id}`,
          type: "player",
          position: { x, y },
          data: {
            user,
            isCurrentUser: user._id === currentUserId,
            isCardPicked: userVote?.hasVoted || false,
            card: room.isGameOver ? userVote?.cardLabel || null : null,
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
        startedAt: null,
        pausedAt: null,
        elapsedSeconds: 0,
        isRunning: false,
        lastUpdatedBy: null,
        lastAction: null,
        roomId: room._id as Id<"rooms">,
        userId: currentUserId as Id<"users"> | undefined,
        nodeId: "timer",
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
        participantCount: users.length,
        voteCount: votes.filter((v: SanitizedVote) => v.hasVoted).length,
        isVotingComplete: room.isGameOver,
        hasVotes: votes.some((v: SanitizedVote) => v.hasVoted),
        autoCompleteVoting: room.autoCompleteVoting,
        autoRevealCountdownStartedAt: room.autoRevealCountdownStartedAt ?? null,
        onRevealCards,
        onResetGame,
        onToggleAutoComplete,
        onCancelAutoReveal,
        onExecuteAutoReveal,
      },
      draggable: true,
    };
    allNodes.push(sessionNode);

    // Voting cards for current user - always visible
    if (currentUserId) {
      const currentUserIndex = users.findIndex(
        (u: Doc<"users">) => u._id === currentUserId,
      );
      if (currentUserIndex !== -1) {
        // Position cards in a horizontal row at the bottom
        const cards = DEFAULT_CARDS;
        const cardCount = cards.length;
        const totalWidth = (cardCount - 1) * VOTING_CARD_SPACING;
        const startX = CANVAS_CENTER.x - totalWidth / 2;

        cards.forEach((card, index) => {
          const x = startX + index * VOTING_CARD_SPACING;
          const y = VOTING_CARD_Y;

          const votingCardNode: VotingCardNodeType = {
            id: `card-${card}`,
            type: "votingCard",
            position: { x, y },
            data: {
              card: { value: card },
              userId: currentUserId,
              roomId: room._id,
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
          votes: votes.filter((v: SanitizedVote) => v.hasVoted),
          users: users,
        },
      };
      allNodes.push(resultsNode);
    }

    return allNodes;
  }, [
    roomData,
    onRevealCards,
    onResetGame,
    onCardSelect,
    onToggleAutoComplete,
    onCancelAutoReveal,
    onExecuteAutoReveal,
    currentUserId,
    selectedCardValue,
  ]);

  const edges = useMemo(() => {
    if (!roomData) return [];

    const { room, users } = roomData;
    const allEdges: Edge[] = [];

    // Session to Players edges
    users.forEach((user: Doc<"users">) => {
      allEdges.push({
        id: `session-to-player-${user._id}`,
        source: "session-current",
        sourceHandle: "bottom",
        target: `player-${user._id}`,
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
  }, [roomData]);

  return { nodes, edges };
}