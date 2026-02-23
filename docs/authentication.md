# Authentication Architecture

AgileKit uses [BetterAuth](https://www.better-auth.com/) for user identity management, supporting both anonymous guest sessions and permanent accounts (Google OAuth and Email Magic Links).

## Overview

The authentication system consists of three layers:

1. **BetterAuth Session** - Browser-persisted session (cookie-based)
2. **Global User** - Convex `users` table record linked to BetterAuth ID
3. **Room Membership** - Per-room participation via `roomMemberships` table

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Session                          │
│  BetterAuth cookie (1 year expiry, weekly refresh)              │
└─────────────────────────┬───────────────────────────────────────┘
                          │ authUserId
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      users (Global)                             │
│  _id, authUserId, name, email, avatarUrl, accountType           │
└─────────────────────────┬───────────────────────────────────────┘
                          │ userId
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   roomMemberships                               │
│  _id, roomId, userId, isSpectator, isBot, joinedAt              │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### Backend (Convex)

| File | Purpose |
|------|---------|
| `convex/auth.ts` | BetterAuth server config with anonymous, google, and magic link plugins |
| `convex/auth.config.ts` | Convex auth provider configuration |
| `convex/http.ts` | HTTP routes for auth endpoints |
| `convex/schema.ts` | Database schema with `users` and `roomMemberships` tables |
| `convex/users.ts` | User/membership API (join, leave, edit, queries, linkAccount) |
| `convex/model/users.ts` | User/membership business logic & account linking logic |
| `convex/email.ts` | Internal actions to send Magic Link emails via Resend |

### Frontend (Next.js)

| File | Purpose |
|------|---------|
| `src/lib/auth-client.ts` | BetterAuth client with anonymous and magic link plugins |
| `src/app/auth/signin/page.tsx` | Dedicated Sign In Page for permanent account upgrade |
| `src/app/auth/verify/page.tsx` | Magic Link Verification Page |
| `src/app/api/auth/[...all]/route.ts` | Next.js API route handler |
| `src/components/auth/auth-provider.tsx` | React context for auth state |

## Data Model

### users (Global Identity)

```typescript
{
  _id: Id<"users">,
  authUserId: string,    // BetterAuth ID (unique)
  name: string,          // Display name (persists across rooms)
  email?: string,        // Email from OAuth or magic link
  avatarUrl?: string,    // Google profile picture URL
  accountType?: "anonymous" | "permanent",
  createdAt: number,
}
```

Indexed by: `by_auth_user` on `authUserId` and `by_email` on `email`.

### roomMemberships (Room Participation)

```typescript
{
  _id: Id<"roomMemberships">,
  roomId: Id<"rooms">,
  userId: Id<"users">,   // FK to global user
  isSpectator: boolean,
  isBot?: boolean,       // For demo room bots
  joinedAt: number,
}
```

Indexed by: `by_room`, `by_user`, `by_room_user`

## Auth Flow

### First-Time User Joining a Room (Guest)

```
1. User visits /room/[roomId]
2. useConvexAuth() returns isAuthenticated=false → JoinRoomDialog shown
3. User enters name and clicks "Join Room"
4. authClient.signIn.anonymous() creates session → cookie set
5. joinRoom mutation:
   - Creates global user record (users table) with accountType: "anonymous"
   - Creates room membership (roomMemberships table)
6. existingMembership query auto-updates → RoomCanvas renders
```

### Account Linking Flow (Anonymous → Permanent)

```
1. Anonymous user in /room/abc123 clicks "Create account"
2. Redirected to /auth/signin?from=/room/abc123
3. Signs in with Google or Magic Link
4. BetterAuth creates permanent user and fires onLinkAccount hook
5. Backend hook internal.users.linkAnonymousAccount executes:
   - Finds existing "anonymous" user via old authUserId
   - Transfers all roomMemberships, votes, and canvas node ownership
   - Updates accountType to "permanent", assigns email & avatarUrl
   - Safely deletes old anonymous record
6. Redirected back to /room/abc123
```

## Auth Provider Context

The auth provider uses `useConvexAuth()` for auth state and queries the internal Convex global user table to fetch metadata like `email` and `accountType`.

```typescript
interface AuthContextType {
  authUserId: string | null;    // BetterAuth ID (for mutations)
  isAnonymous: boolean;         // Whether the session is anonymous
  isLoading: boolean;           // Auth loading state (from Convex)
  isAuthenticated: boolean;     // Whether user is authenticated (from Convex)
  email: string | null;         // User email for permanent accounts
  accountType: "anonymous" | "permanent" | null;
}
```

## Environment Variables

### Next.js Environment Variables (`.env.local`)

```bash
# Required for BetterAuth
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-project.convex.site
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or production URL
```

### Convex Server Environment Variables

BetterAuth requires these variables to be set in the Convex environment (not `.env.local`):

```bash
# Development
npx convex env set SITE_URL http://localhost:3000
npx convex env set BETTER_AUTH_SECRET $(openssl rand -base64 32)
npx convex env set GOOGLE_CLIENT_ID "your-google-client-id"
npx convex env set GOOGLE_CLIENT_SECRET "your-google-client-secret"
npx convex env set RESEND_API_KEY "re_..."
npx convex env set EMAIL_FROM_ADDRESS "AgileKit <noreply@agilekit.app>"
```

| Variable | Purpose |
|----------|---------|
| `SITE_URL` | Base URL for auth callbacks |
| `BETTER_AUTH_SECRET` | Secret key for signing sessions (min 32 chars) |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from Google Cloud Console |
| `RESEND_API_KEY` | Resend key used for dispatching Magic Link emails |
| `EMAIL_FROM_ADDRESS` | From address for transactional emails |

## Session Configuration

- **Expiry**: 1 year (`60 * 60 * 24 * 365` seconds)
- **Refresh**: Weekly (`60 * 60 * 24 * 7` seconds)
- **Storage**: HTTP-only cookie
