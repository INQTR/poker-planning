# Epic 1: Subscription Infrastructure (Paddle)

> Introduces Paddle Billing as the payment platform, webhook processing, subscription state management, grandfathering for existing users, and lapsed-subscription grace handling.

## Entitlement Model (Authoritative)

- Pro billing is still per-user in Paddle, but feature entitlement is resolved at the **room owner** level (Epic 2).
- Grandfathering applies only to permanent accounts that exist at launch.
- If a Pro owner lapses, they enter a **14-day grace window** before strict free retention is enforced.
- Free retention is 5 days.

## Grandfathering Policy

When Pro features launch, all existing permanent accounts receive **6 months of free Pro access**. This rewards early adopters and gives them time to evaluate before deciding to subscribe.

**Rules:**
- **Who qualifies:** Users with `accountType === "permanent"` at the time of the deployment migration
- **What they get:** Full Pro access (identical to a paid subscription)
- **Duration:** 6 months from the migration date (same deadline for everyone)
- **After expiry:** Automatic drop to free tier
- **Notifications:** Email at 30 days and 7 days before expiry + in-app banner during the last 30 days

---

## Tasks

### 1.1 Schema: Add subscription tables

**File:** `convex/schema.ts`

Add three new tables:

```typescript
paddleCustomers: defineTable({
  userId: v.id("users"),
  paddleCustomerId: v.string(),
  email: v.string(),
  createdAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_paddleCustomerId", ["paddleCustomerId"]),

subscriptions: defineTable({
  userId: v.id("users"),
  paddleSubscriptionId: v.string(),
  paddleCustomerId: v.string(),
  status: v.union(
    v.literal("trialing"),
    v.literal("active"),
    v.literal("past_due"),
    v.literal("paused"),
    v.literal("canceled")
  ),
  priceId: v.string(),
  productId: v.string(),
  currentPeriodStart: v.optional(v.string()),
  currentPeriodEnd: v.optional(v.string()),
  nextBilledAt: v.optional(v.string()),
  canceledAt: v.optional(v.string()),
  pausedAt: v.optional(v.string()),
  lastEventAt: v.string(),
})
  .index("by_userId", ["userId"])
  .index("by_paddleSubscriptionId", ["paddleSubscriptionId"]),

webhookEvents: defineTable({
  eventId: v.string(),
  eventType: v.string(),
  processedAt: v.number(),
})
  .index("by_eventId", ["eventId"]),

entitlementEvents: defineTable({
  userId: v.id("users"),
  roomId: v.optional(v.id("rooms")),
  eventType: v.union(
    v.literal("owner_changed"),
    v.literal("grandfathering_started"),
    v.literal("grandfathering_expired"),
    v.literal("grace_started"),
    v.literal("grace_cleared"),
    v.literal("retention_cleanup_scheduled"),
    v.literal("retention_cleanup_purged")
  ),
  previousState: v.optional(v.string()),
  nextState: v.optional(v.string()),
  metadata: v.optional(v.any()),
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_room", ["roomId"])
  .index("by_eventType", ["eventType"]),

retentionCleanupJobs: defineTable({
  ownerUserId: v.id("users"),
  scope: v.union(v.literal("analytics"), v.literal("sessions")),
  cutoffAt: v.number(),
  status: v.union(
    v.literal("pending"),
    v.literal("verified"),
    v.literal("purged"),
    v.literal("canceled")
  ),
  pendingDeleteAt: v.number(),
  purgeAfter: v.number(), // Safety buffer before hard delete
  createdAt: v.number(),
  verifiedAt: v.optional(v.number()),
  purgedAt: v.optional(v.number()),
  notes: v.optional(v.string()),
})
  .index("by_owner", ["ownerUserId"])
  .index("by_status", ["status"]),
```

Also add fields to the existing `users` table:

```typescript
users: defineTable({
  // ... existing fields
  subscriptionTier: v.optional(v.union(v.literal("free"), v.literal("pro"))),
  grandfatheredUntil: v.optional(v.number()), // Timestamp when grandfathered access expires
  proGraceUntil: v.optional(v.number()),  // 14-day grace when paid Pro ends
})
```

> **Scaling note:** The grandfathering and grace expiry crons query users by `grandfatheredUntil` / `proGraceUntil` without a dedicated index. Convex doesn't support inequality-range indexes on optional fields well, so these run as filtered full scans. This is acceptable for the expected user count (< 50k). If user count grows significantly, consider adding a `proExpiresAt` indexed field that consolidates both timestamps into a single queryable value.

