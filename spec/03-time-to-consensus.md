# Epic 3: Time-to-Consensus Tracking

> Tracks how long each issue takes to reach consensus, enabling teams to identify estimation bottlenecks.

## Dependencies

- Epic 0 (Permanent Accounts)

> During Phase 1 this feature is implemented **without Pro gating**. Room-owner Pro filtering is applied later in Epic 2.

## Tasks

### 3.1 Schema: Add voting timestamps

**File:** `convex/schema.ts`

Add a `votingTimestamps` table to track when voting starts and ends per issue:

```typescript
votingTimestamps: defineTable({
  roomId: v.id("rooms"),
  issueId: v.id("issues"),
  votingStartedAt: v.number(),           // Date.now() when voting begins
  votingEndedAt: v.optional(v.number()), // Date.now() when consensus reached
  durationMs: v.optional(v.number()),    // Computed: endedAt - startedAt
  roundNumber: v.number(),               // 1 = first vote, 2 = re-vote, etc.
})
  .index("by_issue", ["issueId"])
  .index("by_room", ["roomId"]),
```

Also add `timeToConsensusMs` to the `issues` table `voteStats` object:

```typescript
voteStats: v.optional(v.object({
  average: v.optional(v.number()),
  median: v.optional(v.number()),
  agreement: v.number(),
  voteCount: v.number(),
  timeToConsensusMs: v.optional(v.number()),  // NEW
})),
```

---

### 3.2 Backend: Record voting start timestamp

**File:** `convex/model/issues.ts`

When `startVotingOnIssue()` is called, insert a `votingTimestamps` record:

```typescript
export async function startVotingOnIssue(ctx: MutationCtx, args: {
  roomId: Id<"rooms">;
  issueId: Id<"issues">;
}) {
  // ... existing logic to set issue status to "voting"

  // Count existing rounds for this issue
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
```

---

### 3.3 Backend: Record voting end timestamp

**File:** `convex/model/issues.ts`

When `completeIssueVoting()` is called, update the latest `votingTimestamps` record:

```typescript
export async function completeIssueVoting(ctx: MutationCtx, args: {
  roomId: Id<"rooms">;
  issueId: Id<"issues">;
  finalEstimate: string | undefined;
  voteStats: VoteStats;
}) {
  const now = Date.now();

  // Find the latest (most recent) voting timestamp for this issue
  const timestamps = await ctx.db
    .query("votingTimestamps")
    .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
    .collect();

  const latestTimestamp = timestamps[timestamps.length - 1];
  if (latestTimestamp && !latestTimestamp.votingEndedAt) {
    const durationMs = now - latestTimestamp.votingStartedAt;
    await ctx.db.patch(latestTimestamp._id, {
      votingEndedAt: now,
      durationMs,
    });

    // Total time-to-consensus = sum of all rounds for this issue
    const totalMs = timestamps.reduce((sum, ts) => {
      return sum + (ts.durationMs ?? 0);
    }, 0) + durationMs;

    // Store in voteStats for easy access
    args.voteStats.timeToConsensusMs = totalMs;
  }

  // ... existing logic to patch issue
}
```

---

### 3.4 Backend: Analytics queries for time-to-consensus

**File:** `convex/model/analytics.ts`

Add new analytics functions:

```typescript
// Average time per issue across a user's sessions
export async function getTimeToConsensusStats(
  ctx: QueryCtx,
  args: { userId: Id<"users">; dateRange?: DateRange }
): Promise<{
  averageMs: number | null;
  medianMs: number | null;
  outliers: Array<{
    issueTitle: string;
    roomName: string;
    durationMs: number;
    multiplierVsAverage: number;
  }>;
  trendBySession: Array<{
    date: string;
    roomName: string;
    averageMs: number;
  }>;
}> {
  // 1. Get all rooms for args.userId
  // 2. Get all votingTimestamps for those rooms
  // 3. Compute average, median
  // 4. Identify outliers (> 2x average)
  // 5. Group by room for trend analysis
}
```

**File:** `convex/analytics.ts`

Expose as a standard analytics query in this phase (no Pro checks yet):

```typescript
export const getTimeToConsensus = query({
  args: { dateRange: v.optional(dateRangeValidator) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await Users.getUserByAuthId(ctx, identity.subject);
    if (!user) return null;
    return await Analytics.getTimeToConsensusStats(ctx, {
      userId: user._id,
      dateRange: args.dateRange,
    });
  },
});
```

Epic 2 later applies room-owner Pro filtering.

---

### 3.5 Frontend: Session summary metric

**File:** `src/components/dashboard/time-to-consensus-card.tsx`

A card showing:
- **Average Time per Issue** (formatted as "2m 34s")
- **Trend arrow** (faster/slower vs. previous period)
- **Fastest / Slowest** issue with duration

Add to the dashboard stats summary section.

---

### 3.6 Frontend: Outlier issues chart

**File:** `src/components/dashboard/consensus-outliers.tsx`

A horizontal bar chart highlighting issues that took significantly longer than average:
- Each bar = one issue
- Color-coded: green (< avg), yellow (1-2x avg), red (> 2x avg)
- Shows issue title, room name, and duration
- Hover tooltip shows round count

---

### 3.7 Frontend: Trend analysis chart

**File:** `src/components/dashboard/consensus-trend.tsx`

A line chart showing average time-per-issue over multiple sessions:
- X-axis: session date
- Y-axis: average time (seconds)
- Goal: demonstrate that the team is improving over time

---

### 3.8 Room UX: Live timer display (deferred)

> Out of scope for initial implementation. Keep this as a follow-up item after core analytics ship.

**Acceptance criteria for the entire epic:**
- Voting start/end times are recorded per issue
- Re-votes (reset + re-vote) accumulate into total time
- Dashboard shows average, median, outliers, and trend
- No regression to existing voting flow
- No Pro gating added in this phase
