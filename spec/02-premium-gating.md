# Epic 2: Pro Gating

> Introduces room-owner based Pro entitlement, feature gating, and retention warnings across frontend and backend.

## Dependencies

- Epic 0 (Permanent Accounts) - Pro and grandfathering apply only to permanent accounts
- Epic 1 (Subscription Infrastructure) - Paddle subscription + grandfathering state must exist
- Room permissions model with `rooms.ownerId` (ownership transfer already supported)

## Product Rules (Locked)

1. Pro entitlement is based on **room owner subscription**, not per-user subscription.
2. During Phases 1-3, features are built and shipped **without gating**.
3. In Phase 4, Pro analytics/integrations are enabled only for rooms whose owner has Pro access.
4. Existing permanent accounts at launch get 6 months grandfathering.
5. Free retention is 5 days.
6. If a room owner loses Pro access, they get a 14-day grace window. After grace, data older than 5 days is removed.
7. Pro room access remains active while owner is absent; it changes only when ownership changes.
8. Non-owner participants can view Pro analytics in their own dashboard for Pro rooms (initial policy).
9. Warning and conversion events must be tracked for rollout tuning.

---

## Tasks

### 2.1 Backend: Entitlement helpers (user + room)

**File:** `convex/model/subscriptions.ts`

Create helpers that model room-owner entitlement and grace windows:

```typescript
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

export async function getUserProState(
  ctx: Ctx,
  userId: Id<"users">
): Promise<{
  isPro: boolean;
  isGrandfathered: boolean;
  isInGrace: boolean;
  graceUntil: number | null;
}> {
  const user = await ctx.db.get(userId);
  if (!user) {
    return { isPro: false, isGrandfathered: false, isInGrace: false, graceUntil: null };
  }

  const now = Date.now();
  const isGrandfathered =
    !!user.grandfatheredUntil && user.grandfatheredUntil > now;
  const isPro = user.subscriptionTier === "pro" || isGrandfathered;
  const graceUntil = user.proGraceUntil ?? null;
  const isInGrace = !isPro && !!graceUntil && graceUntil > now;

  return { isPro, isGrandfathered, isInGrace, graceUntil };
}

export async function getRoomProState(
  ctx: Ctx,
  roomId: Id<"rooms">
): Promise<{
  enabled: boolean;
  ownerId: Id<"users"> | null;
  source: "owner_pro" | "owner_grace" | "free_room";
  graceUntil: number | null;
}> {
  const room = await ctx.db.get(roomId);
  if (!room?.ownerId) {
    return { enabled: false, ownerId: null, source: "free_room", graceUntil: null };
  }

  const ownerState = await getUserProState(ctx, room.ownerId);
  if (ownerState.isPro) {
    return { enabled: true, ownerId: room.ownerId, source: "owner_pro", graceUntil: null };
  }
  if (ownerState.isInGrace) {
    return {
      enabled: true,
      ownerId: room.ownerId,
      source: "owner_grace",
      graceUntil: ownerState.graceUntil,
    };
  }

  return { enabled: false, ownerId: room.ownerId, source: "free_room", graceUntil: null };
}

export async function requireRoomPro(ctx: Ctx, roomId: Id<"rooms">) {
  const state = await getRoomProState(ctx, roomId);
  if (!state.enabled) throw new Error("Pro room required");
}
```

**Acceptance criteria:**
- Helper computes Pro based on room owner
- Grace state is recognized via `users.proGraceUntil`
- Ownership transfer immediately changes entitlement source

---

### 2.2 Frontend: Subscription + room entitlement hooks

**Files:** `src/hooks/use-subscription.ts`, `src/hooks/use-room-pro.ts`

- `useSubscription()` exposes:
  - `isPro`, `isGrandfathered`, `isInGrace`, `graceUntil`, `graceDaysLeft`
- `useRoomPro(roomId)` exposes:
  - `isProRoom`, `source`, `ownerId`, `graceUntil`

These hooks are reactive and update after webhooks, owner transfer, and cron updates.

---

### 2.3 Frontend: Pro gate components

**Files:** `src/components/subscription/pro-room-gate.tsx`, `src/components/subscription/pro-gate.tsx`

Use a room-aware gate for room-scoped features:

```tsx
<ProRoomGate roomId={roomId}>
  <ProRoomPanel />
</ProRoomGate>
```

Keep a simple user gate only for account-level actions (e.g., "Manage subscription"), not for room analytics.

---

### 2.4 Frontend: Retention and grace warnings