**Acceptance criteria:**
- Schema deploys successfully with `npx convex dev`
- Existing data is unaffected (new fields are optional)
- Subscription schema includes auditability and cleanup safety tables

---

### 1.2 Backend: Grandfathering migration

**File:** `convex/admin.ts` (or a one-time migration script)

A one-time mutation that runs at Pro launch to grant grandfathered access to all existing permanent accounts:

```typescript
export const grandfatherExistingUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + SIX_MONTHS_MS;

    // Find all permanent accounts
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("accountType"), "permanent"))
      .collect();

    for (const user of users) {
      await ctx.db.patch(user._id, {
        subscriptionTier: "pro",
        grandfatheredUntil: expiresAt,
      });
    }

    return { grandfatheredCount: users.length, expiresAt };
  },
});
```

**Notes:**
- Run once via Convex dashboard or a deploy script
- Not idempotent from a business perspective (re-running extends the window). Guard with a one-time flag or launch checklist.
- Sets the same `grandfatheredUntil` timestamp for all users (single deadline)

**Acceptance criteria:**
- All existing permanent users get `subscriptionTier: "pro"` and `grandfatheredUntil` set
- Anonymous users are not affected
- New permanent accounts created after migration do not get grandfathered

---

### 1.3 Backend: Grandfathering expiry cron

**File:** `convex/crons.ts`, `convex/subscriptions.ts`

A daily cron job that expires grandfathered access:

```typescript
// convex/crons.ts
crons.daily(
  "expire grandfathered users",
  { hourUTC: 8, minuteUTC: 0 },
  internal.subscriptions.expireGrandfatheredUsers
);
```

```typescript
// convex/subscriptions.ts
export const expireGrandfatheredUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find users whose grandfathered period has expired
    // and who don't have an active paid subscription
    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.neq(q.field("grandfatheredUntil"), undefined),
          q.lte(q.field("grandfatheredUntil"), now)
        )
      )
      .collect();

    for (const user of users) {
      // Check latest known subscription event for this user (don't downgrade paying users)
      const subs = await ctx.db
        .query("subscriptions")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect();
      const latestSub = subs.sort(
        (a, b) => new Date(b.lastEventAt).getTime() - new Date(a.lastEventAt).getTime()
      )[0];

      const isPaying = latestSub &&
        ["trialing", "active", "past_due"].includes(latestSub.status);

      if (!isPaying) {
        await ctx.db.patch(user._id, {
          subscriptionTier: "free",
          grandfatheredUntil: undefined, // Clean up
        });
      } else {
        // User subscribed during grandfathering — just remove the flag
        await ctx.db.patch(user._id, {
          grandfatheredUntil: undefined,
        });
      }
    }
  },
});
```

**Acceptance criteria:**
- Grandfathered users are downgraded to free after expiry
- Users who subscribed during grandfathering keep Pro
- Cron runs daily, idempotent

---

### 1.4 Backend: Grandfathering expiry email notifications

**File:** `convex/subscriptions.ts`, `convex/email.ts`

A daily cron job that sends reminder emails at 30 days and 7 days before grandfathering expires:

```typescript
crons.daily(
  "grandfathering expiry reminders",
  { hourUTC: 9, minuteUTC: 0 },
  internal.subscriptions.sendGrandfatheringReminders
);
```

```typescript
export const sendGrandfatheringReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    const users = await ctx.runQuery(internal.subscriptions.getGrandfatheredUsers);

    for (const user of users) {
      if (!user.email || !user.grandfatheredUntil) continue;

      const daysLeft = Math.ceil((user.grandfatheredUntil - now) / (24 * 60 * 60 * 1000));
      const timeLeft = user.grandfatheredUntil - now;

      // Send at ~30 days and ~7 days (within a 1-day window to avoid duplicates from daily cron)
      const shouldNotify30 = timeLeft > THIRTY_DAYS - 24*60*60*1000 && timeLeft <= THIRTY_DAYS;
      const shouldNotify7 = timeLeft > SEVEN_DAYS - 24*60*60*1000 && timeLeft <= SEVEN_DAYS;

      if (shouldNotify30 || shouldNotify7) {
        await ctx.runAction(internal.email.sendGrandfatheringExpiryEmail, {
          to: user.email,
          daysLeft,
        });
      }
    }
  },
});
```

**Email template:** Friendly reminder that their free Pro access ends in X days, with a CTA to subscribe.

**Acceptance criteria:**
- Users receive email at 30 days and 7 days before expiry
- Only users with email addresses are notified
- No duplicate emails (1-day send window)

---

### 1.4b Backend: Lapsed Pro grace + retention cleanup

