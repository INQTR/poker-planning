import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id, Doc } from "../_generated/dataModel";

export type IssueStatus = "pending" | "voting" | "completed";

export interface VoteStats {
  average: number | null;
  median: number | null;
  agreement: number;
  voteCount: number;
}

export interface ExportableIssue {
  title: string;
  finalEstimate: string | null;
  status: IssueStatus;
  votedAt: string | null; // ISO timestamp
  // Vote statistics
  average: number | null;
  median: number | null;
  agreement: number | null;
  voteCount: number | null;
}

/**
 * Lists all issues for a room, ordered by their order field
 */
export async function listIssues(
  ctx: QueryCtx,
  roomId: Id<"rooms">
): Promise<Doc<"issues">[]> {
  return await ctx.db
    .query("issues")
    .withIndex("by_room_order", (q) => q.eq("roomId", roomId))
    .collect();
}

/**
 * Gets the current issue being voted on
 */
export async function getCurrentIssue(
  ctx: QueryCtx,
  roomId: Id<"rooms">
): Promise<Doc<"issues"> | null> {
  const room = await ctx.db.get(roomId);
  if (!room?.currentIssueId) return null;
  return await ctx.db.get(room.currentIssueId);
}

/**
 * Creates a new issue with an auto-incremented sequential ID
 */
export async function createIssue(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; title: string }
): Promise<Id<"issues">> {
  const room = await ctx.db.get(args.roomId);
  if (!room) throw new Error("Room not found");

  // Get next sequential ID
  const nextNumber = (room.nextIssueNumber ?? 0) + 1;

  // Get current max order
  const issues = await ctx.db
    .query("issues")
    .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
    .collect();
  const maxOrder = issues.length > 0 ? Math.max(...issues.map((i) => i.order)) : 0;

  // Update room's next issue number
  await ctx.db.patch(args.roomId, {
    nextIssueNumber: nextNumber,
    lastActivityAt: Date.now(),
  });

  // Create the issue
  return await ctx.db.insert("issues", {
    roomId: args.roomId,
    sequentialId: nextNumber,
    title: args.title,
    status: "pending",
    createdAt: Date.now(),
    order: maxOrder + 1,
  });
}

/**
 * Updates an issue's title
 */
export async function updateIssueTitle(
  ctx: MutationCtx,
  args: { issueId: Id<"issues">; title: string }
): Promise<void> {
  const issue = await ctx.db.get(args.issueId);
  if (!issue) throw new Error("Issue not found");

  await ctx.db.patch(args.issueId, { title: args.title });

  // Update room activity
  await ctx.db.patch(issue.roomId, { lastActivityAt: Date.now() });
}

/**
 * Updates an issue's final estimate (manual override after voting)
 */
export async function updateIssueEstimate(
  ctx: MutationCtx,
  args: { issueId: Id<"issues">; finalEstimate: string }
): Promise<void> {
  const issue = await ctx.db.get(args.issueId);
  if (!issue) throw new Error("Issue not found");

  await ctx.db.patch(args.issueId, { finalEstimate: args.finalEstimate });

  // Update room activity
  await ctx.db.patch(issue.roomId, { lastActivityAt: Date.now() });
}

/**
 * Removes an issue
 */
export async function removeIssue(
  ctx: MutationCtx,
  issueId: Id<"issues">
): Promise<void> {
  const issue = await ctx.db.get(issueId);
  if (!issue) throw new Error("Issue not found");

  // If this was the current issue, clear it and related state
  const room = await ctx.db.get(issue.roomId);
  if (room?.currentIssueId === issueId) {
    await ctx.db.patch(issue.roomId, {
      currentIssueId: undefined,
      autoRevealCountdownStartedAt: undefined,
      lastActivityAt: Date.now(),
    });
  }

  await ctx.db.delete(issueId);
}

/**
 * Starts voting on an issue - clears previous votes, sets as current
 */
export async function startVotingOnIssue(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; issueId: Id<"issues"> }
): Promise<void> {
  const room = await ctx.db.get(args.roomId);
  if (!room) throw new Error("Room not found");

  const issue = await ctx.db.get(args.issueId);
  if (!issue) throw new Error("Issue not found");

  // If there's a current issue that was voting, reset it to pending (no estimate)
  if (room.currentIssueId && room.currentIssueId !== args.issueId) {
    const previousIssue = await ctx.db.get(room.currentIssueId);
    if (previousIssue && previousIssue.status === "voting") {
      await ctx.db.patch(room.currentIssueId, { status: "pending" });
    }
  }

  // Set the new issue as current and mark as voting
  await ctx.db.patch(args.issueId, { status: "voting" });

  // Update room with new current issue
  await ctx.db.patch(args.roomId, {
    currentIssueId: args.issueId,
    isGameOver: false,
    autoRevealCountdownStartedAt: undefined,
    lastActivityAt: Date.now(),
  });

  // Clear all existing votes
  const votes = await ctx.db
    .query("votes")
    .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
    .collect();

  await Promise.all(votes.map((vote) => ctx.db.delete(vote._id)));
}

/**
 * Completes voting on an issue - sets final estimate, status, and vote stats
 */
