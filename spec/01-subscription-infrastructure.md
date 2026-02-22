# Epic 1: Subscription Infrastructure (Paddle)

> Introduces Paddle Billing as the payment platform, webhook processing, and subscription state management.

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
```

Also add a `subscriptionTier` field to the existing `users` table:

```typescript
users: defineTable({
  // ... existing fields
  subscriptionTier: v.optional(v.union(v.literal("free"), v.literal("premium"))),
})
```

**Acceptance criteria:**
- Schema deploys successfully with `npx convex dev`
- Existing data is unaffected (new fields are optional)

---

### 1.2 Backend: Paddle webhook endpoint

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
    const userId = await resolveUserIdFromCustomData(ctx, data.custom_data);
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

    // Update user's tier
    const isPremium = ["trialing", "active", "past_due"].includes(data.status);
    await ctx.db.patch(userId, {
      subscriptionTier: isPremium ? "premium" : "free",
    });
  },
});
```

**Acceptance criteria:**
- Webhook endpoint responds 200 for valid signatures, 401 for missing/invalid
- Duplicate `event_id` values are ignored
- Out-of-order events (by `occurred_at`) are ignored
- `subscriptions` table is correctly upserted
- `users.subscriptionTier` is updated based on subscription status

---

### 1.3 Backend: Subscription query

**File:** `convex/paddle.ts`

Expose a query for the frontend to check subscription status:

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

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return {
      tier: user.subscriptionTier ?? "free",
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

---

### 1.4 Backend: Customer portal session

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

### 1.5 Frontend: Paddle.js initialization

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

### 1.6 Frontend: Checkout & manage subscription

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
      Upgrade to Premium
    </Button>
  );
}
```

**File:** `src/components/subscription/manage-subscription-button.tsx`

Uses the portal session action from task 1.4 to open Paddle's hosted portal.

---

### 1.7 Frontend: Update pricing page

**File:** `src/app/pricing/pricing-content.tsx`

Replace the current static pricing page with working checkout buttons:
- Free tier: current state (no action needed)
- Premium tier: `<CheckoutButton>` with the Paddle price ID
- Show "Manage Subscription" for existing premium users

---

### 1.8 Testing

- **Paddle Sandbox:** Use Paddle's sandbox environment for all testing
- **Webhook simulation:** Use `paddle.webhooks` sandbox notification simulator
- **Test cards:** Paddle provides test card numbers for sandbox
- **E2E test:** Verify subscription status query returns correct tier after webhook processing

**Acceptance criteria for the entire epic:**
- User can click "Upgrade" and complete Paddle checkout
- Webhook processes subscription events correctly
- `users.subscriptionTier` reflects current subscription status
- User can access Paddle portal to manage subscription
- Pricing page shows correct CTA based on user's tier