**Files:** `convex/subscriptions.ts`, `convex/crons.ts`, retention jobs

When webhook status transitions from Pro statuses (`trialing|active|past_due`) to non-Pro statuses (`paused|canceled`):

1. Set `users.proGraceUntil = Date.now() + 14 days`
2. Send warning email explaining:
   - Pro room benefits end after grace
   - data older than 5 days will be removed after grace
3. Show in-app warning via subscription query (Epic 2 UI)
4. After grace expires, schedule cleanup jobs (`retentionCleanupJobs`) with a safety buffer:
   - create `pending` job with cutoff at now - 5 days
   - mark affected records for deletion (`pendingDeleteAt`)
   - keep last 5 days
5. Purge only after safety buffer passes (recommended: 7 days):
   - verify owner is still non-Pro
   - hard-delete marked records
   - write entitlement/cleanup audit events

Cron model:

```typescript
crons.daily(
  "enforce-free-retention-after-grace",
  { hourUTC: 10, minuteUTC: 0 },
  internal.subscriptions.enforceFreeRetentionAfterGrace
);

crons.daily(
  "purge-retention-pending-deletes",
  { hourUTC: 11, minuteUTC: 0 },
  internal.subscriptions.purgeRetentionPendingDeletes
);
```

**Acceptance criteria:**
- Lapsed Pro users always get a 14-day grace window
- Grace warning is available in query payload for frontend banners
- After grace expires, cleanup is scheduled with a safety buffer before hard delete
- Hard delete runs only after buffer and revalidation of non-Pro status
- Re-subscribing during grace clears `proGraceUntil` and stops cleanup
- Cleanup actions are visible in audit events

---

### 1.5 Backend: Paddle webhook endpoint

**Files:** `convex/http.ts`, `convex/paddle.ts`

Register a new HTTP route for Paddle webhooks:

```typescript
// convex/http.ts - add route
http.route({
  path: "/webhooks/paddle",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("paddle-signature");
    const rawBody = await request.text();

    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    await ctx.runAction(internal.paddle.processWebhook, {
      signature,
      rawBody,
    });

    return new Response(null, { status: 200 });
  }),
});
```

**Webhook signature verification** (Web Crypto API, no Node.js dependency):

