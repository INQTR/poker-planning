import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Rooms from "./rooms";

export interface PickCardArgs {
  roomId: Id<"rooms">;
  userId: Id<"users">;
  cardLabel: string;
  cardValue: number;
  cardIcon?: string;
}

export interface RemoveCardArgs {
  roomId: Id<"rooms">;
  userId: Id<"users">;
}

/**
 * Records or updates a user's vote
 */
export async function pickCard(
  ctx: MutationCtx,
  args: PickCardArgs
): Promise<void> {
  // Update room activity
  await Rooms.updateRoomActivity(ctx, args.roomId);

  // Check if vote exists
  const existingVote = await ctx.db
    .query("votes")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", args.roomId).eq("userId", args.userId)
    )
    .first();

  if (existingVote) {
    // Update existing vote
    await ctx.db.patch(existingVote._id, {
      cardLabel: args.cardLabel,
      cardValue: args.cardValue,
      cardIcon: args.cardIcon,
    });
  } else {
    // Create new vote
    await ctx.db.insert("votes", {
      roomId: args.roomId,
      userId: args.userId,
      cardLabel: args.cardLabel,
      cardValue: args.cardValue,
      cardIcon: args.cardIcon,
    });
  }

  // Check for auto-complete voting - start countdown instead of immediate reveal
  const room = await ctx.db.get(args.roomId);
  if (room && room.autoCompleteVoting && !room.isGameOver && !room.autoRevealCountdownStartedAt) {
    const allVotesIn = await areAllVotesIn(ctx, args.roomId);
    if (allVotesIn) {
      // Start the countdown instead of revealing immediately
      await ctx.db.patch(args.roomId, {
        autoRevealCountdownStartedAt: Date.now(),
      });
    }
  }
}

/**
 * Removes a user's vote
 */
export async function removeCard(
  ctx: MutationCtx,
  args: RemoveCardArgs
): Promise<void> {
  // Update room activity
  await Rooms.updateRoomActivity(ctx, args.roomId);

  // Find and delete vote
  const vote = await ctx.db
    .query("votes")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", args.roomId).eq("userId", args.userId)
    )
    .first();

  if (vote) {
    await ctx.db.delete(vote._id);
  }
}

/**
 * Gets all votes for a room
 */
export async function getRoomVotes(ctx: MutationCtx, roomId: Id<"rooms">) {
  return await ctx.db
    .query("votes")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();
}

/**
 * Checks if all non-spectator users have voted
 */
export async function areAllVotesIn(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<boolean> {
  const [users, votes] = await Promise.all([
    ctx.db
      .query("users")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect(),
    getRoomVotes(ctx, roomId),
  ]);

  const nonSpectatorUsers = users.filter((user) => !user.isSpectator);
  const votedUserIds = new Set(votes.map((vote) => vote.userId));

  return nonSpectatorUsers.every((user) => votedUserIds.has(user._id));
}
