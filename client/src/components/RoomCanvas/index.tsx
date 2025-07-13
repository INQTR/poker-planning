import {
  ReactFlow,
  Node,
  Edge,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode,
  Panel,
} from "@xyflow/react";
import { ReactElement, useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";

import { useShowCardsMutation, useResetGameMutation } from "@/api";
import { useTheme, CanvasNavigation } from "@/components";
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
  const { theme } = useTheme();

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

  // Track selected cards
  const [selectedCardValue, setSelectedCardValue] = useState<string | null>(
    null,
  );

  // Sync selected card with room state
  useEffect(() => {
    const pickedCard = getPickedUserCard(currentUser?.id, room.game.table);
    setSelectedCardValue(pickedCard?.card || null);
  }, [currentUser?.id, room.game.table]);

  // Use the canvas layout hook for optimized node and edge generation
  const { nodes: layoutNodes, edges: layoutEdges } = useCanvasLayout({
    room,
    roomId,
    currentUserId: currentUser?.id,
    selectedCardValue,
    onRevealCards: handleRevealCards,
    onResetGame: handleResetGame,
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

  // Memoize MiniMap style functions for performance
  const miniMapNodeStrokeColor = useCallback((node: Node) => {
    switch (node.type) {
      case "player":
        return "#3b82f6";
      case "story":
        return "#f59e0b";
      case "votingCard":
        return "#8b5cf6";
      case "results":
        return "#10b981";
      default:
        return "#6b7280";
    }
  }, []);

  const miniMapNodeColor = useCallback(
    (node: Node) => {
      // Check if we're in dark mode (either explicitly or through system preference)
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      switch (node.type) {
        case "player":
          return isDark ? "#1e3a8a" : "#dbeafe";
        case "story":
          return isDark ? "#92400e" : "#fef3c7";
        case "votingCard":
          return isDark ? "#5b21b6" : "#ede9fe";
        case "results":
          return isDark ? "#064e3b" : "#d1fae5";
        default:
          return isDark ? "#374151" : "#f3f4f6";
      }
    },
    [theme],
  );

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
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
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
        <Panel position="bottom-left" className="!m-4">
          <MiniMap
            className="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-600 !shadow-lg"
            nodeStrokeColor={miniMapNodeStrokeColor}
            nodeColor={miniMapNodeColor}
            pannable
            zoomable
          />
        </Panel>
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
