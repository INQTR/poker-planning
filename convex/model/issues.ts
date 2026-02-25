import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id, Doc } from "../_generated/dataModel";

export type IssueStatus = "pending" | "voting" | "completed";

export interface VoteStats {
  average: number | null;
  median: number | null;
  agreement: number;
  voteCount: number;
  timeToConsensusMs?: number;
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
  // Discussion notes
  notes: string | null;
}

/**
 * Closes any open voting timestamp for the given issue.
 * Called when an issue is abandoned (switched away, reset) without completing.
 */
export async function closeOpenTimestamp(
  ctx: MutationCtx,
  issueId: Id<"issues">
): Promise<void> {
  const timestamps = await ctx.db
    .query("votingTimestamps")
    .withIndex("by_issue", (q) => q.eq("issueId", issueId))
    .collect();

  const latest = timestamps[timestamps.length - 1];
  if (latest && !latest.votingEndedAt) {
    const now = Date.now();
    await ctx.db.patch(latest._id, {
      votingEndedAt: now,
      durationMs: now - latest.votingStartedAt,
    });
  }
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

  // Delete associated voting timestamps
  const timestamps = await ctx.db
    .query("votingTimestamps")
    .withIndex("by_issue", (q) => q.eq("issueId", issueId))
    .collect();
  await Promise.all(timestamps.map((ts) => ctx.db.delete(ts._id)));

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
      await closeOpenTimestamp(ctx, room.currentIssueId);
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

  // Record voting timestamp for time-to-consensus tracking
  const existingRounds = await ctx.db
    .query("votingTimestamps")
    .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
    .collect();

  await ctx.db.insert("votingTimestamps", {
    roomId: args.roomId,
    issueId: args.issueId,
    votingStartedAt: Date.now(),
    roundNumber: existingRounds.length + 1,
  });
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
  const now = Date.now();

  // Find and close the latest voting timestamp for this issue
  const timestamps = await ctx.db
    .query("votingTimestamps")
    .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
    .collect();

  let timeToConsensusMs: number | undefined;
  const latestTimestamp = timestamps[timestamps.length - 1];
  if (latestTimestamp && !latestTimestamp.votingEndedAt) {
    const durationMs = now - latestTimestamp.votingStartedAt;
    await ctx.db.patch(latestTimestamp._id, {
      votingEndedAt: now,
      durationMs,
    });

    // Total time = sum of all previously completed rounds + current round
    const totalMs =
      timestamps.reduce((sum, ts) => sum + (ts.durationMs ?? 0), 0) +
      durationMs;
    timeToConsensusMs = totalMs;
  } else if (timestamps.length > 0) {
    // All rounds already closed (e.g. issue was reset then completed) — sum existing
    const totalMs = timestamps.reduce((sum, ts) => sum + (ts.durationMs ?? 0), 0);
    if (totalMs > 0) {
      timeToConsensusMs = totalMs;
    }
  }

  await ctx.db.patch(args.issueId, {
    status: "completed",
    finalEstimate: args.finalEstimate,
    votedAt: now,
    voteStats: {
      average: args.voteStats.average ?? undefined,
      median: args.voteStats.median ?? undefined,
      agreement: args.voteStats.agreement,
      voteCount: args.voteStats.voteCount,
      timeToConsensusMs,
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

  // Fetch all notes for room in a single query (avoid N+1)
  const noteNodes = await ctx.db
    .query("canvasNodes")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .filter((q) => q.eq(q.field("type"), "note"))
    .collect();

  // Build lookup map: issueId -> note content
  const notesByIssueId = new Map<string, string | null>(
    noteNodes.map((n) => [n.data?.issueId as string, n.data?.content ?? null])
  );

  return issues.map((issue) => ({
    title: issue.title,
    finalEstimate: issue.finalEstimate ?? null,
    status: issue.status,
    votedAt: issue.votedAt ? new Date(issue.votedAt).toISOString() : null,
    average: issue.voteStats?.average ?? null,
    median: issue.voteStats?.median ?? null,
    agreement: issue.voteStats?.agreement ?? null,
    voteCount: issue.voteStats?.voteCount ?? null,
    notes: notesByIssueId.get(issue._id) ?? null,
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
      await closeOpenTimestamp(ctx, room.currentIssueId);
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