export async function completeIssueVoting(
  ctx: MutationCtx,
  args: {
    roomId: Id<"rooms">;
    issueId: Id<"issues">;
    finalEstimate: string;
    voteStats: VoteStats;
  }
): Promise<void> {
  await ctx.db.patch(args.issueId, {
    status: "completed",
    finalEstimate: args.finalEstimate,
    votedAt: Date.now(),
    voteStats: {
      average: args.voteStats.average ?? undefined,
      median: args.voteStats.median ?? undefined,
      agreement: args.voteStats.agreement,
      voteCount: args.voteStats.voteCount,
    },
  });
}

/**
 * Calculates consensus from votes (most common vote, tie-breaker: lower numeric value)
 */
export async function calculateConsensus(
  ctx: QueryCtx,
  roomId: Id<"rooms">
): Promise<string | null> {
  const room = await ctx.db.get(roomId);
  if (!room) return null;

  const votes = await ctx.db
    .query("votes")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  // Filter valid votes (exclude special cards like "?" and coffee)
  const validVotes = votes.filter(
    (v) => v.cardLabel && v.cardLabel !== "?" && v.cardLabel !== "coffee"
  );

  if (validVotes.length === 0) return null;

  // Count votes by label
  const counts: Record<string, number> = {};
  validVotes.forEach((v) => {
    const label = v.cardLabel!;
    counts[label] = (counts[label] || 0) + 1;
  });

  // Find mode (most common vote)
  const maxCount = Math.max(...Object.values(counts));
  const modes = Object.entries(counts)
    .filter(([, count]) => count === maxCount)
    .map(([label]) => label);

  // If single mode, return it
  if (modes.length === 1) return modes[0];

  // Tie-breaker: prefer lower numeric value
  const numeric = modes.map((m) => parseFloat(m)).filter((n) => !isNaN(n));
  if (numeric.length > 0) {
    return Math.min(...numeric).toString();
  }

  // For non-numeric ties, return first alphabetically
  return modes.sort()[0];
}

/**
 * Calculates vote statistics (average, median, agreement) from current votes
 */
export async function calculateVoteStats(
  ctx: QueryCtx,
  roomId: Id<"rooms">
): Promise<VoteStats> {
  const votes = await ctx.db
    .query("votes")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  // Filter valid votes (exclude special cards like "?" and coffee)
  const validVotes = votes.filter(
    (v) => v.cardLabel && v.cardLabel !== "?" && v.cardLabel !== "☕"
  );

  const voteCount = validVotes.length;

  if (voteCount === 0) {
    return { average: null, median: null, agreement: 0, voteCount: 0 };
  }

  // Get numeric votes for average and median
  const numericVotes = validVotes
    .map((v) => parseFloat(v.cardLabel || ""))
    .filter((v) => !isNaN(v));

  let average: number | null = null;
  let median: number | null = null;

  if (numericVotes.length > 0) {
    // Calculate average
    average = numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length;

    // Calculate median
    const sorted = [...numericVotes].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    median =
      sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // Calculate agreement (percentage of votes on most common value)
  const counts: Record<string, number> = {};
  validVotes.forEach((v) => {
    const label = v.cardLabel!;
    counts[label] = (counts[label] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(counts));
  const agreement = Math.round((maxCount / voteCount) * 100);

  return { average, median, agreement, voteCount };
}

/**
 * Gets issues formatted for CSV export
 */
export async function getIssuesForExport(
  ctx: QueryCtx,
  roomId: Id<"rooms">
): Promise<ExportableIssue[]> {
  const issues = await listIssues(ctx, roomId);

  return issues.map((issue) => ({
    title: issue.title,
    finalEstimate: issue.finalEstimate ?? null,
    status: issue.status,
    votedAt: issue.votedAt ? new Date(issue.votedAt).toISOString() : null,
    average: issue.voteStats?.average ?? null,
    median: issue.voteStats?.median ?? null,
    agreement: issue.voteStats?.agreement ?? null,
    voteCount: issue.voteStats?.voteCount ?? null,
  }));
}

/**
 * Reorders issues (for drag-and-drop)
 */
export async function reorderIssues(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; issueIds: Id<"issues">[] }
): Promise<void> {
  // Update order for each issue
  await Promise.all(
    args.issueIds.map((issueId, index) =>
      ctx.db.patch(issueId, { order: index + 1 })
    )
  );

  // Update room activity
  await ctx.db.patch(args.roomId, { lastActivityAt: Date.now() });
}

/**
 * Clears the current issue (switches to Quick Vote mode)
 */
export async function clearCurrentIssue(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<void> {
  const room = await ctx.db.get(roomId);
  if (!room) throw new Error("Room not found");

  // Reset current issue status if it was voting
  if (room.currentIssueId) {
    const currentIssue = await ctx.db.get(room.currentIssueId);
    if (currentIssue && currentIssue.status === "voting") {
      await ctx.db.patch(room.currentIssueId, { status: "pending" });
    }
  }

  // Clear current issue and reset game state
  await ctx.db.patch(roomId, {
    currentIssueId: undefined,
    isGameOver: false,
    autoRevealCountdownStartedAt: undefined,
    lastActivityAt: Date.now(),
  });

  // Clear all votes
  const votes = await ctx.db
    .query("votes")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  await Promise.all(votes.map((vote) => ctx.db.delete(vote._id)));
}
