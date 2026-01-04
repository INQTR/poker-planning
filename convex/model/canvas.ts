import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import dagre from "@dagrejs/dagre";

// Layout constants for default positions
const CANVAS_CENTER = { x: 0, y: 0 };
const TIMER_X = -500;
const TIMER_Y = -250;
const SESSION_Y = -300; // Initial session Y position (will be updated by Dagre relayout)
const VOTING_CARD_Y = 450;
const VOTING_CARD_SPACING = 70;
const DEFAULT_CARDS = ["0", "1", "2", "3", "5", "8", "13", "21", "?"];

// Dagre layout configuration (for session + player node positioning)
const DAGRE_CONFIG = {
  rankdir: "TB" as const, // Top-to-bottom (session → players)
  nodesep: 150, // Horizontal spacing between players
  ranksep: 300, // Vertical spacing between session and players
};

// Node dimensions for dagre layout
const NODE_DIMENSIONS = {
  session: { width: 280, height: 150 },
  player: { width: 80, height: 130 },
};

export interface Position {
  x: number;
  y: number;
}

export interface CanvasNode {
  roomId: Id<"rooms">;
  nodeId: string;
  type: "player" | "timer" | "session" | "votingCard" | "results" | "story";
  position: Position;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: Create proper type union for node data
  data: any;
  isLocked?: boolean;
  lastUpdatedBy?: Id<"users">;
  lastUpdatedAt: number;
}

interface NodePosition {
  nodeId: string;
  position: Position;
}

/**
 * Computes Dagre layout for session and player nodes.
 * Returns positions with top-left coordinates (React Flow format).
 */
function computeDagreLayout(
  sessionNodeId: string,
  playerNodeIds: string[]
): NodePosition[] {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph(DAGRE_CONFIG);

  // Add session node
  dagreGraph.setNode(sessionNodeId, NODE_DIMENSIONS.session);

  // Add player nodes and edges from session to each player
  playerNodeIds.forEach((playerId) => {
    dagreGraph.setNode(playerId, NODE_DIMENSIONS.player);
    dagreGraph.setEdge(sessionNodeId, playerId);
  });

  // Compute layout
  dagre.layout(dagreGraph);

  // Get session position to calculate centering offset
  const sessionPos = dagreGraph.node(sessionNodeId);

  // Calculate offset to center the session node at CANVAS_CENTER
  // Dagre positions are center-based, so we offset to put session center at (0, SESSION_Y + session height/2)
  const offsetX = sessionPos.x - CANVAS_CENTER.x;
  const offsetY = sessionPos.y - (SESSION_Y + NODE_DIMENSIONS.session.height / 2);

  // Extract positions with centering offset (convert from center to top-left coordinates)
  const positions: NodePosition[] = [];

  positions.push({
    nodeId: sessionNodeId,
    position: {
      x: sessionPos.x - offsetX - NODE_DIMENSIONS.session.width / 2,
      y: sessionPos.y - offsetY - NODE_DIMENSIONS.session.height / 2,
    },
  });

  // Check if Dagre properly spread the player nodes horizontally
  const playerDagrePositions = playerNodeIds.map((id) => dagreGraph.node(id));
  const allSameX =
    playerDagrePositions.length > 1 &&
    playerDagrePositions.every((p) => p.x === playerDagrePositions[0].x);

  if (allSameX) {
    // Dagre didn't spread nodes - manually calculate horizontal positions
    const spacing = DAGRE_CONFIG.nodesep;
    const totalWidth = (playerNodeIds.length - 1) * spacing;
    const startX = CANVAS_CENTER.x - totalWidth / 2;
    const playerY = SESSION_Y + NODE_DIMENSIONS.session.height / 2 + DAGRE_CONFIG.ranksep;

    playerNodeIds.forEach((playerId, index) => {
      const manualX = startX + index * spacing;
      positions.push({
        nodeId: playerId,
        position: {
          x: manualX - NODE_DIMENSIONS.player.width / 2,
          y: playerY - NODE_DIMENSIONS.player.height / 2,
        },
      });
    });
  } else {
    // Dagre worked correctly - use computed positions
    playerNodeIds.forEach((playerId) => {
      const pos = dagreGraph.node(playerId);
      positions.push({
        nodeId: playerId,
        position: {
          x: pos.x - offsetX - NODE_DIMENSIONS.player.width / 2,
          y: pos.y - offsetY - NODE_DIMENSIONS.player.height / 2,
        },
      });
    });
  }

  return positions;
}

/**
 * Recalculates layout for all session/player nodes using Dagre.
 * Called when players join or leave to maintain balanced layout.
 */
