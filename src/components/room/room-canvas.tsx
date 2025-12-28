"use client";

import {
  ReactFlow,
  Edge,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode,
} from "@xyflow/react";
import { ReactElement, useCallback, useEffect, useState, useMemo } from "react";
import "@xyflow/react/dist/style.css";
import { debounce } from "lodash";
import type { NodeChange } from "@xyflow/react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth/auth-provider";
import { CanvasNavigation } from "./canvas-navigation";
import { useCanvasNodes } from "./hooks/useCanvasNodes";
import { Id } from "@/convex/_generated/dataModel";
import {
  PlayerNode,
  ResultsNode,
  StoryNode,
  SessionNode,
  TimerNode,
  VotingCardNode,
} from "./nodes";
import type { CustomNodeType } from "./types";
import type { RoomWithRelatedData, SanitizedVote } from "@/convex/model/rooms";

interface RoomCanvasProps {
  roomData: RoomWithRelatedData;
  isDemoMode?: boolean;
}

// Define node types outside component to prevent re-renders
const nodeTypes: NodeTypes = {
  player: PlayerNode,
  story: StoryNode,
  session: SessionNode,
  votingCard: VotingCardNode,
  results: ResultsNode,
  timer: TimerNode,
} as const;

function RoomCanvasInner({ roomData, isDemoMode = false }: RoomCanvasProps): ReactElement {
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  // Convex mutations
  const showCards = useMutation(api.rooms.showCards);
  const resetGame = useMutation(api.rooms.resetGame);
  const pickCard = useMutation(api.votes.pickCard);
  const updateNodePosition = useMutation(api.canvas.updateNodePosition);
  const toggleAutoComplete = useMutation(api.rooms.toggleAutoComplete);
  const cancelAutoRevealCountdown = useMutation(api.rooms.cancelAutoRevealCountdown);
  const executeAutoReveal = useMutation(api.rooms.executeAutoReveal);

  const handleRevealCards = useCallback(async () => {
    if (isDemoMode || !roomData) return;
    try {
      await showCards({ roomId: roomData.room._id });
    } catch (error) {
      console.error("Failed to show cards:", error);
    }
  }, [isDemoMode, showCards, roomData]);

  const handleResetGame = useCallback(async () => {
    if (isDemoMode || !roomData) return;
    try {
      await resetGame({ roomId: roomData.room._id });
    } catch (error) {
      console.error("Failed to reset game:", error);
    }
  }, [isDemoMode, resetGame, roomData]);

  const handleToggleAutoComplete = useCallback(async () => {
    if (isDemoMode || !roomData) return;
    try {
      await toggleAutoComplete({ roomId: roomData.room._id });
    } catch (error) {
      console.error("Failed to toggle auto-complete:", error);
    }
  }, [isDemoMode, toggleAutoComplete, roomData]);

  const handleCancelAutoReveal = useCallback(async () => {
    if (isDemoMode || !roomData) return;
    try {
      await cancelAutoRevealCountdown({ roomId: roomData.room._id });
    } catch (error) {
      console.error("Failed to cancel auto-reveal:", error);
    }
  }, [isDemoMode, cancelAutoRevealCountdown, roomData]);

  const handleExecuteAutoReveal = useCallback(async () => {
    if (isDemoMode || !roomData) return;
    try {
      await executeAutoReveal({ roomId: roomData.room._id });
    } catch (error) {
      console.error("Failed to execute auto-reveal:", error);
    }
  }, [isDemoMode, executeAutoReveal, roomData]);

  // Track selected cards locally (server doesn't send card value until reveal)
  const [selectedCardValue, setSelectedCardValue] = useState<string | null>(
    null
  );

  // Reset selected card when game is reset
  useEffect(() => {
    if (!roomData || !user) return;

    const userVote = roomData.votes.find(
      (v: SanitizedVote) => v.userId === user.id
    );

    // Sync local selection state with server state - intentional state sync pattern
    if (!userVote || !userVote.hasVoted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional sync with props
      setSelectedCardValue(null);
    } else if (roomData.room.isGameOver && userVote.cardLabel) {
      setSelectedCardValue(userVote.cardLabel);
    }
  }, [user, roomData]);

  // Handle card selection
  const handleCardSelect = useCallback(
    async (cardValue: string) => {
      if (isDemoMode || !user || !roomData) return;

      setSelectedCardValue(cardValue);

      try {
        await pickCard({
          roomId: roomData.room._id,
          userId: user.id,
          cardLabel: cardValue,
          cardValue: parseInt(cardValue) || 0,
        });
      } catch (error) {
        console.error("Failed to pick card:", error);
        setSelectedCardValue(null);
      }
    },
    [isDemoMode, pickCard, user, roomData]
  );

  // Get room ID
  const roomId = roomData?.room._id as Id<"rooms">;

  // Use the canvas nodes hook to get persisted nodes
  const { nodes: layoutNodes, edges: layoutEdges } = useCanvasNodes({
    roomId,
    roomData,
    currentUserId: user?.id,
    selectedCardValue,
    onRevealCards: handleRevealCards,
    onResetGame: handleResetGame,
    onCardSelect: handleCardSelect,
    onToggleAutoComplete: handleToggleAutoComplete,
    onCancelAutoReveal: handleCancelAutoReveal,
    onExecuteAutoReveal: handleExecuteAutoReveal,
  });

  // Update nodes and edges when layout changes
  useEffect(() => {
    setNodes(layoutNodes);
  }, [layoutNodes, setNodes]);

  useEffect(() => {
    setEdges(layoutEdges);
  }, [layoutEdges, setEdges]);

  // Debounced position update to prevent database overload
  const debouncedPositionUpdate = useMemo(
    () =>
      debounce((nodeId: string, position: { x: number; y: number }) => {
        if (!user || !roomId) return;

        updateNodePosition({
          roomId,
          nodeId,
          position,
          userId: user.id,
        }).catch((error) => {
          console.error("Failed to update node position:", error);
        });
      }, 100),
    [roomId, user, updateNodePosition]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedPositionUpdate.cancel();
    };
  }, [debouncedPositionUpdate]);

  // Handle node position changes
  const handleNodesChange = useCallback(
    (changes: NodeChange<CustomNodeType>[]) => {
      // Call the original handler to update local state
      onNodesChange(changes);

      // Send position updates to database
      changes.forEach((change) => {
        if (change.type === "position" && change.position && !change.dragging) {
          debouncedPositionUpdate(change.id, change.position);
        }
      });
    },
    [onNodesChange, debouncedPositionUpdate]
  );

  // Handle connection between nodes - prevent manual connections
  const onConnect = useCallback(() => {
    // Manual connections are not allowed in this application
    return;
  }, []);

  // Fit view when users change with debounce
  useEffect(() => {
    if (!roomData?.users) return;

    const timeoutId = setTimeout(() => {
      fitView({
        padding: 0.1,
        duration: 800,
        maxZoom: 1.2,
        minZoom: 0.6,
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [roomData?.users, fitView]);

  if (!roomData || (!user && !isDemoMode)) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {!isDemoMode && <CanvasNavigation roomData={roomData} />}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isDemoMode ? undefined : handleNodesChange}
        onEdgesChange={isDemoMode ? undefined : onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 50, zoom: 0.75 }}
        nodesDraggable={!isDemoMode}
        nodesConnectable={false}
        elementsSelectable={!isDemoMode}
        snapToGrid
        snapGrid={[25, 25]}
        preventScrolling={false}
        attributionPosition="bottom-right"
        panOnScroll
        selectionOnDrag={!isDemoMode}
        panOnDrag={[1, 2]}
        translateExtent={[
          [-2000, -2000],
          [2000, 2000],
        ]}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="*:stroke-gray-300 dark:*:stroke-gray-700"
        />
      </ReactFlow>
    </div>
  );
}

export function RoomCanvas(props: RoomCanvasProps): ReactElement {
  return (
    <ReactFlowProvider>
      <RoomCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
