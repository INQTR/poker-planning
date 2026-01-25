# Authentication Architecture

AgileKit uses [BetterAuth](https://www.better-auth.com/) with anonymous sessions for user identity management. This enables seamless user experiences across rooms and page refreshes without requiring explicit login.

## Overview

The authentication system consists of three layers:

1. **BetterAuth Session** - Browser-persisted anonymous session (cookie-based)
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
│  _id, authUserId, name, createdAt                               │
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
| `convex/auth.ts` | BetterAuth server configuration with anonymous plugin |
| `convex/auth.config.ts` | Convex auth provider configuration |
| `convex/http.ts` | HTTP routes for auth endpoints |
| `convex/schema.ts` | Database schema with `users` and `roomMemberships` tables |
| `convex/users.ts` | User/membership API (join, leave, edit, queries) |
| `convex/model/users.ts` | User/membership business logic |

### Frontend (Next.js)

| File | Purpose |
|------|---------|
| `src/lib/auth-client.ts` | BetterAuth client with anonymous plugin |
| `src/lib/auth-server.ts` | Server-side auth helpers |
| `src/app/api/auth/[...all]/route.ts` | Next.js API route handler |
| `src/components/auth/auth-provider.tsx` | React context for auth state |

## Data Model

### users (Global Identity)

```typescript
{
  _id: Id<"users">,
  authUserId: string,    // BetterAuth ID (unique)
  name: string,          // Display name (persists across rooms)
  createdAt: number,
}
```

Indexed by: `by_auth_user` on `authUserId`

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

### First-Time User Joining a Room

```
1. User visits /room/[roomId]
2. No BetterAuth session exists → JoinRoomDialog shown
3. User enters name and clicks "Join Room"
4. authClient.signIn.anonymous() creates session → cookie set
5. joinRoom mutation:
   - Creates global user record (users table)
   - Creates room membership (roomMemberships table)
6. roomUser state set → RoomCanvas renders
```

### Returning User (Same Room, Page Refresh)

```
1. User refreshes /room/[roomId]
2. BetterAuth session loaded from cookie
3. existingMembership query finds user in this room
4. useEffect restores roomUser from membership
5. RoomCanvas renders (no JoinRoomDialog shown)
```

### Returning User (Different Room)

```
1. User visits new /room/[newRoomId]
2. BetterAuth session exists
3. existingMembership = null (not in this room)
4. globalUser query returns their user record
5. Auto-join triggers: joinRoom mutation with existing name
6. RoomCanvas renders automatically
```

## Auth Provider Context

```typescript
interface AuthContextType {
  authUser: AuthUser | null;    // BetterAuth session (persists)
  roomUser: RoomUser | null;    // Current room membership (transient)
  setRoomUser: (user: RoomUser | null) => void;
  isLoading: boolean;           // Session loading state
}

interface AuthUser {
  authUserId: string;           // BetterAuth ID
  preferredName?: string;
}

interface RoomUser {
  id: Id<"users">;              // Convex user ID
  name: string;
  roomId: Id<"rooms">;
}
```

## API Reference

### Queries

| Query | Args | Returns |
|-------|------|---------|
| `users.getGlobalUser` | `{ authUserId }` | Global user or null |
| `users.getByAuthUserId` | `{ roomId, authUserId }` | Merged user+membership or null |

### Mutations

| Mutation | Args | Returns |
|----------|------|---------|
| `users.join` | `{ roomId, name, isSpectator?, authUserId }` | User ID |
| `users.edit` | `{ userId, roomId, name?, isSpectator? }` | void |
| `users.leave` | `{ userId, roomId }` | void |
| `users.remove` | `{ userId, roomId }` | void |

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

# Production
npx convex env set SITE_URL https://your-domain.com
npx convex env set BETTER_AUTH_SECRET <your-production-secret>
```

| Variable | Purpose |
|----------|---------|
| `SITE_URL` | Base URL for auth callbacks |
| `BETTER_AUTH_SECRET` | Secret key for signing sessions (min 32 chars) |

These are required because Convex functions run on Convex's servers and cannot access `.env.local`.

## Session Configuration

- **Expiry**: 1 year (`60 * 60 * 24 * 365` seconds)
- **Refresh**: Weekly (`60 * 60 * 24 * 7` seconds)
- **Storage**: HTTP-only cookie

## Design Decisions

### Why Anonymous Auth?

Planning poker is typically used in team meetings where:
- Users don't want to create accounts
- Sessions are short-lived
- Privacy is important (no email collection)

Anonymous auth provides persistence across refreshes without requiring user registration.

### Why Separate users and roomMemberships?

1. **Name persistence**: User's display name follows them across rooms
2. **Clean data model**: Room-specific data (spectator status) separated from identity
3. **Future extensibility**: Easy to add account linking, preferences, etc.

### Loading State Handling

The room content component carefully sequences loading states to prevent UI flicker:

```typescript
// 1. Wait for auth session to load
if (authLoading) return <Loading message="Checking session" />;

// 2. If no session, show join dialog immediately
if (!authUser) return <JoinRoomDialog />;

// 3. Wait for membership queries
if (!queriesLoaded || existingMembership) return <Loading message="Checking membership" />;

// 4. No membership found - show join dialog
return <JoinRoomDialog />;
```

This prevents the JoinRoomDialog from flashing when a returning user refreshes the page.
