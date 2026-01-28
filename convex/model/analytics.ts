import { QueryCtx } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

// Types for analytics data
export interface SessionSummary {
  roomId: string;
  roomName: string;
  joinedAt: number;
  lastActivityAt: number;
  issuesCompleted: number;
  totalStoryPoints: number | null; // null if non-numeric scale
  averageAgreement: number | null;
}

export interface AgreementDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  timestamp: number;
  agreement: number;
  issueTitle: string;
  roomName: string;
}

export interface VelocityDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  storyPoints: number;
  issueCount: number;
}

export interface VoteDistributionItem {
  value: string;
  count: number;
  percentage: number;
}

export interface ParticipationStats {
  totalSessions: number;
  totalIssuesVoted: number;
  totalVotesCast: number;
  averageVotesPerSession: number;
}

export interface DateRange {
  from: number; // timestamp
  to: number; // timestamp
}

/**
 * Gets all room memberships for a user with room details
 */
export async function getUserMemberships(
  ctx: QueryCtx,
  authUserId: string
): Promise<Array<{ membership: Doc<"roomMemberships">; room: Doc<"rooms"> }>> {
  // Find global user
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", authUserId))
    .first();

  if (!user) return [];

  // Get all memberships
  const memberships = await ctx.db
    .query("roomMemberships")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  // Fetch room details for each membership
  const results = await Promise.all(
    memberships.map(async (membership) => {
      const room = await ctx.db.get(membership.roomId);
      if (!room) return null;
      return { membership, room };
    })
  );

  return results.filter((r): r is NonNullable<typeof r> => r !== null);
}

/**
 * Gets session history summaries for a user
 */
export async function getUserSessions(
  ctx: QueryCtx,
  authUserId: string,
  dateRange?: DateRange
): Promise<SessionSummary[]> {
  const membershipsWithRooms = await getUserMemberships(ctx, authUserId);

  // Filter by date range if provided
  const filtered = dateRange
    ? membershipsWithRooms.filter(
        ({ membership }) =>
          membership.joinedAt >= dateRange.from &&
          membership.joinedAt <= dateRange.to
      )
    : membershipsWithRooms;

  // Get session summaries with issue stats
  const summaries = await Promise.all(
    filtered.map(async ({ membership, room }) => {
      // Get completed issues for this room
      const issues = await ctx.db
        .query("issues")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect();

      const completedIssues = issues.filter((i) => i.status === "completed");

      // Calculate total story points (numeric estimates only)
      let totalStoryPoints: number | null = null;
      const numericEstimates = completedIssues
        .map((i) => (i.finalEstimate ? parseFloat(i.finalEstimate) : NaN))
        .filter((v) => !isNaN(v));

      if (numericEstimates.length > 0) {
        totalStoryPoints = numericEstimates.reduce((sum, v) => sum + v, 0);
      }

      // Calculate average agreement
      const agreements = completedIssues
        .map((i) => i.voteStats?.agreement)
        .filter((a): a is number => a !== undefined);

      const averageAgreement =
        agreements.length > 0
          ? Math.round(
              agreements.reduce((sum, a) => sum + a, 0) / agreements.length
            )
          : null;

      return {
        roomId: room._id,
        roomName: room.name,
        joinedAt: membership.joinedAt,
        lastActivityAt: room.lastActivityAt,
        issuesCompleted: completedIssues.length,
        totalStoryPoints,
        averageAgreement,
      };
    })
  );

  // Sort by most recent activity
  return summaries.sort((a, b) => b.lastActivityAt - a.lastActivityAt);
}

/**
 * Gets agreement trend data points across all user's sessions
 */
