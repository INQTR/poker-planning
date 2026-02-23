# Epic 0: Permanent Accounts (Google OAuth + Email Magic Link)

> **Prerequisite for all premium features.** Extends the existing BetterAuth anonymous auth with Google OAuth and email magic link sign-in, enabling account persistence, data ownership, and subscription billing.

## Why This Comes First

The entire premium roadmap (Epics 1-9) depends on permanent accounts:

- **Subscription billing** (Epic 1) requires an email address for receipts and a stable user identity for the Paddle customer record.
- **Premium gating** (Epic 2) needs a reliable `subscriptionTier` tied to a persistent account, not a disposable anonymous session.
- **Integrations** (Epics 6-7) require OAuth token storage linked to a permanent user.
- **Email notifications** (Epic 9) need a verified email address.

Anonymous sessions remain the default for the core planning poker experience (no friction). Permanent accounts are opt-in when users want premium features.

## Current State

- BetterAuth with `anonymous` plugin — guest sessions, 1-year cookie expiry
- No email, no OAuth, no account linking
- Sign-out deletes all user data (anonymous = ephemeral)
- `users` table has: `authUserId`, `name`, `createdAt`
- Auth context exposes: `authUserId`, `isAnonymous`, `isLoading`, `isAuthenticated`

## Target State

- Google OAuth and email magic link as additional sign-in methods
- Anonymous users can upgrade to permanent accounts (account linking)
- Permanent accounts persist data across sign-outs
- `users` table extended with `email`, `avatarUrl`, `accountType`
- Auth context extended with `email`, `accountType`
- Sign-in/sign-up page at `/auth/signin`
- User menu adapts to show account type and upgrade prompts

---

## Tasks

### 0.1 Schema: Extend users table

**File:** `convex/schema.ts`

Add fields to the existing `users` table:

```typescript
users: defineTable({
  authUserId: v.string(),
  name: v.string(),
  email: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  accountType: v.optional(v.union(v.literal("anonymous"), v.literal("permanent"))),
  createdAt: v.number(),
  // subscriptionTier added later by Epic 1
})
  .index("by_auth_user", ["authUserId"])
  .index("by_email", ["email"]),
```

**New fields:**

| Field | Type | Purpose |
|-------|------|---------|
| `email` | `optional(string)` | User's email (from OAuth or magic link) |
| `avatarUrl` | `optional(string)` | Google profile picture URL |
| `accountType` | `optional("anonymous" \| "permanent")` | Distinguishes guest vs permanent accounts |

**Notes:**
- All new fields are optional — existing anonymous users unaffected
- `by_email` index enables lookup for account linking checks
- `accountType` defaults to `"anonymous"` for existing users (handled in code, not migration)

**Acceptance criteria:**
- Schema deploys with `npx convex dev`
- Existing anonymous users continue working unchanged

---

### 0.2 Backend: Add Google OAuth provider

**File:** `convex/auth.ts`

Add Google as a social provider in the BetterAuth configuration:

```typescript
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    secret: authSecret,
    database: authComponent.adapter(ctx),
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 365, // 1 year
      updateAge: 60 * 60 * 24 * 7,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google"],
      },
    },
    // ... rest of config
  });
};
```

**Environment variables** (Convex server-side):

```bash
npx convex env set GOOGLE_CLIENT_ID "your-google-client-id"
npx convex env set GOOGLE_CLIENT_SECRET "your-google-client-secret"
```

**Google Cloud Console setup:**
1. Create OAuth 2.0 credentials at console.cloud.google.com
2. Authorized redirect URI: `{CONVEX_SITE_URL}/api/auth/callback/google`
3. Scopes: `openid`, `email`, `profile`

**Acceptance criteria:**
- `signIn.social({ provider: "google" })` initiates OAuth flow
- Google callback completes and creates session
- BetterAuth `account` table stores Google provider link
- User's email and profile picture are available after sign-in

---

### 0.3 Backend: Add magic link plugin

**File:** `convex/auth.ts`

Add the magic link plugin with email delivery:

```typescript
import { anonymous, magicLink } from "better-auth/plugins";

// Inside createAuth:
plugins: [
  convex({ authConfig }),
  anonymous({
    onLinkAccount: async ({ anonymousUser, newUser }) => {
      // Task 0.5 implements this
    },
  }),
  magicLink({
    sendMagicLink: async ({ email, url }) => {
      await ctx.runAction(internal.email.sendMagicLinkEmail, {
        to: email,
        url,
      });
    },
    expiresIn: 60 * 10, // 10 minutes
  }),
],
```

