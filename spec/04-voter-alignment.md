# Epic 4: Voter Alignment Matrix

> Tracks individual voting patterns relative to consensus, helping teams identify knowledge gaps and coaching opportunities.

## Dependencies

- Epic 0 (Permanent Accounts)

> During Phase 1 this feature is implemented without Pro gating. Room-owner Pro filtering is applied later in Epic 2.

## Tasks

### 4.1 Schema: Add individual vote history

**File:** `convex/schema.ts`

Currently, `votes` are cleared on each game reset. To build alignment analytics, we need to persist historical votes:

```typescript
individualVotes: defineTable({
  roomId: v.id("rooms"),
  issueId: v.id("issues"),
  userId: v.id("users"),
  cardLabel: v.string(),            // The user's initial vote
  cardValue: v.optional(v.number()), // Numeric value if applicable
  consensusLabel: v.optional(v.string()),  // Final consensus value
  consensusValue: v.optional(v.number()),
  deltaSteps: v.optional(v.number()), // Steps above/below consensus on scale
  votedAt: v.number(),
})
  .index("by_issue", ["issueId"])
  .index("by_user", ["userId"])
  .index("by_room_user", ["roomId", "userId"])
  .index("by_room", ["roomId"]),
```

**Why a separate table?** The existing `votes` table is a "current round" scratch space that gets cleared. `individualVotes` is the permanent historical record.

---

### 4.2 Backend: Snapshot votes on reveal

**File:** `convex/model/votes.ts`

When cards are revealed (`showRoomCards`), snapshot all current votes into `individualVotes`:

```typescript
export async function snapshotVotesForHistory(
  ctx: MutationCtx,
  args: {
    roomId: Id<"rooms">;
    issueId: Id<"issues">;
    consensusLabel?: string;
    consensusValue?: number;
    votingScale: VotingScale;
  }
) {
  const votes = await ctx.db
    .query("votes")
    .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
    .collect();

  const now = Date.now();
  const scaleCards = args.votingScale.cards;

  for (const vote of votes) {
    if (!vote.cardLabel || vote.cardLabel === "?" || vote.cardLabel === "☕") {
      continue; // Skip pass/coffee
    }

    // Calculate delta steps on the voting scale
    let deltaSteps: number | undefined;
    if (args.consensusLabel && args.votingScale.isNumeric) {
      const voteIndex = scaleCards.indexOf(vote.cardLabel);
      const consensusIndex = scaleCards.indexOf(args.consensusLabel);
      if (voteIndex !== -1 && consensusIndex !== -1) {
        deltaSteps = voteIndex - consensusIndex;
        // Positive = voted higher, negative = voted lower
      }
    }

    await ctx.db.insert("individualVotes", {
      roomId: args.roomId,
      issueId: args.issueId,
      userId: vote.userId,
      cardLabel: vote.cardLabel,
      cardValue: vote.cardValue,
      consensusLabel: args.consensusLabel,
      consensusValue: args.consensusValue,
      deltaSteps,
      votedAt: now,
    });
  }
}
```

**When to call:** Call this from `completeIssueVoting()`, **not** from `showRoomCards()`. The reveal step shows votes but doesn't establish consensus — the facilitator sets the final estimate afterward via `completeIssueVoting()`. Snapshotting at completion ensures `consensusLabel`/`consensusValue` are always populated.

If the team uses auto-complete (consensus is calculated at reveal time), the snapshot still happens at the same logical point since `completeIssueVoting()` is called immediately after reveal in that flow.

---

### 4.3 Backend: Alignment analytics queries

**File:** `convex/model/analytics.ts`

```typescript
export interface VoterAlignmentData {
  users: Array<{
    userId: Id<"users">;
    userName: string;
    totalVotes: number;
    agreesWithConsensus: number;     // Exact match count
    agreementRate: number;           // Percentage
    averageDelta: number;            // Average steps above/below
    tendency: "under" | "aligned" | "over";  // Overall tendency
  }>;
  // For scatter plot
  scatterPoints: Array<{
    userId: Id<"users">;
    userName: string;
    x: number;  // Average delta (negative = under, positive = over)
    y: number;  // Consistency (std deviation of deltas)
  }>;
}

export async function getVoterAlignment(
  ctx: QueryCtx,
  args: { userId: Id<"users">; dateRange?: DateRange }
): Promise<VoterAlignmentData> {
  // 1. Get all rooms for args.userId
  // 2. Get all individualVotes for those rooms
  // 3. Group by userId
  // 4. For each user: compute agreement rate, average delta, tendency
  // 5. Build scatter plot data points
}
```

**Individual stats query** (for viewing a specific team member's profile):

```typescript
export async function getIndividualVotingStats(
  ctx: QueryCtx,
  args: { targetUserId: Id<"users">; roomIds: Id<"rooms">[] }
): Promise<{
  agreementRate: number;
  averageDeltaLabel: string;  // e.g., "+1 step above consensus"
  totalVotes: number;
  voteHistory: Array<{
    issueTitle: string;
    userVote: string;
    consensus: string;
    delta: number;
    date: string;
  }>;
}> {
  // ...
}
```

---

### 4.4 Frontend: Alignment radar / scatter plot

**File:** `src/components/dashboard/voter-alignment-chart.tsx`

A scatter plot where:
- **X-axis:** Average delta from consensus (left = under-estimates, right = over-estimates)
- **Y-axis:** Consistency / standard deviation (top = inconsistent, bottom = consistent)
- **Each dot:** One team member, labeled with name
- **Color zones:** Green center (aligned), yellow edges (slight bias), red corners (significant bias)

Use a charting library already available in the project, or add a lightweight one (e.g., Recharts).

---

### 4.5 Frontend: Individual stats cards

**File:** `src/components/dashboard/individual-stats.tsx`

For each team member who participated across sessions, show:
- Agreement rate badge (e.g., "Agrees with consensus 80% of the time")
- Average delta label (e.g., "Averages +1 point above consensus")
- Tendency indicator (under / aligned / over)
- Mini sparkline of recent deltas

These cards could be displayed as a grid or table below the scatter plot.

---

### 4.6 Privacy consideration

The alignment matrix shows relative performance across team members. Add a disclaimer:

> "Alignment data is intended for coaching and self-improvement, not performance evaluation."

Scope decision for initial release:
- No room-level opt-in toggle yet (deferred)
- Data is visible to room participants per current analytics policy
- If abuse concerns appear, add room-level privacy controls in a future epic

**Acceptance criteria for the entire epic:**
- Every vote is persisted in `individualVotes` when cards are revealed
- Scatter plot correctly positions users by their voting tendency
- Individual stats accurately reflect agreement rate and delta
- Pass/coffee votes are excluded from calculations
- Non-numeric scales show agreement rate but skip delta calculations
- No Pro gating added in this phase