export async function getAgreementTrend(
  ctx: QueryCtx,
  authUserId: string,
  dateRange?: DateRange
): Promise<AgreementDataPoint[]> {
  const membershipsWithRooms = await getUserMemberships(ctx, authUserId);

  // Collect all completed issues with timestamps
  const dataPoints: AgreementDataPoint[] = [];

  for (const { room } of membershipsWithRooms) {
    const issues = await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    for (const issue of issues) {
      if (
        issue.status === "completed" &&
        issue.votedAt &&
        issue.voteStats?.agreement !== undefined
      ) {
        // Apply date range filter
        if (dateRange) {
          if (issue.votedAt < dateRange.from || issue.votedAt > dateRange.to) {
            continue;
          }
        }

        dataPoints.push({
          date: new Date(issue.votedAt).toISOString().split("T")[0],
          timestamp: issue.votedAt,
          agreement: issue.voteStats.agreement,
          issueTitle: issue.title,
          roomName: room.name,
        });
      }
    }
  }

  // Sort by timestamp
  return dataPoints.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Gets velocity data (story points per day)
 */
export async function getVelocityStats(
  ctx: QueryCtx,
  authUserId: string,
  dateRange?: DateRange
): Promise<VelocityDataPoint[]> {
  const membershipsWithRooms = await getUserMemberships(ctx, authUserId);

  // Group by date
  const byDate: Record<string, { storyPoints: number; issueCount: number }> =
    {};

  for (const { room } of membershipsWithRooms) {
    const issues = await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    for (const issue of issues) {
      if (issue.status === "completed" && issue.votedAt && issue.finalEstimate) {
        // Apply date range filter
        if (dateRange) {
          if (issue.votedAt < dateRange.from || issue.votedAt > dateRange.to) {
            continue;
          }
        }

        const storyPoints = parseFloat(issue.finalEstimate);
        if (isNaN(storyPoints)) continue;

        const date = new Date(issue.votedAt).toISOString().split("T")[0];
        if (!byDate[date]) {
          byDate[date] = { storyPoints: 0, issueCount: 0 };
        }
        byDate[date].storyPoints += storyPoints;
        byDate[date].issueCount += 1;
      }
    }
  }

  // Convert to array and sort
  return Object.entries(byDate)
    .map(([date, data]) => ({
      date,
      storyPoints: data.storyPoints,
      issueCount: data.issueCount,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Gets distribution of final estimates (vote values)
 */
export async function getVoteDistribution(
  ctx: QueryCtx,
  authUserId: string,
  dateRange?: DateRange
): Promise<VoteDistributionItem[]> {
  const membershipsWithRooms = await getUserMemberships(ctx, authUserId);

  // Count occurrences of each final estimate
  const counts: Record<string, number> = {};
  let total = 0;

  for (const { room } of membershipsWithRooms) {
    const issues = await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    for (const issue of issues) {
      if (issue.status === "completed" && issue.finalEstimate) {
        // Apply date range filter
        if (dateRange && issue.votedAt) {
          if (issue.votedAt < dateRange.from || issue.votedAt > dateRange.to) {
            continue;
          }
        }

        counts[issue.finalEstimate] = (counts[issue.finalEstimate] || 0) + 1;
        total += 1;
      }
    }
  }

  // Convert to array with percentages
  const distribution = Object.entries(counts).map(([value, count]) => ({
    value,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));

  // Sort by count descending
  return distribution.sort((a, b) => b.count - a.count);
}

/**
 * Gets overall participation statistics
 */
export async function getParticipationStats(
  ctx: QueryCtx,
  authUserId: string,
  dateRange?: DateRange
): Promise<ParticipationStats> {
  // Find global user
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", authUserId))
    .first();

  if (!user) {
    return {
      totalSessions: 0,
      totalIssuesVoted: 0,
      totalVotesCast: 0,
      averageVotesPerSession: 0,
    };
  }

  const membershipsWithRooms = await getUserMemberships(ctx, authUserId);

  // Filter by date range if provided
  const filteredMemberships = dateRange
    ? membershipsWithRooms.filter(
        ({ membership }) =>
          membership.joinedAt >= dateRange.from &&
          membership.joinedAt <= dateRange.to
      )
    : membershipsWithRooms;

  const totalSessions = filteredMemberships.length;

  // Count issues with votes from this user
  let totalIssuesVoted = 0;
  let totalVotesCast = 0;

  for (const { room } of filteredMemberships) {
    // Count completed issues in this room
    const issues = await ctx.db
      .query("issues")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    const completedIssues = issues.filter((i) => {
      if (i.status !== "completed") return false;
      if (dateRange && i.votedAt) {
        return i.votedAt >= dateRange.from && i.votedAt <= dateRange.to;
      }
      return true;
    });

    totalIssuesVoted += completedIssues.length;

    // Note: We can't track individual vote participation per-issue
    // since votes are cleared after each round. We can only count total completed.
    totalVotesCast += completedIssues.length;
  }

  return {
    totalSessions,
    totalIssuesVoted,
    totalVotesCast,
    averageVotesPerSession:
      totalSessions > 0 ? Math.round(totalVotesCast / totalSessions) : 0,
  };
}

/**
 * Gets summary statistics for the dashboard header
 */
export async function getDashboardSummary(
  ctx: QueryCtx,
  authUserId: string,
  dateRange?: DateRange
): Promise<{
  totalSessions: number;
  totalIssuesEstimated: number;
  totalStoryPoints: number | null;
  averageAgreement: number | null;
}> {
  const sessions = await getUserSessions(ctx, authUserId, dateRange);

  const totalSessions = sessions.length;
  const totalIssuesEstimated = sessions.reduce(
    (sum, s) => sum + s.issuesCompleted,
    0
  );

  // Sum story points (only if we have numeric data)
  const sessionsWithPoints = sessions.filter((s) => s.totalStoryPoints !== null);
  const totalStoryPoints =
    sessionsWithPoints.length > 0
      ? sessionsWithPoints.reduce((sum, s) => sum + (s.totalStoryPoints ?? 0), 0)
      : null;

  // Average agreement across all sessions
  const sessionsWithAgreement = sessions.filter(
    (s) => s.averageAgreement !== null
  );
  const averageAgreement =
    sessionsWithAgreement.length > 0
      ? Math.round(
          sessionsWithAgreement.reduce(
            (sum, s) => sum + (s.averageAgreement ?? 0),
            0
          ) / sessionsWithAgreement.length
        )
      : null;

  return {
    totalSessions,
    totalIssuesEstimated,
    totalStoryPoints,
    averageAgreement,
  };
}