export async function relayoutNodes(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<void> {
  // Get all nodes for the room
  const nodes = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  // Find session and player nodes
  const sessionNode = nodes.find((n) => n.type === "session");
  const playerNodes = nodes.filter((n) => n.type === "player");

  if (!sessionNode) return;

  // Compute new layout using Dagre
  const playerNodeIds = playerNodes.map((n) => n.nodeId);
  const newPositions = computeDagreLayout(sessionNode.nodeId, playerNodeIds);

  // Update positions in DB (skip locked nodes)
  const now = Date.now();
  await Promise.all(
    newPositions.map((pos) => {
      const node = nodes.find((n) => n.nodeId === pos.nodeId);
      if (node && !node.isLocked) {
        return ctx.db.patch(node._id, {
          position: pos.position,
          lastUpdatedAt: now,
        });
      }
    })
  );
}

/**
 * Initializes canvas nodes when a canvas room is created
 */
export async function initializeCanvasNodes(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms"> }
): Promise<void> {
  const room = await ctx.db.get(args.roomId);
  if (!room || room.roomType !== "canvas") {
    throw new Error("Invalid canvas room");
  }

  // Check if nodes already exist
  const existingNodes = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
    .first();

  if (existingNodes) {
    return; // Already initialized
  }

  const now = Date.now();

  // Create initial nodes in parallel
  await Promise.all([
    // Create timer node
    ctx.db.insert("canvasNodes", {
      roomId: args.roomId,
      nodeId: "timer",
      type: "timer",
      position: { x: TIMER_X, y: TIMER_Y },
      data: {
        startedAt: null,
        pausedAt: null,
        elapsedSeconds: 0,
        lastUpdatedBy: null,
        lastAction: null,
      },
      lastUpdatedAt: now,
    }),
    // Create session node
    ctx.db.insert("canvasNodes", {
      roomId: args.roomId,
      nodeId: "session-current",
      type: "session",
      position: { x: CANVAS_CENTER.x - 140, y: SESSION_Y },
      data: {},
      lastUpdatedAt: now,
    }),
  ]);
}

/**
 * Gets all canvas nodes for a room
 */
export async function getCanvasNodes(
  ctx: QueryCtx,
  roomId: Id<"rooms">
): Promise<CanvasNode[]> {
  return await ctx.db
    .query("canvasNodes")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();
}

/**
 * Updates a node's position
 */
export async function updateNodePosition(
  ctx: MutationCtx,
  args: {
    roomId: Id<"rooms">;
    nodeId: string;
    position: Position;
    userId: Id<"users">;
  }
): Promise<void> {
  const node = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room_node", (q) =>
      q.eq("roomId", args.roomId).eq("nodeId", args.nodeId)
    )
    .unique();

  if (!node) {
    throw new Error("Node not found");
  }

  if (node.isLocked) {
    throw new Error("Node is locked");
  }

  await ctx.db.patch(node._id, {
    position: args.position,
    lastUpdatedBy: args.userId,
    lastUpdatedAt: Date.now(),
  });
}

/**
 * Creates or updates a player node
 */
export async function upsertPlayerNode(
  ctx: MutationCtx,
  args: {
    roomId: Id<"rooms">;
    userId: Id<"users">;
    position?: Position;
  }
): Promise<Id<"canvasNodes">> {
  const nodeId = `player-${args.userId}`;

  const existingNode = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room_node", (q) =>
      q.eq("roomId", args.roomId).eq("nodeId", nodeId)
    )
    .unique();

  if (existingNode) {
    return existingNode._id;
  }

  // Create with temporary position (will be updated by relayout)
  const position = args.position ?? { x: 0, y: 0 };

  const id = await ctx.db.insert("canvasNodes", {
    roomId: args.roomId,
    nodeId,
    type: "player",
    position,
    data: { userId: args.userId },
    lastUpdatedAt: Date.now(),
  });

  // Trigger relayout to position all nodes correctly using Dagre
  await relayoutNodes(ctx, args.roomId);

  return id;
}

/**
 * Creates voting card nodes for a user
 */
export async function createVotingCardNodes(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; userId: Id<"users"> }
): Promise<void> {
  const now = Date.now();
  const cardCount = DEFAULT_CARDS.length;
  const totalWidth = (cardCount - 1) * VOTING_CARD_SPACING;
  const startX = CANVAS_CENTER.x - totalWidth / 2;

  // Check if voting cards already exist for this user
  const existingCards = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
    .filter((q) => q.eq(q.field("type"), "votingCard"))
    .filter((q) => q.eq(q.field("nodeId"), `card-${args.userId}-0`))
    .first();

  if (existingCards) {
    return; // Cards already exist
  }

  // Create voting card nodes in parallel
  await Promise.all(
    DEFAULT_CARDS.map((card, index) => {
      const x = startX + index * VOTING_CARD_SPACING;
      const y = VOTING_CARD_Y;

      return ctx.db.insert("canvasNodes", {
        roomId: args.roomId,
        nodeId: `card-${args.userId}-${index}`,
        type: "votingCard",
        position: { x, y },
        data: {
          card: { value: card },
          userId: args.userId,
          index,
        },
        lastUpdatedAt: now,
      });
    })
  );
}

