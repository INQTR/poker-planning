# Epic 2: Premium Gating

> Introduces a reusable system for checking premium status and gating features across both frontend and backend.

## Dependencies

- Epic 1 (Subscription Infrastructure) - `users.subscriptionTier` field must exist

## Tasks

### 2.1 Backend: Premium check helper

**File:** `convex/model/subscriptions.ts`

Create a shared helper used by all premium-gated queries/mutations:

```typescript
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export async function getUserTier(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<"free" | "premium"> {
  const user = await ctx.db.get(userId);
  return user?.subscriptionTier ?? "free";
}

export async function requirePremium(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<void> {
  const tier = await getUserTier(ctx, userId);
  if (tier !== "premium") {
    throw new Error("Premium subscription required");
  }
}

export function isPremiumStatus(
  status: string | undefined
): boolean {
  return ["trialing", "active", "past_due"].includes(status ?? "");
}
```

**Acceptance criteria:**
- `requirePremium()` throws for free users
- `getUserTier()` returns `"free"` for users without `subscriptionTier` field

---

### 2.2 Frontend: Subscription context hook

**File:** `src/hooks/use-subscription.ts`

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSubscription() {
  const data = useQuery(api.paddle.getSubscription);

  return {
    tier: data?.tier ?? "free",
    isPremium: data?.tier === "premium",
    isLoading: data === undefined,
    subscription: data?.subscription ?? null,
  };
}
```

This hook is reactive - it automatically updates when the subscription changes via webhooks.

---

### 2.3 Frontend: Premium gate component

**File:** `src/components/subscription/premium-gate.tsx`

A reusable wrapper that either renders children or shows an upgrade prompt:

```tsx
"use client";
import { useSubscription } from "@/hooks/use-subscription";

interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;  // Custom fallback UI
}

export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const { isPremium, isLoading } = useSubscription();

  if (isLoading) return <Skeleton />;

  if (!isPremium) {
    return fallback ?? <DefaultUpgradePrompt />;
  }

  return <>{children}</>;
}

function DefaultUpgradePrompt() {
  return (
    <div className="...">
      <LockIcon />
      <p>This feature requires a Premium subscription.</p>
      <Link href="/pricing">Upgrade to Premium</Link>
    </div>
  );
}
```

**Usage in any component:**

```tsx
<PremiumGate>
  <VoterAlignmentMatrix />
</PremiumGate>
```

---

### 2.4 Frontend: Gate existing analytics dashboard

**File:** `src/app/dashboard/dashboard-content.tsx`

The dashboard currently requires authentication. Add premium gating:

- **Free users:** Show basic stats (recent session history, total points, average agreement) - keep current `getSummary` and `getSessions` queries available
- **Premium users:** Show all charts (agreement trend, velocity, vote distribution, participation stats)

Wrap premium-only sections with `<PremiumGate>`:

```tsx
{/* Always visible */}
<StatsSummary data={summary} />
<SessionHistory sessions={sessions} />

{/* Premium only */}
<PremiumGate>
  <AgreementChart data={agreementTrend} />
  <VelocityChart data={velocityStats} />
  <VoteDistribution data={voteDistribution} />
</PremiumGate>
```

---

### 2.5 Backend: Gate premium queries

**File:** `convex/analytics.ts`

Add premium checks to analytics queries that should be gated:

```typescript
export const getAgreementTrend = query({
  args: { authUserId: v.string(), dateRange: v.optional(dateRangeValidator) },
  handler: async (ctx, args) => {
    const user = await Users.getUserByAuthId(ctx, args.authUserId);
    if (!user) return [];

    await Subscriptions.requirePremium(ctx, user._id);
    return await Analytics.getAgreementTrend(ctx, args);
  },
});
```

**Gating strategy:**

| Query | Free | Premium |
|-------|------|---------|
| `getSummary` | Yes | Yes |
| `getSessions` | Last 5 days | All history |
| `getAgreementTrend` | No | Yes |
| `getVelocityStats` | No | Yes |
| `getVoteDistribution` | No | Yes |
| `getParticipationStats` | No | Yes |

---

### 2.6 Navigation: Premium badge

Add a small visual indicator in the navigation for premium users (e.g., a "PRO" badge next to the user avatar or dashboard link).

**Acceptance criteria for the entire epic:**
- Free users see basic dashboard with upgrade prompts for gated sections
- Premium users see full dashboard without restrictions
- Backend throws error if free user calls premium-only queries
- `<PremiumGate>` component can be reused across the app
- `useSubscription()` hook reactively reflects tier changes
