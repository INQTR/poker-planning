import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { ReactElement, useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";

import { useAuth } from "@/contexts";
import { Room as RoomType, User } from "@/types";
import { getPickedUserCard } from "@/utils";

import { ControlsNode } from "./nodes/ControlsNode";
import { PlayerNode } from "./nodes/PlayerNode";
import { ResultsNode } from "./nodes/ResultsNode";
import { StoryNode } from "./nodes/StoryNode";
import { TimerNode } from "./nodes/TimerNode";
import { VotingCardNode } from "./nodes/VotingCardNode";

// Define node data types
type PlayerNodeData = {
  user: User;
  isCurrentUser: boolean;
  isCardPicked: boolean;
  card: string | null;
};

type StoryNodeData = {
  title: string;
  description: string;
  storyId: string;
};

type TimerNodeData = {
  duration: number;
  isRunning: boolean;
};

type ControlsNodeData = {
  roomId: string;
  isCardsPicked: boolean;
  isGameOver: boolean;
};

type VotingCardNodeData = {
  card: { value: string };
  userId: string;
  roomId: string;
  isSelectable: boolean;
  isSelected: boolean;
};

type ResultsNodeData = {
  votes: RoomType["game"]["table"];
  users: User[];
};

// Define specific node types
type PlayerNodeType = Node<PlayerNodeData, "player">;
type StoryNodeType = Node<StoryNodeData, "story">;
type TimerNodeType = Node<TimerNodeData, "timer">;
type ControlsNodeType = Node<ControlsNodeData, "controls">;
type VotingCardNodeType = Node<VotingCardNodeData, "votingCard">;
type ResultsNodeType = Node<ResultsNodeData, "results">;

// Union type for all custom nodes
type CustomNodeType =
  | PlayerNodeType
  | StoryNodeType
  | TimerNodeType
  | ControlsNodeType
  | VotingCardNodeType
  | ResultsNodeType;

interface RoomCanvasProps {
  room: RoomType;
  roomId: string;
}

const nodeTypes: NodeTypes = {
  player: PlayerNode,
  story: StoryNode,
  votingCard: VotingCardNode,
  results: ResultsNode,
  timer: TimerNode,
  controls: ControlsNode,
};

function RoomCanvasInner({ room, roomId }: RoomCanvasProps): ReactElement {
  const { user: currentUser } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  // Initialize player nodes in a circle layout
  const initializePlayerNodes = useCallback(
    (users: User[]): PlayerNodeType[] => {
      const centerX = 400;
      const centerY = 300;
      const radius = 200;

      return users.map((user, index) => {
        const angle = (index * 2 * Math.PI) / users.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        return {
          id: `player-${user.id}`,
          type: "player" as const,
          position: { x, y },
          data: {
            user,
            isCurrentUser: user.id === currentUser?.id,
            isCardPicked: false,
            card: null,
          },
        };
      });
    },
    [currentUser],
  );

  // Initialize story node in the center
  const initializeStoryNode = useCallback((): StoryNodeType => {
    return {
      id: "story-current",
      type: "story" as const,
      position: { x: 300, y: 250 },
      data: {
        title: "Current Story",
        description: "Ready to estimate",
        storyId: "current",
      },
    };
  }, []);

  // Initialize timer node
  const initializeTimerNode = useCallback((): TimerNodeType => {
    return {
      id: "timer",
      type: "timer" as const,
      position: { x: 50, y: 50 },
      data: {
        duration: 0,
        isRunning: false,
      },
    };
  }, []);

  // Initialize controls node
  const initializeControlsNode = useCallback((): ControlsNodeType => {
    return {
      id: "controls",
      type: "controls" as const,
      position: { x: 300, y: 350 },
      data: {
        roomId,
        isCardsPicked: room.game.table.length > 0,
        isGameOver: room.isGameOver,
      },
    };
  }, [roomId, room.game.table.length, room.isGameOver]);

  // Initialize voting card nodes for each player
  const initializeVotingCardNodes = useCallback(
    (users: User[], selectedValue: string | null): VotingCardNodeType[] => {
      if (!currentUser) return [];

      const currentUserIndex = users.findIndex((u) => u.id === currentUser.id);
      if (currentUserIndex === -1) return [];

      const cardY = 450;
      const cardSpacing = 70;
      const startX = 200;

      return room.deck.cards.map((card, index) => ({
        id: `card-${card}`,
        type: "votingCard" as const,
        position: {
          x: startX + index * cardSpacing,
          y: cardY,
        },
        data: {
          card: { value: card },
          userId: currentUser.id,
          roomId,
          isSelectable: !room.isGameOver,
          isSelected: card === selectedValue,
        },
        selected: card === selectedValue,
      }));
    },
    [currentUser, room.deck.cards, room.isGameOver, roomId],
  );

  // Initialize results node when game is over
  const initializeResultsNode = useCallback((): ResultsNodeType | null => {
    if (!room.isGameOver) return null;

    return {
      id: "results",
      type: "results" as const,
      position: { x: 600, y: 200 },
      data: {
        votes: room.game.table,
        users: room.users,
      },
    };
  }, [room]);

  // Track selected cards
  const [selectedCardValue, setSelectedCardValue] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const pickedCard = getPickedUserCard(currentUser?.id, room.game.table);
    setSelectedCardValue(pickedCard?.card || null);
  }, [currentUser?.id, room.game.table]);

  // Update nodes based on room state
  useEffect(() => {
    const playerNodes = initializePlayerNodes(room.users);
    const storyNode = initializeStoryNode();
    const timerNode = initializeTimerNode();
    const controlsNode = initializeControlsNode();
    const votingCardNodes = initializeVotingCardNodes(
      room.users,
      selectedCardValue,
    );
    const resultsNode = initializeResultsNode();

    const allNodes: CustomNodeType[] = [
      ...playerNodes,
      storyNode,
      timerNode,
      controlsNode,
      ...votingCardNodes,
    ];

    if (resultsNode) {
      allNodes.push(resultsNode);
    }

    setNodes(allNodes);
  }, [
    room.users,
    room.isGameOver,
    selectedCardValue,
    initializePlayerNodes,
    initializeStoryNode,
    initializeTimerNode,
    initializeControlsNode,
    initializeVotingCardNodes,
    initializeResultsNode,
    setNodes,
  ]);

  // Update player nodes with picked card status
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "player") {
          const userId = node.data.user.id;
          const pickedCard = getPickedUserCard(userId, room.game.table);

          return {
            ...node,
            data: {
              ...node.data,
              isCardPicked: !!pickedCard,
              card: pickedCard?.card || null,
            },
          };
        }
        return node;
      }),
    );
  }, [room.game.table, setNodes]);

  // Create edges between players and story when they have voted
  useEffect(() => {
    const voteEdges: Edge[] = room.game.table.map((vote) => ({
      id: `vote-${vote.userId}`,
      source: `player-${vote.userId}`,
      target: "story-current",
      type: "smoothstep",
      animated: true,
      className: "!stroke-green-500 dark:!stroke-green-400",
      style: { strokeWidth: 2 },
    }));

    setEdges(voteEdges);
  }, [room.game.table, setEdges]);

  // Handle connection between nodes
  const onConnect = useCallback((_params: Connection) => {
    // For now, we don't allow manual connections
    return;
  }, []);

  // Fit view when users change
  useEffect(() => {
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
  }, [room.users.length, fitView]);

  return (
    <div className="w-full h-[calc(100vh-120px)] bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          className="[&>*]:stroke-gray-300 dark:[&>*]:stroke-gray-700"
        />
        <Controls className="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-600 !shadow-lg [&>button]:!bg-white dark:[&>button]:!bg-gray-800 [&>button]:!border-gray-300 dark:[&>button]:!border-gray-600 [&>button]:hover:!bg-gray-50 dark:[&>button]:hover:!bg-gray-700 [&>button_svg]:!fill-gray-700 dark:[&>button_svg]:!fill-gray-300" />
        <MiniMap
          className="!bg-gray-100 dark:!bg-gray-800 !border-gray-300 dark:!border-gray-600"
          nodeStrokeColor={(n) => {
            if (n.type === "player") return "#3b82f6";
            if (n.type === "story") return "#f59e0b";
            if (n.type === "votingCard") return "#8b5cf6";
            if (n.type === "results") return "#10b981";
            return "#6b7280";
          }}
          nodeColor={(n) => {
            const isDark = document.documentElement.classList.contains("dark");
            if (n.type === "player") return isDark ? "#1e3a8a" : "#dbeafe";
            if (n.type === "story") return isDark ? "#92400e" : "#fef3c7";
            if (n.type === "votingCard") return isDark ? "#5b21b6" : "#ede9fe";
            if (n.type === "results") return isDark ? "#064e3b" : "#d1fae5";
            return isDark ? "#374151" : "#f3f4f6";
          }}
          pannable
          zoomable
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