**File:** `convex/email.ts` (new)

Email sending action using Resend (aligns with existing choice in spec overview):

```typescript
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const sendMagicLinkEmail = internalAction({
  args: { to: v.string(), url: v.string() },
  handler: async (_ctx, { to, url }) => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM_ADDRESS ?? "AgileKit <noreply@agilekit.app>",
        to,
        subject: "Sign in to AgileKit",
        html: magicLinkEmailTemplate(url),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send magic link email: ${error}`);
    }
  },
});

function magicLinkEmailTemplate(url: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="margin-bottom: 16px;">Sign in to AgileKit</h2>
      <p style="color: #555; margin-bottom: 24px;">
        Click the button below to sign in. This link expires in 10 minutes.
      </p>
      <a href="${url}"
         style="display: inline-block; background: #18181b; color: #fff;
                padding: 12px 24px; border-radius: 8px; text-decoration: none;
                font-weight: 500;">
        Sign in to AgileKit
      </a>
      <p style="color: #999; font-size: 13px; margin-top: 24px;">
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  `;
}
```

**Environment variables:**

```bash
npx convex env set RESEND_API_KEY "re_..."
npx convex env set EMAIL_FROM_ADDRESS "AgileKit <noreply@agilekit.app>"
```

**Acceptance criteria:**
- `signIn.magicLink({ email })` sends an email with a sign-in link
- Clicking the link creates a session and redirects to `callbackURL`
- Magic link expires after 10 minutes
- Invalid/expired tokens show an error page

---

### 0.4 Client: Add magic link plugin

**File:** `src/lib/auth-client.ts`

```typescript
"use client";

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { anonymousClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    convexClient(),
    anonymousClient(),
    magicLinkClient(),
  ],
});

export const { useSession, signIn, signOut, signUp } = authClient;
```

**Acceptance criteria:**
- `authClient.signIn.magicLink()` method available
- `authClient.signIn.social()` method available (no extra plugin needed for social)
- TypeScript types correct for all sign-in methods

---

### 0.5 Backend: Account linking (anonymous → permanent)

**File:** `convex/auth.ts`, `convex/model/users.ts`

When an anonymous user signs in with Google or magic link, BetterAuth fires `onLinkAccount`. This callback must transfer all application data from the anonymous identity to the new permanent identity.

**Key insight:** BetterAuth's account linking changes the `authUserId`. The old anonymous `authUserId` is replaced by the new permanent `authUserId`. Our `users` table links to BetterAuth via `authUserId`, so we need to update that reference and enrich the user record.

```typescript
// convex/auth.ts — inside anonymous plugin config
anonymous({
  onLinkAccount: async ({ anonymousUser, newUser }) => {
    // BetterAuth handles the account table merge.
    // We need to update our application's users table.
    //
    // anonymousUser.id = old BetterAuth authUserId (anonymous)
    // newUser.id = new BetterAuth authUserId (permanent)
    //
    // Transfer: update our users record from old authUserId to new authUserId,
    // and enrich with email/avatar from the new account.
    await ctx.runMutation(internal.users.linkAnonymousAccount, {
      oldAuthUserId: anonymousUser.id,
      newAuthUserId: newUser.id,
      email: newUser.email,
      name: newUser.name ?? undefined,
      avatarUrl: newUser.image ?? undefined,
    });
  },
}),
```

**File:** `convex/users.ts` — new internal mutation:

```typescript
export const linkAnonymousAccount = internalMutation({
  args: {
    oldAuthUserId: v.string(),
    newAuthUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await Users.linkAnonymousToPermament(ctx, args);
  },
});
```

**File:** `convex/model/users.ts` — business logic:

```typescript
export async function linkAnonymousToPermament(
  ctx: MutationCtx,
  args: {
    oldAuthUserId: string;
    newAuthUserId: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  }
): Promise<void> {
  // Find existing user by old anonymous authUserId
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", args.oldAuthUserId))
    .first();

  if (!user) {
    // No application user found — might be a fresh sign-in without prior room join
    // BetterAuth will create the auth user; our app user gets created on next room join
    return;
  }

  // Check if there's already a user with the new authUserId (shouldn't happen normally)
  const existingPermanent = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", args.newAuthUserId))
    .first();

  if (existingPermanent) {
    // Merge: transfer memberships from anonymous user to existing permanent user
    const memberships = await ctx.db
      .query("roomMemberships")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const membership of memberships) {
      // Check if permanent user already has membership in this room
      const existingMembership = await getMembership(ctx, membership.roomId, existingPermanent._id);
      if (existingMembership) {
        // Already in room — delete the anonymous membership
        await ctx.db.delete(membership._id);
      } else {
        // Transfer membership to permanent user
        await ctx.db.patch(membership._id, { userId: existingPermanent._id });
      }
    }

    // Transfer votes
    // Rule: If both permanent and anonymous users have voted in the same room,
    // keep the permanent user's vote and delete the anonymous vote.
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const vote of votes) {
      const existingVote = await ctx.db
        .query("votes")
        .withIndex("by_room_user", (q) =>
          q.eq("roomId", vote.roomId).eq("userId", existingPermanent._id)
        )
        .first();

      if (existingVote) {
        // Permanent user already voted in this room
        await ctx.db.delete(vote._id);
      } else {
        await ctx.db.patch(vote._id, { userId: existingPermanent._id });
      }
    }

    // Transfer canvas nodes (player nodes and lastUpdatedBy references)
    // Rule: Same as above. Favor the permanent user's node on conflict.

    // Delete the old anonymous user record
    await ctx.db.delete(user._id);
    return;
  }

  // Simple case: update the user record to point to new authUserId
  await ctx.db.patch(user._id, {
    authUserId: args.newAuthUserId,
    email: args.email,
    avatarUrl: args.avatarUrl,
    accountType: "permanent",
    // Keep existing name unless user had no name set
    ...(args.name && !user.name ? { name: args.name } : {}),
  });
}
```

**Edge cases handled:**
1. User was anonymous, joins rooms, then signs in with Google → data transfers seamlessly
2. User was anonymous, never joined a room, signs in with Google → no-op (user created on next room join)
3. User had a permanent account, signed out, got anonymous session, signs back in → memberships merge

**Acceptance criteria:**
- Anonymous user's room memberships, votes, and canvas nodes transfer to permanent account
- User's name persists (not overwritten by Google name if already set)
- Email and avatar populated from OAuth provider
- `accountType` changes from `"anonymous"` to `"permanent"`
- No data loss during transition

---

### 0.6 Backend: Update sign-out behavior

**File:** `convex/model/users.ts`, user menu

Currently, sign-out always deletes the user. For permanent accounts, sign-out should only clear the session — user data persists for next sign-in.

**File:** `src/components/user-menu/user-menu.tsx` — already handles this:

```typescript
const handleSignOut = async () => {
  // Only delete user completely if they are anonymous
  if (isAnonymous) {
    await deleteUser({ authUserId });
  }
  await authClient.signOut();
};
```

This logic is already correct. Verify it works with the new `isAnonymous` flag behavior after account linking.

**Additional consideration:** When a permanent user signs out and returns:
- They land on the homepage or room page as unauthenticated
- They need a way to sign back in (Google or magic link)
- Their room memberships are preserved, rooms auto-join on sign-in

**Acceptance criteria:**
- Permanent user sign-out clears session but preserves all data
- Anonymous user sign-out still deletes all data
- Returning permanent users can sign in and see their rooms

---

### 0.7 Backend: Update auth context

**File:** `src/components/auth/auth-provider.tsx`

Extend the auth context to expose account information:

```typescript
interface AuthContextType {
  authUserId: string | null;
  isAnonymous: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  // New fields:
  email: string | null;
  accountType: "anonymous" | "permanent" | null;
}
```

The `email` and `accountType` come from the app's `users` table via a Convex query (not from BetterAuth session, to stay consistent with existing pattern).

**Implementation:** The auth provider already queries `useSession()` for `authUserId`. Add a query for the global user to get `email` and `accountType`:

```typescript
const globalUser = useQuery(
  api.users.getGlobalUser,
  authUserId ? { authUserId } : "skip"
);

const value = useMemo(() => ({
  authUserId: session?.user?.id ?? null,
  isAnonymous: session?.user?.isAnonymous ?? false,
  isLoading: convexAuthLoading,
  isAuthenticated,
  email: globalUser?.email ?? null,
  accountType: globalUser?.accountType ?? null,
}), [session, convexAuthLoading, isAuthenticated, globalUser]);
```

**Acceptance criteria:**
- `useAuth()` returns `email` and `accountType`
- Values update reactively when account is linked
- No extra queries for anonymous users (fields are just null)

---

### 0.8 Frontend: Sign-in page

**File:** `src/app/auth/signin/page.tsx` (new)

Create a dedicated sign-in page with two options:

1. **"Continue with Google"** — OAuth flow
2. **"Sign in with email"** — Magic link flow

**Layout:**
```
┌─────────────────────────────────────┐
│          AgileKit logo              │
│                                     │
│    Sign in to your account          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Continue with Google   G  │    │
│  └─────────────────────────────┘    │
│                                     │
│  ────────── or ──────────          │
│                                     │
│  Email address                      │
│  ┌─────────────────────────────┐    │
│  │ you@example.com             │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │   Send magic link           │    │
│  └─────────────────────────────┘    │
│                                     │
│  After sending:                     │
│  "Check your email for a sign-in    │
│   link. It expires in 10 minutes."  │
│                                     │
│  ─────────────────────────────      │
│  Continue as guest (anonymous)      │
└─────────────────────────────────────┘
```

**Behavior:**
- Google: calls `authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })`
- Magic link: calls `authClient.signIn.magicLink({ email, callbackURL: "/dashboard" })`, shows "check your email" state
- Guest:
  - If user is already in an anonymous session (`isAnonymous === true`), act as "Cancel / Return to Room" and redirect back to `?from=` (or homepage). Do not call `signIn.anonymous()` again to avoid session rotation and losing room state.
  - If no session exists, call `authClient.signIn.anonymous()` and redirect to `?from=` (or homepage).
- If user came from a specific room (via query param `?from=/room/xyz`), redirect back there after sign-in

**States:**
1. Default — show both options
2. Magic link sent — show "check your email" message with option to resend
3. Error — show error message with retry

**Acceptance criteria:**
- Page accessible at `/auth/signin`
- Google OAuth flow works end-to-end
- Magic link sends email and shows confirmation
- Redirect works after successful sign-in
- Guest option still available for users who don't want an account
- Page is responsive (mobile-friendly)
- Dark mode support

---

### 0.9 Frontend: Update user menu for account types

**File:** `src/components/user-menu/user-menu.tsx`

Adapt the user menu based on account type:

**Anonymous users:**
```
┌─────────────────────────┐
│  👤 Guest               │
│  Guest                   │
├─────────────────────────┤
│  ✏️  Edit name           │
│  📊 Analytics            │
│  👁  Spectator [toggle]  │
│  🔒 Create account       │  ← NEW: links to /auth/signin
│  🎨 Appearance  >        │
├─────────────────────────┤
│  🚪 Sign out             │
└─────────────────────────┘
```

**Permanent users:**
```
┌─────────────────────────┐
│  👤 Jane Smith           │
│  jane@example.com        │  ← Shows email instead of "Guest"
├─────────────────────────┤
│  ✏️  Edit name           │
│  📊 Analytics            │
│  👁  Spectator [toggle]  │
│  🎨 Appearance  >        │
├─────────────────────────┤
│  🚪 Sign out             │
└─────────────────────────┘
```

**Changes:**
- Show email in profile header for permanent accounts
- Show "Create account" link for anonymous users (goes to `/auth/signin`)
- Remove "Create account" for permanent users

**Acceptance criteria:**
- Anonymous users see "Create account" option
- Permanent users see their email
- "Create account" navigates to sign-in page
- Signing in via the page links the anonymous account

---

### 0.10 Frontend: Update Room UI for Avatars

**Files:** `src/components/room/nodes/player-node.tsx`, `src/components/room/room-canvas.tsx` (cursors)

When a permanent user has an `avatarUrl` (from Google OAuth), the room UI should display it instead of a generic generated avatar or initials.

**Acceptance criteria:**
- Player nodes on the canvas display the user's Google profile picture if `avatarUrl` is present.
- Multiplayer cursors (if showing avatars) use the `avatarUrl`.
- Fallback remains the existing generic avatar/initials for anonymous users or those without an avatar.

---

### 0.11 Frontend: Account linking from room context

When an anonymous user is in a room and clicks "Create account" in the user menu, they should be redirected to `/auth/signin?from=/room/[roomId]`. After signing in (Google or magic link), account linking happens automatically (Task 0.5), and the user is redirected back to their room.

**Flow:**
```
1. Anonymous user in /room/abc123
2. Clicks "Create account" in user menu
3. Redirected to /auth/signin?from=/room/abc123
4. Signs in with Google or magic link
5. onLinkAccount fires → transfers data
6. Redirected back to /room/abc123
7. User is now permanent, all room data preserved
```

**Implementation notes:**
- The `from` query param is passed as `callbackURL` to the sign-in methods
- BetterAuth handles the redirect after successful auth
- The room page's existing auth flow handles the returning user (now with new authUserId)

**Acceptance criteria:**
- User returns to the exact room they were in after sign-in
- Room memberships, votes, and canvas node positions are preserved
- No duplicate user entries in the room

---

### 0.12 Frontend: Magic link verification page

**File:** `src/app/auth/verify/page.tsx` (new)

When users click the magic link in their email, BetterAuth verifies the token at `/api/auth/magiclink/verify`. We need to handle the redirect and error states.

**States:**
1. **Verifying** — "Signing you in..." spinner
2. **Success** — Redirect to `callbackURL` (or `/dashboard`)
3. **Error** — "This link has expired or is invalid. Request a new one." with link to `/auth/signin`

**Note:** BetterAuth may handle the redirect automatically via the `callbackURL` param on the magic link. Test whether a custom verification page is needed or if the built-in behavior suffices. If BetterAuth redirects automatically, this task reduces to just an error page.

**Acceptance criteria:**
- Valid magic links sign the user in and redirect
- Expired/invalid links show a clear error message
- Error page links back to sign-in

---

### 0.13 Update authentication documentation

**File:** `docs/authentication.md`

Update the existing auth docs to cover:
- New auth methods (Google OAuth, magic link)
- Account linking flow
- Updated data model (new fields on `users` table)
- Updated auth context interface
- Environment variables for Google OAuth and Resend
- Sign-in page routes

---

### 0.14 Google Cloud Console setup guide

**File:** `docs/google-oauth-setup.md` (new)

Step-by-step guide for contributors:
1. Create Google Cloud project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs for dev and production
5. Set environment variables in Convex

---

## Environment Variables Summary

### New Convex Server Variables

```bash
# Google OAuth (Task 0.2)
npx convex env set GOOGLE_CLIENT_ID "your-client-id"
npx convex env set GOOGLE_CLIENT_SECRET "your-client-secret"

# Email / Magic Link (Task 0.3)
npx convex env set RESEND_API_KEY "re_..."
npx convex env set EMAIL_FROM_ADDRESS "AgileKit <noreply@agilekit.app>"
```

### Existing Variables (unchanged)

```bash
SITE_URL              # Already set
BETTER_AUTH_SECRET     # Already set
```

---

## Risk & Edge Cases

| Risk | Mitigation |
|------|------------|
| Account linking fails mid-transfer | The Convex mutation (`linkAnonymousAccount`) is atomic (single ACID transaction). However, `onLinkAccount` runs within BetterAuth's HTTP flow — if the Convex mutation succeeds but BetterAuth's own account table update fails, the two systems could be out of sync. Mitigation: the `linkAnonymousAccount` mutation is idempotent (safe to retry). |
| User signs in with Google, gets new authUserId, but old anonymous data stays orphaned | `onLinkAccount` callback explicitly handles data transfer |
| Magic link email goes to spam | Use verified domain on Resend, proper SPF/DKIM, minimal HTML template |
| Google OAuth callback URL mismatch in production | `baseURL` in BetterAuth config uses `siteUrl` from env; document correct redirect URI setup |
| Magic links failing in Vercel preview environments | Ensure the frontend's origin is dynamically passed or that BetterAuth's `baseURL` properly handles preview URLs (e.g. using `origin` headers). `SITE_URL` env var must not be rigidly hardcoded to production if testing in previews. |
| User has anonymous session in browser A, signs in with Google in browser B | Two separate sessions — no conflict. Browser A stays anonymous until that session signs in too |
| Rate limiting on magic link sends | BetterAuth has built-in rate limiting. Can add additional per-email throttling if needed |

---

## Dependencies

- **Resend account** with verified domain for magic link emails
- **Google Cloud Console** project with OAuth credentials
- **BetterAuth magic link plugin** (`better-auth/plugins`) — already bundled with `better-auth` package

## Estimated Effort

| Task | Effort |
|------|--------|
| 0.1 Schema changes | S |
| 0.2 Google OAuth backend | S |
| 0.3 Magic link backend + email | M |
| 0.4 Client plugin update | S |
| 0.5 Account linking logic | L |
| 0.6 Sign-out behavior | S |
| 0.7 Auth context update | S |
| 0.8 Sign-in page | M |
| 0.9 User menu update | S |
| 0.10 Avatar UI update | S |
| 0.11 Room context linking | S |
| 0.12 Magic link verification | S |
| 0.13 Update docs | S |
| 0.14 Google setup guide | S |
| **Total** | **Large** |
