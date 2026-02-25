# Epic 8: Data Exports (Enhanced)

> Enhances the existing CSV export with richer analytics data and additional formats.

## Dependencies

- Epic 0 (Permanent Accounts)

> During Phase 1 this export enhancement is shipped to all users. Pro packaging is enforced later in Epic 2.

## Context

The project already has a basic export query (`convex/issues.ts` -> `getForExport`) that returns `ExportableIssue[]` with: title, finalEstimate, status, votedAt, average, median, agreement, voteCount, and notes.

This epic adds richer export fields. Gating by room Pro is deferred to Epic 2.

## Tasks

### 8.1 Backend: Enhanced export query

**File:** `convex/model/issues.ts`

Extend `getIssuesForExport` to include Pro data when available:

```typescript
export interface EnhancedExportableIssue extends ExportableIssue {
  // Pro fields (Epic 3)
  timeToConsensusMs: number | null;
  timeToConsensusFormatted: string | null;  // "2m 34s"
  votingRounds: number | null;

  // Pro fields (Epic 4) - individual votes
  individualVotes: Array<{
    userName: string;
    vote: string;
    deltaFromConsensus: number | null;
  }> | null;

  // Pro fields (Epic 6/7) - integration link
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

    const basicExport = await Issues.getIssuesForExport(ctx, args.roomId);
    // In Phase 1 this is available to all users.
    // Epic 2 later applies room-owner Pro packaging.
    return await Issues.enrichExportWithProData(ctx, args.roomId, basicExport);
  },
});
```

---

### 8.2 Frontend: Enhanced CSV generation

**File:** `src/lib/export-csv.ts`

Update CSV generation to include richer columns (tier packaging applied later in Epic 2):

```typescript
export function generateCSV(
  issues: EnhancedExportableIssue[],
  includeEnhancedColumns: boolean
): string {
  const baseHeaders = [
    "Issue", "Final Estimate", "Status", "Voted At",
    "Average", "Median", "Agreement %", "Vote Count", "Notes"
  ];

  const proHeaders = includeEnhancedColumns
    ? [
        "Time to Consensus", "Voting Rounds",
        "Individual Votes", "External Link"
      ]
    : [];

  const headers = [...baseHeaders, ...proHeaders];

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

    const proRow = includeEnhancedColumns
      ? [
          issue.timeToConsensusFormatted ?? "",
          issue.votingRounds?.toString() ?? "",
          issue.individualVotes
            ?.map((v) => `${v.userName}: ${v.vote}`)
            .join("; ") ?? "",
          issue.externalUrl ?? "",
        ]
      : [];

    return [...baseRow, ...proRow];
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
- In Phase 1: show enhanced export for all users
- In Phase 4 (Epic 2): apply room-owner Pro packaging

Add a visual indicator showing Pro columns are included.

---

### 8.4 Frontend: JSON export option

**File:** `src/lib/export-json.ts`

Add a JSON export format (packaging by tier is applied in Epic 2):

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
- Enhanced CSV includes time-to-consensus, individual votes, and external links
- JSON export works for enhanced issue payloads
- Export correctly handles missing data (empty fields, not errors)
- Individual votes column formats cleanly in CSV
- No Pro gating added in this phase
