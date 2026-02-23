# Epic 5: Sprint Predictability Score

> Aggregates estimation data across sessions to measure team estimation accuracy and capacity trends.

## Dependencies

- Epic 3 (Time-to-Consensus) - uses time data
- Epic 4 (Voter Alignment) - uses historical vote data

## Tasks

### 5.1 Backend: Sprint/session aggregation

**File:** `convex/model/analytics.ts`

Build on existing `getVelocityStats` to compute predictability metrics:

```typescript
export interface PredictabilityData {
  // Overall health score (0-100)
  predictabilityScore: number;

  // Velocity trend
  sessions: Array<{
    roomName: string;
    date: string;
    estimatedPoints: number;
    issueCount: number;
    averageAgreement: number;
    averageTimeToConsensus: number;
  }>;

  // Capacity insights
  averageVelocityPerSession: number;
  velocityTrend: "increasing" | "stable" | "decreasing";

  // Estimation quality
  averageAgreement: number;
  agreementTrend: "improving" | "stable" | "declining";
}

export async function getPredictabilityScore(
  ctx: QueryCtx,
  args: { authUserId: string; dateRange?: DateRange }
): Promise<PredictabilityData> {
  // 1. Get all rooms user participated in (within date range)
  // 2. For each room, aggregate: total points, issue count, avg agreement
  // 3. Compute velocity trend (linear regression or simple comparison)
  // 4. Compute agreement trend
  // 5. Calculate predictability score:
  //    - High agreement + consistent velocity = high score
  //    - Formula: (avgAgreement * 0.6) + (velocityConsistency * 0.4)
}
```

**Predictability score formula:**

```
velocityConsistency = 1 - (stdDev(velocityPerSession) / mean(velocityPerSession))
predictabilityScore = (averageAgreement * 0.6 + velocityConsistency * 100 * 0.4)
```

Clamped to 0-100.

---

### 5.2 Backend: Expose query

**File:** `convex/analytics.ts`

```typescript
export const getPredictability = query({
  args: { authUserId: v.string(), dateRange: v.optional(dateRangeValidator) },
  handler: async (ctx, args) => {
    const user = await Users.getUserByAuthId(ctx, args.authUserId);
    if (!user) return null;
    await Subscriptions.requirePremium(ctx, user._id);
    return await Analytics.getPredictabilityScore(ctx, args);
  },
});
```

---

### 5.3 Frontend: Predictability health gauge

**File:** `src/components/dashboard/predictability-gauge.tsx`

A gauge/donut visualization showing the score 0-100:
- **0-40:** Red - "Needs Improvement"
- **41-70:** Yellow - "Getting There"
- **71-100:** Green - "Healthy"

Display the score prominently with a label and a brief explanation.

---

### 5.4 Frontend: Velocity trend chart

**File:** `src/components/dashboard/velocity-trend.tsx`

Enhance the existing velocity chart to show:
- Bar chart: estimated points per session (already exists as `VelocityChart`)
- Overlay line: rolling average (new)
- Trend indicator: arrow showing if velocity is increasing/stable/decreasing

---

### 5.5 Future: External data integration

> **Not in initial scope.** This task is a placeholder for when Jira/GitHub integrations (Epics 6-7) are complete.

Once integrations exist, the predictability score can compare:
- **Estimated points** (from AgileKit sessions)
- **Completed points** (from Jira sprint reports or GitHub project data)

This would make the score a true measure of estimation accuracy rather than just estimation consistency.

**Acceptance criteria for the entire epic:**
- Predictability score computes correctly from session data
- Score reflects both agreement quality and velocity consistency
- Dashboard displays gauge, trend chart, and session breakdown
- All queries are premium-gated
- Score degrades gracefully with limited data (< 3 sessions shows "Not enough data")
