# Epic 9: Automated Summaries

> Automatically generates and sends session summaries when a planning poker room is closed.

## Dependencies

- Epic 2 (Premium Gating)
- Epic 8 (Data Exports) - reuses enriched issue data

## Tasks

### 9.1 Schema: Summary and notification tables

**File:** `convex/schema.ts`

```typescript
sessionSummaries: defineTable({
  roomId: v.id("rooms"),
  generatedAt: v.number(),
  // Summary content
  totalIssues: v.number(),
  completedIssues: v.number(),
  totalStoryPoints: v.optional(v.number()),
  averageAgreement: v.optional(v.number()),
  averageTimeToConsensus: v.optional(v.number()),  // ms
  longestDiscussedIssue: v.optional(v.object({
    title: v.string(),
    durationMs: v.number(),
  })),
  // Delivery status
  emailsSent: v.number(),
  emailsFailed: v.number(),
})
  .index("by_room", ["roomId"]),

notificationPreferences: defineTable({
  userId: v.id("users"),
  emailSessionSummaries: v.boolean(),   // Receive session summaries
  emailAddress: v.optional(v.string()), // Override email (for anonymous users)
})
  .index("by_userId", ["userId"]),
```

---

### 9.2 Backend: Room close event

**File:** `convex/model/rooms.ts`

Add a "close room" mutation that triggers summary generation:

```typescript
export async function closeRoom(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms"> }
) {
  const room = await ctx.db.get(args.roomId);
  if (!room) throw new Error("Room not found");

  // Mark room as closed
  await ctx.db.patch(args.roomId, {
    closedAt: Date.now(),
    isGameOver: true,
  });

  // Schedule summary generation (runs asynchronously)
  await ctx.scheduler.runAfter(0, internal.summaries.generateAndSend, {
    roomId: args.roomId,
  });
}
```

> Note: Add `closedAt: v.optional(v.number())` to the rooms table.

---

### 9.3 Backend: Summary generation action

**File:** `convex/summaries.ts`

