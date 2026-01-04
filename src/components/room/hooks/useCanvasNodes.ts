"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Edge } from "@xyflow/react";
import { useMemo } from "react";
import type { CustomNodeType } from "../types";
import type { RoomWithRelatedData, SanitizedVote } from "@/convex/model/rooms";
import type { Doc } from "@/convex/_generated/dataModel";

interface UseCanvasNodesProps {
  roomId: Id<"rooms">;
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

interface UseCanvasNodesReturn {
  nodes: CustomNodeType[];
  edges: Edge[];
}

export function useCanvasNodes({
  roomId,
  roomData,
  currentUserId,
  selectedCardValue,
  onRevealCards,
  onResetGame,
  onCardSelect,
  onToggleAutoComplete,
  onCancelAutoReveal,
  onExecuteAutoReveal,
}: UseCanvasNodesProps): UseCanvasNodesReturn {
  // Query canvas nodes from Convex
  const canvasNodes = useQuery(api.canvas.getCanvasNodes, { roomId });

  const nodes = useMemo(() => {
    if (!canvasNodes || !roomData) return [];

    const { room, users, votes } = roomData;
    const allNodes: CustomNodeType[] = [];

    // Process each canvas node
    canvasNodes.forEach((node) => {
      if (node.type === "player") {
        const userId = node.data.userId;
        const user = users.find((u: Doc<"users">) => u._id === userId);
        if (!user) return;

        const userVote = votes.find((v: SanitizedVote) => v.userId === userId);

        const playerNode: CustomNodeType = {
          id: node.nodeId,
          type: "player",
          position: node.position,
          data: {
            user,
            isCurrentUser: userId === currentUserId,
            isCardPicked: userVote?.hasVoted || false,
            card: room.isGameOver ? userVote?.cardLabel || null : null,
            isGameOver: room.isGameOver,
          },
          draggable: !node.isLocked,
        };
        allNodes.push(playerNode);
      } else if (node.type === "timer") {
        const timerNode: CustomNodeType = {
          id: node.nodeId,
          type: "timer",
          position: node.position,
          data: {
            ...node.data,
            roomId,
            userId: currentUserId,
            nodeId: node.nodeId,
          },
          draggable: !node.isLocked,
        };
        allNodes.push(timerNode);
      } else if (node.type === "session") {
        const sessionNode: CustomNodeType = {
          id: node.nodeId,
          type: "session",
          position: node.position,
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
          draggable: !node.isLocked,
        };
        allNodes.push(sessionNode);
      } else if (node.type === "votingCard") {
        // Only show voting cards for current user
        if (node.data.userId === currentUserId) {
          const votingCardNode: CustomNodeType = {
            id: node.nodeId,
            type: "votingCard",
            position: node.position,
            data: {
              ...node.data,
              roomId,
              isSelectable: !room.isGameOver,
              isSelected: node.data.card.value === selectedCardValue,
              onCardSelect,
            },
            selected: node.data.card.value === selectedCardValue,
            draggable: false,
          };
          allNodes.push(votingCardNode);
        }
      } else if (node.type === "results" && room.isGameOver) {
        const resultsNode: CustomNodeType = {
          id: node.nodeId,
          type: "results",
          position: node.position,
          data: {
            votes: votes.filter((v: SanitizedVote) => v.hasVoted),
            users: users,
          },
          draggable: !node.isLocked,
        };
        allNodes.push(resultsNode);
      }
    });

    return allNodes;
  }, [canvasNodes, roomData, currentUserId, selectedCardValue, onRevealCards, onResetGame, onCardSelect, onToggleAutoComplete, onCancelAutoReveal, onExecuteAutoReveal, roomId]);

  const edges = useMemo(() => {
    if (!canvasNodes || !roomData) return [];

    const { room, users } = roomData;
    const allEdges: Edge[] = [];

    // Session to Players edges (subtle, consistent with timer edge)
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
          stroke: "#64748b",
          strokeWidth: 2,
          strokeOpacity: 0.6,
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
  }, [canvasNodes, roomData]);

  return { nodes, edges };
}