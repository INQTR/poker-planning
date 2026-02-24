import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id, Doc } from "../_generated/dataModel";
import * as Canvas from "./canvas";
import * as Issues from "./issues";
import * as Users from "./users";
import { VOTING_SCALES, VotingScaleType } from "../scales";
import { isRoomOwnerAbsent } from "./permissions";

export interface CreateRoomArgs {
  name: string;
  roomType?: "canvas"; // Optional, defaults to canvas
  autoCompleteVoting?: boolean;
  votingScale?: {
    type: VotingScaleType | "custom";
    cards?: string[]; // Required only for custom type
  };
}

export interface SanitizedVote extends Doc<"votes"> {
  hasVoted: boolean;
}

export interface RoomWithRelatedData {
  room: Doc<"rooms">;
  users: Users.RoomUserData[];
  votes: SanitizedVote[];
  isOwnerAbsent: boolean;
}

/**
 * Resolves voting scale configuration from user input
 */
function resolveVotingScale(scaleConfig?: CreateRoomArgs["votingScale"]) {
  // Default to Fibonacci if no scale provided
  if (!scaleConfig) {
    const fibonacci = VOTING_SCALES.fibonacci;
    return {
      type: fibonacci.type,
      cards: [...fibonacci.cards],
      isNumeric: fibonacci.isNumeric,
    };
  }

  // Handle custom scales
  if (scaleConfig.type === "custom") {
    if (!scaleConfig.cards || scaleConfig.cards.length === 0) {
      throw new Error("Custom scale requires cards array");
    }
    return {
      type: "custom" as const,
      cards: scaleConfig.cards,
      isNumeric: false, // Custom scales default to non-numeric
    };
  }

  // Handle predefined scales
  const predefinedScale = VOTING_SCALES[scaleConfig.type];
  return {
    type: predefinedScale.type,
    cards: [...predefinedScale.cards],
    isNumeric: predefinedScale.isNumeric,
  };
}

/**
 * Creates a new room with the specified configuration
 */
export async function createRoom(
  ctx: MutationCtx,
  args: CreateRoomArgs & { ownerId?: Id<"users"> }
): Promise<Id<"rooms">> {
  const votingScale = resolveVotingScale(args.votingScale);

  const roomId = await ctx.db.insert("rooms", {
    name: args.name,
    roomType: "canvas", // Always canvas now
    autoCompleteVoting: args.autoCompleteVoting ?? false,
    isGameOver: false,
    votingScale,
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
    ...(args.ownerId ? { ownerId: args.ownerId } : {}),
  });

  // Always initialize canvas nodes
  await Canvas.initializeCanvasNodes(ctx, { roomId });

  return roomId;
}

/**
 * Fetches a room with all related data (users and votes)
 */
export async function getRoomWithRelatedData(
  ctx: QueryCtx,
  roomId: Id<"rooms">,
  currentUserId?: Id<"users">
): Promise<RoomWithRelatedData | null> {
  const room = await ctx.db.get(roomId);
  if (!room) return null;

  // Get users (via memberships), votes, and owner-absent status in parallel
  const [users, votes, ownerAbsent] = await Promise.all([
    Users.getRoomUsers(ctx, roomId),
    ctx.db
      .query("votes")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect(),
    isRoomOwnerAbsent(ctx, room),
  ]);

  // Sanitize votes based on game state
  const sanitizedVotes = sanitizeVotes(votes, room.isGameOver, currentUserId);

  return {
    room,
    users,
    votes: sanitizedVotes,
    isOwnerAbsent: ownerAbsent,
  };
}

/**
 * Sanitizes vote data based on game state.
 * Hides card values when the game is not over, except for the current user's
 * own vote (they already know what they voted for).
 */
export function sanitizeVotes(
  votes: Doc<"votes">[],
  isGameOver: boolean,
  currentUserId?: Id<"users">
): SanitizedVote[] {
  return votes.map((vote) => {
    const isOwnVote = currentUserId && vote.userId === currentUserId;
    const showCardData = isGameOver || isOwnVote;
    return {
      ...vote,
      cardLabel: showCardData ? vote.cardLabel : undefined,
      cardValue: showCardData ? vote.cardValue : undefined,
      cardIcon: showCardData ? vote.cardIcon : undefined,
      hasVoted: !!vote.cardLabel,
    };
  });
}

/**
 * Updates room activity timestamp
 */
export async function updateRoomActivity(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<void> {
  await ctx.db.patch(roomId, {
    lastActivityAt: Date.now(),
  });
}

/**
 * Reveals all cards in the room
 */
export async function showRoomCards(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<void> {
  const room = await ctx.db.get(roomId);
  // Cancel scheduled reveal if exists (prevents duplicate reveals)
  if (room?.autoRevealScheduledId) {
    try {
      await ctx.scheduler.cancel(room.autoRevealScheduledId);
    } catch {
      // Job may have already executed - this is fine
    }
  }
  await ctx.db.patch(roomId, {
    isGameOver: true,
    lastActivityAt: Date.now(),
    autoRevealCountdownStartedAt: undefined, // Clear countdown when revealing
    autoRevealScheduledId: undefined,
  });

  // Create results node for canvas rooms
  if (room?.roomType === "canvas") {
    await Canvas.upsertResultsNode(ctx, { roomId });
  }

  // Auto-populate final estimate and vote stats on current issue
  if (room?.currentIssueId) {
    const consensus = await Issues.calculateConsensus(ctx, roomId);
    const voteStats = await Issues.calculateVoteStats(ctx, roomId);
    if (consensus) {
      await Issues.completeIssueVoting(ctx, {
        roomId,
        issueId: room.currentIssueId,
        finalEstimate: consensus,
        voteStats,
      });
    }
  }
}

/**
 * Resets the game, clearing all votes
 */
export async function resetRoomGame(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<void> {
  const room = await ctx.db.get(roomId);

  // Reset current issue status to pending (if it was voting/completed)
  if (room?.currentIssueId) {
    const currentIssue = await ctx.db.get(room.currentIssueId);
    if (currentIssue && currentIssue.status === "voting") {
      await ctx.db.patch(room.currentIssueId, { status: "pending" });
    }
  }

  // Cancel scheduled reveal if exists
  if (room?.autoRevealScheduledId) {
    try {
      await ctx.scheduler.cancel(room.autoRevealScheduledId);
    } catch {
      // Job may have already executed - this is fine
    }
  }

  // Update room state
  await ctx.db.patch(roomId, {
    isGameOver: false,
    lastActivityAt: Date.now(),
    autoRevealCountdownStartedAt: undefined, // Clear countdown when resetting
    autoRevealScheduledId: undefined,
  });

  // Delete all votes for this room in a more efficient way
  const votes = await ctx.db
    .query("votes")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  // Use Promise.all for parallel deletion
  await Promise.all(votes.map((vote) => ctx.db.delete(vote._id)));
}

/**
 * Gets rooms for a specific user
 * TODO: Implement proper user session tracking
 */
export async function getUserRooms(

  _ctx: QueryCtx,
  _userId: string
): Promise<Doc<"rooms">[]> {
  // This would need to track user sessions differently
  // For now, return empty array
  return [];
}
