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
import { useLatest } from "@/hooks/use-latest";
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
  const { roomUser } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  // Stable ref for nodes - prevents callback recreation on layout changes
  // Based on Vercel React Best Practices: advanced-use-latest
  const nodesRef = useLatest(nodes);

  // Convex mutations
  const showCards = useMutation(api.rooms.showCards);
  const resetGame = useMutation(api.rooms.resetGame);
  const pickCard = useMutation(api.votes.pickCard);
  const updateNodePosition = useMutation(api.canvas.updateNodePosition);
  const toggleAutoComplete = useMutation(api.rooms.toggleAutoComplete);
  const cancelAutoRevealCountdown = useMutation(api.rooms.cancelAutoRevealCountdown);
  const updateNoteContentMutation = useMutation(api.canvas.updateNoteContent);
  const createNoteMutation = useMutation(api.canvas.createNote);
  const deleteNoteMutation = useMutation(api.canvas.deleteNote);
  const removeUser = useMutation(api.users.remove);

  // Stable ref for roomId - prevents callback recreation on roomData changes
  // Based on Vercel React Best Practices: advanced-use-latest
  const roomIdRef = useLatest(roomData.room._id);

  const handleRevealCards = useCallback(async () => {
    if (isDemoMode) return;
    try {
      await showCards({ roomId: roomIdRef.current });
    } catch (error) {
      console.error("Failed to show cards:", error);
    }
  }, [isDemoMode, showCards, roomIdRef]);

  const handleResetGame = useCallback(async () => {
    if (isDemoMode) return;
    try {
      await resetGame({ roomId: roomIdRef.current });
    } catch (error) {
      console.error("Failed to reset game:", error);
    }
  }, [isDemoMode, resetGame, roomIdRef]);

  const handleToggleAutoComplete = useCallback(async () => {
    if (isDemoMode) return;
    try {
      await toggleAutoComplete({ roomId: roomIdRef.current });
    } catch (error) {
      console.error("Failed to toggle auto-complete:", error);
    }
  }, [isDemoMode, toggleAutoComplete, roomIdRef]);

  const handleCancelAutoReveal = useCallback(async () => {
    if (isDemoMode) return;
    try {
      await cancelAutoRevealCountdown({ roomId: roomIdRef.current });
    } catch (error) {
      console.error("Failed to cancel auto-reveal:", error);
    }
  }, [isDemoMode, cancelAutoRevealCountdown, roomIdRef]);

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
      if (isDemoMode || !roomUser) return;
      try {
        await updateNoteContentMutation({
          roomId: roomIdRef.current,
          nodeId,
          content,
          userId: roomUser.id,
        });
      } catch (error) {
        console.error("Failed to update note content:", error);
      }
    },
    [isDemoMode, updateNoteContentMutation, roomUser, roomIdRef]
  );

  // Handle creating a new note for an issue
  const handleCreateNote = useCallback(
    async (issueId: Id<"issues">) => {
      if (isDemoMode || !roomUser) return;
      try {
        await createNoteMutation({
          roomId: roomIdRef.current,
          issueId,
          userId: roomUser.id,
        });
      } catch (error) {
        console.error("Failed to create note:", error);
      }
    },
    [isDemoMode, createNoteMutation, roomUser, roomIdRef]
  );

  // Handle note deletion request
  const handleDeleteNote = useCallback(
    (nodeId: string, hasContent: boolean) => {
      if (isDemoMode || !roomUser) return;
      if (hasContent) {
        // Show confirmation dialog for notes with content
        setPendingDeleteNodeId(nodeId);
      } else {
        // Delete immediately for empty notes
        deleteNoteMutation({
          roomId: roomIdRef.current,
          nodeId,
          userId: roomUser.id,
        }).catch((error) => {
          console.error("Failed to delete note:", error);
        });
      }
    },
    [isDemoMode, deleteNoteMutation, roomIdRef, roomUser]
  );

  // Handle confirmed deletion
  const handleConfirmDelete = useCallback(() => {
    if (!pendingDeleteNodeId || !roomUser) return;
    deleteNoteMutation({
      roomId: roomIdRef.current,
      nodeId: pendingDeleteNodeId,
      userId: roomUser.id,
    }).catch((error) => {
      console.error("Failed to delete note:", error);
    });
    setPendingDeleteNodeId(null);
  }, [pendingDeleteNodeId, deleteNoteMutation, roomIdRef, roomUser]);

  // Handle player deletion request (shows confirmation)
  const handleDeletePlayer = useCallback(
    (userId: Id<"users">, userName: string, isCurrentUser: boolean) => {
      if (isDemoMode || isCurrentUser) return;
      setPendingDeleteUserId({ id: userId, name: userName });
    },
    [isDemoMode]
  );

  // Handle confirmed player deletion
  const handleConfirmDeletePlayer = useCallback(async () => {
    if (!pendingDeleteUserId) return;
    try {
      await removeUser({ userId: pendingDeleteUserId.id, roomId: roomIdRef.current });
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
    setPendingDeleteUserId(null);
  }, [pendingDeleteUserId, removeUser, roomIdRef]);

  // Extract vote state for narrowed effect dependencies
  const userVote = roomData?.votes.find(
    (v: SanitizedVote) => v.userId === roomUser?.id
  );
  const hasVoted = userVote?.hasVoted;
  const voteLabel = userVote?.cardLabel;
  const isGameOver = roomData?.room.isGameOver;

  // Reset selected card when game is reset
  // Narrowed dependencies to primitives to avoid unnecessary re-runs
  useEffect(() => {
    if (!roomData || !roomUser) return;

    // Sync local selection state with server state - intentional state sync pattern
    if (!hasVoted) {
      setSelectedCardValue(null);
    } else if (isGameOver && voteLabel) {
      setSelectedCardValue(voteLabel);
    }
  }, [roomUser, roomData, hasVoted, isGameOver, voteLabel]);

  // Handle card selection
  const handleCardSelect = useCallback(
    async (cardValue: string) => {
      if (isDemoMode || !roomUser) return;

      setSelectedCardValue(cardValue);

      try {
        await pickCard({
          roomId: roomIdRef.current,
          userId: roomUser.id,
          cardLabel: cardValue,
          cardValue: parseInt(cardValue) || 0,
        });
      } catch (error) {
        console.error("Failed to pick card:", error);
        setSelectedCardValue(null);
      }
    },
    [isDemoMode, pickCard, roomUser, roomIdRef]
  );

  // Get room ID
  const roomId = roomData?.room._id as Id<"rooms">;

  // Use the canvas nodes hook to get persisted nodes
  const { nodes: layoutNodes, edges: layoutEdges, currentIssue, hasNoteForCurrentIssue } = useCanvasNodes({
    roomId,
    roomData,
    currentUserId: roomUser?.id,
    selectedCardValue,
    onRevealCards: handleRevealCards,
    onResetGame: handleResetGame,
    onCardSelect: handleCardSelect,
    onToggleAutoComplete: handleToggleAutoComplete,
    onCancelAutoReveal: handleCancelAutoReveal,
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
  // Uses roomIdRef to avoid recreating debounced function on roomData changes
  /* eslint-disable react-hooks/refs -- roomIdRef is only read during drag events, not render */
  const debouncedPositionUpdate = useMemo(
    () =>
      debounce((nodeId: string, position: { x: number; y: number }) => {
        if (!roomUser) return;

        updateNodePosition({
          roomId: roomIdRef.current,
          nodeId,
          position,
          userId: roomUser.id,
        }).catch((error) => {
          console.error("Failed to update node position:", error);
        });
      }, 100),
    [roomUser, updateNodePosition, roomIdRef]
  );
  /* eslint-enable react-hooks/refs */

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedPositionUpdate.cancel();
    };
  }, [debouncedPositionUpdate]);

  // Handle node position changes
  // Uses nodesRef to avoid callback recreation on every layout change
  const handleNodesChange = useCallback(
    (changes: NodeChange<CustomNodeType>[]) => {
      // Filter out all node removals - only note and player nodes trigger delete flows
      const filteredChanges = changes.filter((change) => {
        if (change.type === "remove") {
          const node = nodesRef.current.find((n) => n.id === change.id);
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
    [onNodesChange, debouncedPositionUpdate, nodesRef, handleDeleteNote, handleDeletePlayer]
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

  if (!roomData || (!roomUser && !isDemoMode)) {
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
