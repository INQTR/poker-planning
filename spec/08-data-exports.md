# Epic 8: Data Exports (Enhanced)

> Enhances the existing CSV export with premium-only analytics data and additional formats.

## Dependencies

- Epic 2 (Premium Gating) - enhanced export is premium-only

## Context

The project already has a basic export query (`convex/issues.ts` -> `getForExport`) that returns `ExportableIssue[]` with: title, finalEstimate, status, votedAt, average, median, agreement, voteCount, and notes.

This epic enhances exports for premium users.

## Tasks

### 8.1 Backend: Enhanced export query

**File:** `convex/model/issues.ts`

Extend `getIssuesForExport` to include premium data when available:

```typescript
export interface EnhancedExportableIssue extends ExportableIssue {
  // Premium fields (Epic 3)
  timeToConsensusMs: number | null;
  timeToConsensusFormatted: string | null;  // "2m 34s"
  votingRounds: number | null;

  // Premium fields (Epic 4) - individual votes
  individualVotes: Array<{
    userName: string;
    vote: string;
    deltaFromConsensus: number | null;
  }> | null;

  // Premium fields (Epic 6/7) - integration link
  externalUrl: string | null;
  externalId: string | null;
}
```

**File:** `convex/issues.ts`

```typescript
export const getForEnhancedExport = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await Users.getUserByAuthId(ctx, identity.subject);
    const isPremium = user?.subscriptionTier === "premium";

    const basicExport = await Issues.getIssuesForExport(ctx, args.roomId);

    if (!isPremium) return basicExport;

    // Enrich with premium data
    return await Issues.enrichExportWithPremiumData(ctx, args.roomId, basicExport);
  },
});
```

---

### 8.2 Frontend: Enhanced CSV generation

**File:** `src/lib/export-csv.ts`

Update CSV generation to include new columns for premium users:

```typescript
export function generateCSV(
  issues: EnhancedExportableIssue[],
  isPremium: boolean
): string {
  const baseHeaders = [
    "Issue", "Final Estimate", "Status", "Voted At",
    "Average", "Median", "Agreement %", "Vote Count", "Notes"
  ];

  const premiumHeaders = isPremium
    ? [
        "Time to Consensus", "Voting Rounds",
        "Individual Votes", "External Link"
      ]
    : [];

  const headers = [...baseHeaders, ...premiumHeaders];

  const rows = issues.map((issue) => {
    const baseRow = [
      issue.title,
      issue.finalEstimate ?? "",
      issue.status,
      issue.votedAt ?? "",
      issue.average?.toString() ?? "",
      issue.median?.toString() ?? "",
      issue.agreement?.toString() ?? "",
      issue.voteCount?.toString() ?? "",
      issue.notes ?? "",
    ];

    const premiumRow = isPremium
      ? [
          issue.timeToConsensusFormatted ?? "",
          issue.votingRounds?.toString() ?? "",
          issue.individualVotes
            ?.map((v) => `${v.userName}: ${v.vote}`)
            .join("; ") ?? "",
          issue.externalUrl ?? "",
        ]
      : [];

    return [...baseRow, ...premiumRow];
  });

  return [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\n");
}
```

---

### 8.3 Frontend: Export button enhancement

**File:** `src/components/room/issues-panel.tsx` (or wherever export is triggered)

Update the existing export button:
- Free users: Basic CSV (current behavior)
- Premium users: Enhanced CSV with all analytics data

Add a visual indicator showing premium columns are included.

---

### 8.4 Frontend: JSON export option (premium)

**File:** `src/lib/export-json.ts`

Premium users get an additional JSON export format:

```typescript
export function generateJSON(issues: EnhancedExportableIssue[]): string {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    issueCount: issues.length,
    issues,
  }, null, 2);
}
```

Add a dropdown or toggle to the export button: "Export as CSV" / "Export as JSON".

**Acceptance criteria for the entire epic:**
- Free users can still export basic CSV (no regression)
- Premium users get enhanced CSV with time-to-consensus, individual votes, and external links
- Premium users can choose between CSV and JSON formats
- Export correctly handles missing data (empty fields, not errors)
- Individual votes column formats cleanly in CSV
