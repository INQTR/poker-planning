import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import * as Rooms from "./rooms";
import { COUNTDOWN_DURATION_MS } from "../constants";
import { SPECIAL_CARDS, VotingScale } from "../scales";

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

  // Check for auto-complete voting - start countdown with server-side scheduled reveal
  const room = await ctx.db.get(args.roomId);
  if (room && room.autoCompleteVoting && !room.isGameOver && !room.autoRevealCountdownStartedAt) {
    const allVotesIn = await areAllVotesIn(ctx, args.roomId);
    if (allVotesIn) {
      // Schedule server-side reveal - eliminates client race condition
      const scheduledId = await ctx.scheduler.runAfter(
        COUNTDOWN_DURATION_MS,
        internal.rooms.scheduledAutoReveal,
        { roomId: args.roomId }
      );
      await ctx.db.patch(args.roomId, {
        autoRevealCountdownStartedAt: Date.now(),
        autoRevealScheduledId: scheduledId,
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

    // Cancel countdown only if votes are no longer complete
    const room = await ctx.db.get(args.roomId);
    if (room?.autoRevealScheduledId) {
      const allVotesIn = await areAllVotesIn(ctx, args.roomId);
      if (!allVotesIn) {
        try {
          await ctx.scheduler.cancel(room.autoRevealScheduledId);
        } catch {
          // Job may have already executed or been cancelled - this is fine
        }
        await ctx.db.patch(args.roomId, {
          autoRevealCountdownStartedAt: undefined,
          autoRevealScheduledId: undefined,
        });
      }
    }
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
  const [memberships, votes] = await Promise.all([
    ctx.db
      .query("roomMemberships")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect(),
    getRoomVotes(ctx, roomId),
  ]);

  const nonSpectatorMembers = memberships.filter((m) => !m.isSpectator);
  const votedUserIds = new Set(votes.map((vote) => vote.userId));

  return nonSpectatorMembers.every((m) => votedUserIds.has(m.userId));
}

/**
 * Snapshots individual votes for voter alignment analytics.
 * Called when cards are revealed. Idempotent — deletes previous snapshots for the issue first.
 */
export async function snapshotVotesForHistory(
  ctx: MutationCtx,
  args: {
    roomId: Id<"rooms">;
    issueId: Id<"issues">;
    consensusLabel: string | null;
    votingScale: VotingScale | undefined;
  }
): Promise<void> {
  const { roomId, issueId, consensusLabel, votingScale } = args;

  // Idempotency: delete any existing snapshots for this issue
  const existing = await ctx.db
    .query("individualVotes")
    .withIndex("by_issue", (q) => q.eq("issueId", issueId))
    .collect();
  await Promise.all(existing.map((row) => ctx.db.delete(row._id)));

  // Get current votes
  const votes = await getRoomVotes(ctx, roomId);

  // Build scale index map for deltaSteps computation
  const scaleCards = votingScale?.cards ?? [];
  const numericScale = votingScale?.isNumeric ?? false;
  const scaleIndexMap = new Map<string, number>();
  scaleCards.forEach((card, idx) => {
    if (!SPECIAL_CARDS.includes(card)) {
      scaleIndexMap.set(card, idx);
    }
  });

  const consensusIndex = consensusLabel
    ? scaleIndexMap.get(consensusLabel)
    : undefined;
  const consensusValue =
    consensusLabel !== null ? parseFloat(consensusLabel) : undefined;

  const now = Date.now();

  for (const vote of votes) {
    const label = vote.cardLabel;
    if (!label || SPECIAL_CARDS.includes(label)) continue;

    const voteIndex = scaleIndexMap.get(label);
    const deltaSteps =
      numericScale && voteIndex !== undefined && consensusIndex !== undefined
        ? voteIndex - consensusIndex
        : undefined;

    const cardValue = parseFloat(label);

    await ctx.db.insert("individualVotes", {
      roomId,
      issueId,
      userId: vote.userId,
      cardLabel: label,
      cardValue: isNaN(cardValue) ? undefined : cardValue,
      consensusLabel: consensusLabel ?? undefined,
      consensusValue:
        consensusValue !== undefined && !isNaN(consensusValue)
          ? consensusValue
          : undefined,
      deltaSteps,
      votedAt: now,
    });
  }
}