```typescript
export const generateAndSend = internalAction({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    // 1. Fetch room data + all issues
    const room = await ctx.runQuery(internal.rooms.getInternal, { roomId });
    const issues = await ctx.runQuery(internal.issues.getForEnhancedExport, { roomId });
    const members = await ctx.runQuery(internal.users.getRoomMembers, { roomId });

    // 2. Compute summary stats
    const completedIssues = issues.filter((i) => i.status === "completed");
    const totalPoints = completedIssues.reduce(
      (sum, i) => sum + (parseFloat(i.finalEstimate ?? "0") || 0), 0
    );
    const avgAgreement = completedIssues.length > 0
      ? completedIssues.reduce((sum, i) => sum + (i.agreement ?? 0), 0) / completedIssues.length
      : null;

    // Find longest discussed issue (requires Epic 3 data)
    const longestIssue = completedIssues
      .filter((i) => i.timeToConsensusMs)
      .sort((a, b) => (b.timeToConsensusMs ?? 0) - (a.timeToConsensusMs ?? 0))[0];

    // 3. Store summary
    await ctx.runMutation(internal.summaries.storeSummary, {
      roomId,
      totalIssues: issues.length,
      completedIssues: completedIssues.length,
      totalStoryPoints: totalPoints || undefined,
      averageAgreement: avgAgreement ?? undefined,
      longestDiscussedIssue: longestIssue
        ? { title: longestIssue.title, durationMs: longestIssue.timeToConsensusMs! }
        : undefined,
    });

    // 4. Send emails to participants
    const html = buildSummaryEmailHtml({
      roomName: room.name,
      totalIssues: issues.length,
      completedIssues: completedIssues.length,
      totalPoints,
      avgAgreement,
      longestIssue,
      reportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/sessions`,
    });

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const member of members) {
      const prefs = await ctx.runQuery(internal.summaries.getNotificationPrefs, {
        userId: member.userId,
      });

      // Skip if user opted out or has no email
      if (prefs && !prefs.emailSessionSummaries) continue;
      const email = prefs?.emailAddress ?? member.email;
      if (!email) continue;

      try {
        await sendEmail({
          to: email,
          subject: `Session Summary: ${room.name}`,
          html,
        });
        emailsSent++;
      } catch (error) {
        console.error(`Failed to send summary to ${email}:`, error);
        emailsFailed++;
      }
    }

    // 5. Update summary with delivery stats
    await ctx.runMutation(internal.summaries.updateDeliveryStats, {
      roomId,
      emailsSent,
      emailsFailed,
    });
  },
});
```

---

### 9.4 Backend: Email sending utility

**File:** `convex/lib/email.ts`

Use SendGrid or Resend for transactional email:

```typescript
export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY!;

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: args.to }] }],
      from: {
        email: process.env.EMAIL_FROM_ADDRESS ?? "noreply@agilekit.app",
        name: "AgileKit",
      },
      subject: args.subject,
      content: [{ type: "text/html", value: args.html }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Email send failed: ${response.status}`);
  }
}
```

---

### 9.5 Backend: Email HTML template

**File:** `convex/lib/email-templates.ts`

Build a clean, responsive HTML email template:

```typescript
export function buildSummaryEmailHtml(data: {
  roomName: string;
  totalIssues: number;
  completedIssues: number;
  totalPoints: number;
  avgAgreement: number | null;
  longestIssue: { title: string; durationMs: number } | undefined;
  reportUrl: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 32px;">
        <h1 style="font-size: 20px;">Session Summary: ${data.roomName}</h1>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">Issues Estimated</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
              ${data.completedIssues} / ${data.totalIssues}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">Total Story Points</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
              ${data.totalPoints}
            </td>
          </tr>
          ${data.avgAgreement !== null ? `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">Average Agreement</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
              ${Math.round(data.avgAgreement)}%
            </td>
          </tr>
          ` : ""}
          ${data.longestIssue ? `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">Longest Discussion</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
              ${data.longestIssue.title} (${formatDuration(data.longestIssue.durationMs)})
            </td>
          </tr>
          ` : ""}
        </table>

        <a href="${data.reportUrl}"
           style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">
          View Full Report
        </a>

        <p style="margin-top: 32px; font-size: 12px; color: #666;">
          You received this because you participated in this planning session on AgileKit.
          <a href="${data.reportUrl}/../settings">Manage notification preferences</a>
        </p>
      </div>
    </body>
    </html>
  `;
}
```

---

### 9.6 Frontend: Close room action

**File:** `src/components/room/session-node.tsx` (or room settings)

Add a "Close Session" button that:
1. Confirms with the user ("This will end the session and send a summary to all participants")
2. Calls the `closeRoom` mutation
3. Shows a toast: "Session closed. Summary emails will be sent shortly."

Only available to the room creator.

---

### 9.7 Frontend: Notification preferences

**File:** `src/app/settings/notifications/page.tsx`

Settings page where users can:
- Toggle session summary emails on/off
- Set preferred email address (important for anonymous users)

---

### 9.8 Frontend: Summary history

**File:** `src/app/dashboard/sessions/[roomId]/summary.tsx`

View generated summaries for past sessions:
- Same content as the email, but rendered in the app
- Link from session history list
- Shows delivery status (X emails sent, Y failed)

---

### 9.9 Cron: Pending summaries check

For cases where a room is abandoned (no explicit "close"), add a cron that checks for rooms with no activity for 24+ hours and generates summaries:

```typescript
// convex/crons.ts
crons.interval("send-pending-summaries", { minutes: 30 },
  internal.summaries.checkAndSendPending
);
```

Logic:
1. Find rooms where `lastActivityAt` < 24 hours ago AND `closedAt` is not set
2. Auto-close those rooms
3. Generate and send summaries

**Acceptance criteria for the entire epic:**
- Closing a room triggers automatic summary generation
- Summary email is sent to all participants with valid emails
- Email contains: issue count, points, agreement, longest discussion, report link
- Users can opt out of summary emails
- Summary is viewable in the dashboard for historical reference
- Abandoned rooms get auto-summarized after 24h inactivity
- Email sending failures are logged but don't block summary storage
