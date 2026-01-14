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
import type { NodeChange, EdgeChange } from "@xyflow/react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth/auth-provider";
import { CanvasNavigation } from "./canvas-navigation";
import { useCanvasNodes } from "./hooks/useCanvasNodes";
import { NodePickerToolbar } from "./node-picker-toolbar";
import { Id } from "@/convex/_generated/dataModel";
import {
  NoteNode,
  PlayerNode,
  ResultsNode,
  StoryNode,
  SessionNode,
  TimerNode,
  VotingCardNode,
} from "./nodes";
import type { CustomNodeType, PlayerNodeData } from "./types";
import type { RoomWithRelatedData, SanitizedVote } from "@/convex/model/rooms";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RoomCanvasProps {
  roomData: RoomWithRelatedData;
  isDemoMode?: boolean;
}

// Define node types outside component to prevent re-renders
const nodeTypes: NodeTypes = {
  note: NoteNode,
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
  const updateNoteContentMutation = useMutation(api.canvas.updateNoteContent);
  const createNoteMutation = useMutation(api.canvas.createNote);
  const deleteNoteMutation = useMutation(api.canvas.deleteNote);
  const removeUser = useMutation(api.users.remove);

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

  // Issues panel state - lifted up so it can be passed to SessionNode
  const [isIssuesPanelOpen, setIsIssuesPanelOpen] = useState(false);

  // Delete note confirmation state
  const [pendingDeleteNodeId, setPendingDeleteNodeId] = useState<string | null>(null);

  // Delete player confirmation state
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<{id: Id<"users">, name: string} | null>(null);

  const handleOpenIssuesPanel = useCallback(() => {
    setIsIssuesPanelOpen(true);
  }, []);

  // Handle note content updates
  const handleUpdateNoteContent = useCallback(
    async (nodeId: string, content: string) => {
      if (isDemoMode || !user || !roomData) return;
      try {
        await updateNoteContentMutation({
          roomId: roomData.room._id,
          nodeId,
          content,
          userId: user.id,
        });
      } catch (error) {
        console.error("Failed to update note content:", error);
      }
    },
    [isDemoMode, updateNoteContentMutation, user, roomData]
  );

  // Handle creating a new note for an issue
  const handleCreateNote = useCallback(
    async (issueId: Id<"issues">) => {
      if (isDemoMode || !user || !roomData) return;
      try {
        await createNoteMutation({
          roomId: roomData.room._id,
          issueId,
          userId: user.id,
        });
      } catch (error) {
        console.error("Failed to create note:", error);
      }
    },
    [isDemoMode, createNoteMutation, user, roomData]
  );

  // Handle note deletion request
  const handleDeleteNote = useCallback(
    (nodeId: string, hasContent: boolean) => {
      if (isDemoMode || !roomData || !user) return;
      if (hasContent) {
        // Show confirmation dialog for notes with content
        setPendingDeleteNodeId(nodeId);
      } else {
        // Delete immediately for empty notes
        deleteNoteMutation({
          roomId: roomData.room._id,
          nodeId,
          userId: user.id,
        }).catch((error) => {
          console.error("Failed to delete note:", error);
        });
      }
    },
    [isDemoMode, deleteNoteMutation, roomData, user]
  );

  // Handle confirmed deletion
  const handleConfirmDelete = useCallback(() => {
    if (!pendingDeleteNodeId || !roomData || !user) return;
    deleteNoteMutation({
      roomId: roomData.room._id,
      nodeId: pendingDeleteNodeId,
      userId: user.id,
    }).catch((error) => {
      console.error("Failed to delete note:", error);
    });
    setPendingDeleteNodeId(null);
  }, [pendingDeleteNodeId, deleteNoteMutation, roomData, user]);

  // Handle player deletion request (shows confirmation)
  const handleDeletePlayer = useCallback(
    (userId: Id<"users">, userName: string, isCurrentUser: boolean) => {
      if (isDemoMode || !roomData || isCurrentUser) return;
      setPendingDeleteUserId({ id: userId, name: userName });
    },
    [isDemoMode, roomData]
  );

  // Handle confirmed player deletion
  const handleConfirmDeletePlayer = useCallback(async () => {
    if (!pendingDeleteUserId) return;
    try {
      await removeUser({ userId: pendingDeleteUserId.id });
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
    setPendingDeleteUserId(null);
  }, [pendingDeleteUserId, removeUser]);

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
  const { nodes: layoutNodes, edges: layoutEdges, currentIssue, hasNoteForCurrentIssue } = useCanvasNodes({
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
    onOpenIssuesPanel: handleOpenIssuesPanel,
    onUpdateNoteContent: handleUpdateNoteContent,
    onDeleteNote: handleDeleteNote,
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
      // Filter out all node removals - only note and player nodes trigger delete flows
      const filteredChanges = changes.filter((change) => {
        if (change.type === "remove") {
          const node = nodes.find((n) => n.id === change.id);
          if (node?.type === "note") {
            handleDeleteNote(change.id, !!node.data.content);
          } else if (node?.type === "player") {
            const playerData = node.data as PlayerNodeData;
            handleDeletePlayer(playerData.user._id, playerData.user.name, playerData.isCurrentUser);
          }
          // Block all removals - deletions go through confirmation handlers
          return false;
        }
        return true;
      });

      // Call the original handler to update local state
      onNodesChange(filteredChanges);

      // Send position updates to database
      filteredChanges.forEach((change) => {
        if (change.type === "position" && change.position && !change.dragging) {
          debouncedPositionUpdate(change.id, change.position);
        }
      });
    },
    [onNodesChange, debouncedPositionUpdate, nodes, handleDeleteNote, handleDeletePlayer]
  );

  // Handle edge changes - block all edge deletions
  const handleEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      // Filter out all edge removals - edges are managed by the system
      const filteredChanges = changes.filter((change) => change.type !== "remove");
      onEdgesChange(filteredChanges);
    },
    [onEdgesChange]
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
    <div className="w-full h-screen relative overflow-hidden">
      {!isDemoMode && (
        <CanvasNavigation
          roomData={roomData}
          isIssuesPanelOpen={isIssuesPanelOpen}
          onIssuesPanelChange={setIsIssuesPanelOpen}
        />
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isDemoMode ? undefined : handleNodesChange}
        onEdgesChange={isDemoMode ? undefined : handleEdgesChange}
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
          className="*:stroke-gray-300 dark:*:stroke-surface-3"
        />
      </ReactFlow>
      {!isDemoMode && (
        <NodePickerToolbar
          currentIssueId={currentIssue?._id ?? null}
          hasNoteForCurrentIssue={hasNoteForCurrentIssue}
          onCreateNote={() => currentIssue && handleCreateNote(currentIssue._id)}
          isDemoMode={isDemoMode}
        />
      )}

      {/* Delete note confirmation dialog */}
      <AlertDialog
        open={!!pendingDeleteNodeId}
        onOpenChange={(open) => !open && setPendingDeleteNodeId(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This note has content. Are you sure you want to delete it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove user confirmation dialog */}
      <AlertDialog
        open={!!pendingDeleteUserId}
        onOpenChange={(open) => !open && setPendingDeleteUserId(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {pendingDeleteUserId?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the user from the room. They can rejoin using the room link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDeletePlayer}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
