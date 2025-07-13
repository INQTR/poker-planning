import {
  ReactFlow,
  Edge,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode,
} from "@xyflow/react";
import { ReactElement, useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";

import { useShowCardsMutation, useResetGameMutation } from "@/api";
import { CanvasNavigation } from "@/components";
import { useAuth } from "@/contexts";
import { Room as RoomType } from "@/types";
import { getPickedUserCard } from "@/utils";

import { useCanvasLayout } from "./hooks/useCanvasLayout";
import {
  PlayerNode,
  ResultsNode,
  StoryNode,
  SessionNode,
  TimerNode,
  VotingCardNode,
} from "./nodes";
import type { CustomNodeType } from "./types";

interface RoomCanvasProps {
  room: RoomType;
  roomId: string;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
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

function RoomCanvasInner({
  room,
  roomId,
  onToggleFullscreen,
  isFullscreen,
}: RoomCanvasProps): ReactElement {
  const { user: currentUser } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  // GraphQL mutations
  const [showCardsMutation] = useShowCardsMutation();
  const [resetGameMutation] = useResetGameMutation();

  const handleRevealCards = useCallback(() => {
    showCardsMutation({
      variables: { roomId },
    });
  }, [showCardsMutation, roomId]);

  const handleResetGame = useCallback(() => {
    resetGameMutation({
      variables: { roomId },
    });
  }, [resetGameMutation, roomId]);

  // Track selected cards locally (server doesn't send card value until reveal)
  const [selectedCardValue, setSelectedCardValue] = useState<string | null>(
    null,
  );

  // Reset selected card when game is reset
  useEffect(() => {
    // Check if user has picked a card
    const pickedCard = getPickedUserCard(currentUser?.id, room.game.table);

    // If no card is picked on server (game was reset), clear local selection
    if (!pickedCard) {
      setSelectedCardValue(null);
    }
    // If game is revealed and we have a card value from server, sync it
    else if (room.isGameOver && pickedCard.card) {
      setSelectedCardValue(pickedCard.card);
    }
  }, [currentUser?.id, room.game.table, room.isGameOver]);

  // Handle card selection
  const handleCardSelect = useCallback((cardValue: string) => {
    setSelectedCardValue(cardValue);
  }, []);

  // Use the canvas layout hook for optimized node and edge generation
  const { nodes: layoutNodes, edges: layoutEdges } = useCanvasLayout({
    room,
    roomId,
    currentUserId: currentUser?.id,
    selectedCardValue,
    onRevealCards: handleRevealCards,
    onResetGame: handleResetGame,
    onCardSelect: handleCardSelect,
  });

  // Update nodes and edges when layout changes
  useEffect(() => {
    setNodes(layoutNodes);
  }, [layoutNodes, setNodes]);

  useEffect(() => {
    setEdges(layoutEdges);
  }, [layoutEdges, setEdges]);

  // Handle connection between nodes - prevent manual connections
  const onConnect = useCallback((_params: Connection) => {
    // Manual connections are not allowed in this application
    return;
  }, []);

  // Fit view when users change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fitView({
        padding: 0.1,
        duration: 800,
        maxZoom: 1.2,
        minZoom: 0.6,
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [room.users.length, fitView]);

  return (
    <div className="w-full h-full relative">
      <CanvasNavigation
        room={room}
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 50, zoom: 0.75 }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        snapToGrid
        snapGrid={[25, 25]}
        preventScrolling={false}
        attributionPosition="bottom-right"
        panOnScroll
        selectionOnDrag
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