```typescript
// convex/paddle.ts
function extractSignatureComponents(header: string) {
  const ts = header.match(/ts=(\d+)/)?.[1] ?? "";
  const h1 = header.match(/h1=([a-f0-9]+)/)?.[1] ?? "";
  return { ts, h1 };
}

async function verifyPaddleSignature(
  signatureHeader: string,
  rawBody: string,
  secretKey: string
): Promise<boolean> {
  const { ts, h1 } = extractSignatureComponents(signatureHeader);
  if (!ts || !h1) return false;

  const payload = `${ts}:${rawBody}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex === h1;
}
```

**Event processing** in `convex/paddle.ts`:

```typescript
export const processWebhook = internalAction({
  args: { signature: v.string(), rawBody: v.string() },
  handler: async (ctx, { signature, rawBody }) => {
    const isValid = await verifyPaddleSignature(
      signature, rawBody, process.env.PADDLE_WEBHOOK_SECRET!
    );
    if (!isValid) throw new Error("Invalid Paddle signature");

    const event = JSON.parse(rawBody);

    switch (event.event_type) {
      case "subscription.created":
      case "subscription.activated":
      case "subscription.updated":
      case "subscription.canceled":
      case "subscription.paused":
      case "subscription.resumed":
      case "subscription.past_due":
        await ctx.runMutation(internal.paddle.upsertSubscription, {
          eventId: event.event_id,
          eventType: event.event_type,
          occurredAt: event.occurred_at,
          data: event.data,
        });
        break;
    }
  },
});
```

**Idempotent subscription upsert** mutation:

```typescript
export const upsertSubscription = internalMutation({
  args: {
    eventId: v.string(),
    eventType: v.string(),
    occurredAt: v.string(),
    data: v.any(),
  },
  handler: async (ctx, { eventId, eventType, occurredAt, data }) => {
    // Idempotency: skip if already processed
    const existing = await ctx.db
      .query("webhookEvents")
      .withIndex("by_eventId", (q) => q.eq("eventId", eventId))
      .unique();
    if (existing) return;

    await ctx.db.insert("webhookEvents", {
      eventId, eventType, processedAt: Date.now(),
    });

    // Find existing subscription
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_paddleSubscriptionId", (q) =>
        q.eq("paddleSubscriptionId", data.id)
      )
      .unique();

    // Handle out-of-order events
    if (sub && new Date(occurredAt) <= new Date(sub.lastEventAt)) return;

    // Resolve userId from customData (passed during checkout)
    // Fallback: existing subscription row or paddleCustomers mapping
    const userId =
      (await resolveUserIdFromCustomData(ctx, data.custom_data)) ??
      sub?.userId ??
      (await resolveUserIdFromCustomerId(ctx, data.customer_id));
    if (!userId) {
      console.error("Cannot resolve userId from Paddle webhook data");
      return;
    }

    const subscriptionData = {
      userId,
      paddleSubscriptionId: data.id,
      paddleCustomerId: data.customer_id,
      status: data.status,
      priceId: data.items?.[0]?.price?.id ?? "",
      productId: data.items?.[0]?.price?.product_id ?? "",
      currentPeriodStart: data.current_billing_period?.starts_at,
      currentPeriodEnd: data.current_billing_period?.ends_at,
      nextBilledAt: data.next_billed_at,
      canceledAt: data.canceled_at,
      pausedAt: data.paused_at,
      lastEventAt: occurredAt,
    };

    if (sub) {
      await ctx.db.patch(sub._id, subscriptionData);
    } else {
      await ctx.db.insert("subscriptions", subscriptionData);
    }

    // Keep customer mapping in sync for portal + fallback lookups
    await upsertPaddleCustomer(ctx, {
      userId,
      paddleCustomerId: data.customer_id,
      email: data.customer?.email ?? "",
    });

    // Update user tier, grandfathering flag, and grace window
    const wasPro = ["trialing", "active", "past_due"].includes(sub?.status ?? "");
    const isPro = ["trialing", "active", "past_due"].includes(data.status);
    const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
    await ctx.db.patch(userId, {
      subscriptionTier: isPro ? "pro" : "free",
      ...(isPro
        ? { grandfatheredUntil: undefined, proGraceUntil: undefined }
        : wasPro
          ? { proGraceUntil: Date.now() + FOURTEEN_DAYS_MS }
          : {}),
    });
  },
});
```

**Acceptance criteria:**
- Webhook endpoint responds 200 for valid signatures, 401 for missing/invalid
- Duplicate `event_id` values are ignored
- Out-of-order events (by `occurred_at`) are ignored
- `subscriptions` table is correctly upserted
- `paddleCustomers` mapping is upserted for portal/fallback resolution
- `users.subscriptionTier` is updated based on subscription status
- `users.proGraceUntil` is set once when Pro ends (status transition) and cleared when Pro resumes
- Subscribing during grandfathering clears the `grandfatheredUntil` flag

---

### 1.6 Backend: Subscription query

**File:** `convex/paddle.ts`

Expose a query for the frontend to check subscription status, including grandfathering info:

```typescript
export const getSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", identity.subject))
      .unique();
    if (!user) return null;

    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    const subscription = subscriptions.sort(
      (a, b) => new Date(b.lastEventAt).getTime() - new Date(a.lastEventAt).getTime()
    )[0] ?? null;

    return {
      tier: user.subscriptionTier ?? "free",
      grandfatheredUntil: user.grandfatheredUntil ?? null,
      proGraceUntil: user.proGraceUntil ?? null,
      subscription: subscription
        ? {
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            canceledAt: subscription.canceledAt,
          }
        : null,
    };
  },
});
```

This query should also expose derived state:
- `isGrandfathered`
- `isInGrace`
- `graceDaysLeft`

---

### 1.7 Backend: Customer portal session

**File:** `convex/paddle.ts`

Action to generate a Paddle customer portal URL:

```typescript
export const createPortalSession = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const customer = await ctx.runQuery(internal.paddle.getCustomerByAuthUser, {
      authUserId: identity.subject,
    });
    if (!customer) throw new Error("No subscription found");

    const baseUrl = process.env.PADDLE_API_URL ?? "https://sandbox-api.paddle.com";
    const response = await fetch(
      `${baseUrl}/customers/${customer.paddleCustomerId}/portal-sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        },
        body: JSON.stringify({}),
      }
    );

    const session = await response.json();
    return session.data.urls.general.overview;
  },
});
```

---

### 1.8 Frontend: Paddle.js initialization

**File:** `src/components/providers/paddle-provider.tsx`

```tsx
"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: {
        token: string;
        environment?: string;
        eventCallback?: (event: { name: string; data?: unknown }) => void;
      }) => void;
      Checkout: {
        open: (config: unknown) => void;
      };
    };
  }
}

export function PaddleProvider() {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      window.Paddle?.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox",
      });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
```

Add `<PaddleProvider />` to the root layout.

---

### 1.9 Frontend: Checkout & manage subscription

**File:** `src/components/subscription/checkout-button.tsx`

```tsx
"use client";

interface CheckoutButtonProps {
  priceId: string;
  userId: string;    // Internal Convex user ID
  email?: string;
}

export function CheckoutButton({ priceId, userId, email }: CheckoutButtonProps) {
  const handleClick = () => {
    window.Paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: email ? { email } : undefined,
      customData: { userId },  // Links Paddle -> our user
      settings: {
        displayMode: "overlay",
        theme: "dark",
        successUrl: `${window.location.origin}/dashboard?upgraded=true`,
      },
    });
  };

  return (
    <Button onClick={handleClick} variant="default">
      Upgrade to Pro
    </Button>
  );
}
```

**File:** `src/components/subscription/manage-subscription-button.tsx`

Uses the portal session action from task 1.7 to open Paddle's hosted portal.

---

### 1.10 Frontend: Update pricing page

**File:** `src/app/pricing/pricing-content.tsx`

Replace the current static pricing page with working checkout buttons:
- Free tier: current state (no action needed)
- Pro tier: `<CheckoutButton>` with the Paddle price ID
- Show "Manage Subscription" for existing Pro users
- Copy must state: **room owner needs Pro**, not "facilitator"
- Show 5-day free retention policy
- Grandfathered users: show remaining free access period and option to subscribe early
- Lapsed Pro users: show 14-day grace warning and data-loss messaging

---

### 1.11 Testing

- **Paddle Sandbox:** Use Paddle's sandbox environment for all testing
- **Webhook simulation:** Use `paddle.webhooks` sandbox notification simulator
- **Test cards:** Paddle provides test card numbers for sandbox
- **E2E test:** Verify subscription status query returns correct tier after webhook processing
- **Grandfathering:** Verify migration sets correct fields, cron expires on time, emails send at correct intervals

**Required E2E edge-case matrix:**
- Owner cancels subscription -> grace starts -> warnings appear -> cleanup scheduled after grace
- Owner re-subscribes during grace -> grace cleared -> pending cleanup canceled
- Owner transfers room during grace -> entitlement follows new owner immediately
- Participant in Pro room can still view Pro analytics in dashboard (initial policy)
- Grandfathered user expires without paid sub -> transitions to free policy correctly
- Grandfathered user buys subscription before expiry -> grandfathered flag cleared, paid Pro retained
- Out-of-order webhook events do not regress entitlement state
- Duplicate webhooks remain idempotent

---

### 1.12 Operations: Monetization launch runbook

**File:** `docs/monetization-runbook.md` (new)

Create a production-ready runbook with:

1. **Preflight checklist**
   - env vars validated
   - Paddle webhooks configured and signed
   - cron schedules verified
   - dry-run checks green
2. **Cutover sequence**
   - deploy schema/functions
   - run grandfathering migration
   - enable warning banners
   - validate metrics/support health
   - enable retention enforcement
3. **Rollback sequence**
   - disable gating flags
   - pause cleanup crons
   - restore from safety buffer if needed
4. **Owner communication checklist**
   - in-app notices
   - email templates for grace and cleanup

**Acceptance criteria:**
- Team can execute rollout from a single document
- Rollback path is tested in staging

---

### 1.13 Observability: Entitlement audit log

**Files:** `convex/subscriptions.ts`, admin/debug query surface

Write `entitlementEvents` for state transitions:
- grandfathering start/expiry
- grace start/clear
- ownership-related entitlement shifts
- cleanup scheduled/purged

Expose internal/admin query for recent events per user/room to support incident analysis.

**Acceptance criteria:**
- Every Pro-state transition emits an event
- Support can trace "why this room/user lost Pro access" from event history

---

**Acceptance criteria for the entire epic:**
- User can click "Upgrade" and complete Paddle checkout
- Webhook processes subscription events correctly
- `users.subscriptionTier` reflects current subscription status
- `users.proGraceUntil` supports 14-day grace after Pro ends
- User can access Paddle portal to manage subscription
- Pricing page shows correct CTA based on user's tier
- Pricing page clearly communicates room-owner Pro model and 5-day free retention
- Existing permanent accounts are grandfathered with 6 months Pro
- Grandfathered access expires automatically after 6 months
- Users receive email reminders at 30 and 7 days before expiry
- Lapsed Pro users get warning + grace, then free-retention cleanup applies
- Monetization runbook exists and is validated in staging
- Entitlement transitions are traceable through audit events