/**
 * Creates or updates results node
 */
export async function upsertResultsNode(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms"> }
): Promise<Id<"canvasNodes">> {
  const nodeId = "results";

  const existingNode = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room_node", (q) =>
      q.eq("roomId", args.roomId).eq("nodeId", nodeId)
    )
    .unique();

  if (existingNode) {
    return existingNode._id;
  }

  return await ctx.db.insert("canvasNodes", {
    roomId: args.roomId,
    nodeId,
    type: "results",
    position: { x: CANVAS_CENTER.x + 400, y: SESSION_Y + 100 },
    data: {},
    lastUpdatedAt: Date.now(),
  });
}

/**
 * Removes player node and all associated voting cards
 */
export async function removePlayerNodeAndCards(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; userId: Id<"users"> }
): Promise<void> {
  const nodeId = `player-${args.userId}`;

  // Get all nodes to delete in one query
  const nodesToDelete = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
    .filter((q) =>
      q.or(
        q.eq(q.field("nodeId"), nodeId),
        q.and(
          q.eq(q.field("type"), "votingCard"),
          q.eq(q.field("data.userId"), args.userId)
        )
      )
    )
    .collect();

  // Delete all nodes in parallel
  await Promise.all(nodesToDelete.map((node) => ctx.db.delete(node._id)));

  // Trigger relayout to rebalance remaining nodes
  await relayoutNodes(ctx, args.roomId);
}

/**
 * Toggles lock state of a node
 */
export async function toggleNodeLock(
  ctx: MutationCtx,
  args: {
    roomId: Id<"rooms">;
    nodeId: string;
    locked: boolean;
  }
): Promise<void> {
  const node = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room_node", (q) =>
      q.eq("roomId", args.roomId).eq("nodeId", args.nodeId)
    )
    .unique();

  if (!node) {
    throw new Error("Node not found");
  }

  await ctx.db.patch(node._id, {
    isLocked: args.locked,
    lastUpdatedAt: Date.now(),
  });
}

/**
 * Updates viewport state for a user
 */
export async function updateViewport(
  ctx: MutationCtx,
  args: {
    roomId: Id<"rooms">;
    userId: Id<"users">;
    viewport: { x: number; y: number; zoom: number };
  }
): Promise<void> {
  const existing = await ctx.db
    .query("canvasState")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", args.roomId).eq("userId", args.userId)
    )
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      viewport: args.viewport,
      lastUpdatedAt: Date.now(),
    });
  } else {
    await ctx.db.insert("canvasState", {
      roomId: args.roomId,
      userId: args.userId,
      viewport: args.viewport,
      lastUpdatedAt: Date.now(),
    });
  }
}

/**
 * Updates user presence (cursor position, etc.)
 */
export async function updatePresence(
  ctx: MutationCtx,
  args: {
    roomId: Id<"rooms">;
    userId: Id<"users">;
    cursor?: Position;
    isActive?: boolean;
  }
): Promise<void> {
  const existing = await ctx.db
    .query("presence")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", args.roomId).eq("userId", args.userId)
    )
    .unique();

  const now = Date.now();

  if (existing) {
    await ctx.db.patch(existing._id, {
      ...(args.cursor !== undefined && { cursor: args.cursor }),
      ...(args.isActive !== undefined && { isActive: args.isActive }),
      lastPing: now,
    });
  } else {
    await ctx.db.insert("presence", {
      roomId: args.roomId,
      userId: args.userId,
      cursor: args.cursor,
      isActive: args.isActive ?? true,
      lastPing: now,
    });
  }
}

/**
 * Marks a user as inactive
 */
export async function markUserInactive(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; userId: Id<"users"> }
): Promise<void> {
  const presence = await ctx.db
    .query("presence")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", args.roomId).eq("userId", args.userId)
    )
    .unique();

  if (presence) {
    await ctx.db.patch(presence._id, {
      isActive: false,
      lastPing: Date.now(),
    });
  }
}

/**
 * Cleans up inactive presence records
 */
export async function cleanupInactivePresence(
  ctx: MutationCtx
): Promise<void> {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

  const inactivePresence = await ctx.db
    .query("presence")
    .withIndex("by_last_ping", (q) => q.lt("lastPing", fiveMinutesAgo))
    .collect();

  // Update all inactive presence records in parallel
  await Promise.all(
    inactivePresence.map((presence) =>
      ctx.db.patch(presence._id, { isActive: false })
    )
  );
}