**Files:** `src/components/subscription/retention-warning-banner.tsx`, dashboard/room integration

Add warnings with explicit timelines:

1. **Non-Pro warning (owner view):**
   - "Without Pro, room analytics older than 5 days will be removed."
2. **Grace warning (owner in grace window):**
   - "Your Pro access ends in X days. After that, data older than 5 days will be removed."
3. **Grandfathering expiry warning (existing behavior):**
   - Show in last 30 days, with stronger copy at 7 days.

Warning placement:
- Dashboard
- Room page for owner
- Pricing page account status panel

---

### 2.5 Frontend: Ownership transfer warning

**File:** ownership transfer confirmation UI in room settings

Before transfer confirmation, show a blocking warning:

> "After transfer, this room's Pro analytics will be excluded from your personal analytics dashboard unless you remain a participant in another Pro room."

Also show:
- New owner receives Pro entitlement control for this room
- Entitlement remains active until ownership changes again
- Analytics exclusion is immediate at transfer time and applies to historical room-owned aggregates for the previous owner

---

### 2.6 Backend: Analytics/query gating policy

**File:** `convex/analytics.ts`

Replace per-user `requirePro` checks with room-aware filtering:

- `getSummary`: always allowed
- `getSessions`:
  - include all sessions for Pro rooms user participated in
  - include only last 5 days for non-Pro rooms
- Pro analytics queries (`getAgreementTrend`, `getVelocityStats`, `getVoteDistribution`, `getParticipationStats`, future Pro queries):
  - include only rooms where `getRoomProState(roomId).enabled === true`
  - return empty datasets when user has no Pro-room history

For initial release, participants (non-owners) can access Pro analytics for Pro rooms they belong to.

---

### 2.7 Navigation/status indicators

Show room-level Pro status in navigation/UI:
- `PRO` badge for rooms with owner Pro access
- `GRACE` badge with days left when owner is in grace
- No badge for free rooms

---

### 2.8 Product telemetry for warnings and conversion

**Files:** analytics/event tracking layer, warning banner components

Track key lifecycle events:
- `pro_warning_shown`
- `pro_warning_dismissed`
- `grace_warning_shown`
- `grace_warning_cta_clicked`
- `ownership_transfer_warning_shown`
- `ownership_transfer_confirmed`
- `upgrade_completed_after_warning`

Event payload minimum:
- `userId`
- `roomId` (if room-scoped)
- `warningType`
- `daysLeft` (for grace/grandfathering)
- timestamp

Use dashboards to monitor:
- warning impression volume
- CTA click-through rate
- warning-to-upgrade conversion rate

---

## Gating Strategy (Phase 4)

| Query | Free Room | Pro Room (owner Pro/grandfathered/grace) |
|-------|-----------|---------------------------------------------------|
| `getSummary` | Yes | Yes |
| `getSessions` | Last 5 days | All history |
| `getAgreementTrend` | No | Yes |
| `getVelocityStats` | No | Yes |
| `getVoteDistribution` | No | Yes |
| `getParticipationStats` | No | Yes |
| `getTimeToConsensus` (Epic 3) | No | Yes |
| `getVoterAlignment` (Epic 4) | No | Yes |
| `getPredictability` (Epic 5) | No | Yes |
| `getForEnhancedExport` (Epic 8) | Basic columns only | All columns |

---

## Feature Flag for Gating

Pro gating is controlled by a **server-side environment variable**: `PRO_GATING_ENABLED`.

- When `"false"` (or unset): all queries return full data regardless of room Pro state. No warnings shown. This is the state during Phases 1-3.
- When `"true"`: room-owner Pro checks are active, retention warnings are shown, and free-room data limits apply.

This flag is checked by the `getRoomProState` helper. When gating is disabled, the helper always returns `{ enabled: true, source: "owner_pro" }`.

**Rollback:** Set `PRO_GATING_ENABLED=false` in Convex env vars. Takes effect immediately (no redeploy needed for Convex env var changes).

---

## Acceptance Criteria (Epic 2)

- Room-owner entitlement is the single source of truth for Pro room access
- Gating is applied only in Phase 4 (not during feature build phases)
- Free retention is enforced as 5 days
- Grace window is 14 days after owner Pro ends
- Warnings are shown for non-Pro/grace owners with explicit data-loss messaging
- Ownership transfer flow includes analytics exclusion warning
- Participants can access Pro analytics for Pro rooms they are in (initial policy)
- Warning and conversion telemetry is captured and queryable
