import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id, Doc } from "../_generated/dataModel";
import { PermissionCategory } from "../permissions";
import { requirePermission } from "./permissions";

/**
 * Auth identity returned by ctx.auth.getUserIdentity().
 * identity.subject is the BetterAuth user ID (authUserId).
 */
interface AuthIdentity {
  subject: string;
  [key: string]: unknown;
}

/**
 * Requires authentication. Throws if the user is not authenticated.
 * Returns the auth identity (identity.subject = authUserId).
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx
): Promise<AuthIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

/**
 * Returns the authenticated user's app-level record, or throws.
 * Use for mutations that require a known user.
 */
export async function requireAuthUser(
  ctx: QueryCtx | MutationCtx
): Promise<{ identity: AuthIdentity; user: Doc<"users"> }> {
  const identity = await requireAuth(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", identity.subject))
    .first();
  if (!user) {
    throw new Error("User not found");
  }
  return { identity, user };
}

/**
 * Returns the authenticated user's app-level record, or null if not authenticated
 * or no user record exists. Use for queries that should gracefully degrade.
 */
export async function getOptionalAuthUser(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", identity.subject))
    .first();
}

/**
 * Requires authentication and verifies room membership.
 * Returns the identity, user, and membership records.
 */
export async function requireRoomMember(
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"rooms">
): Promise<{
  identity: AuthIdentity;
  user: Doc<"users">;
  membership: Doc<"roomMemberships">;
}> {
  const { identity, user } = await requireAuthUser(ctx);
  const membership = await ctx.db
    .query("roomMemberships")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", roomId).eq("userId", user._id)
    )
    .first();
  if (!membership) {
    throw new Error("Not a member of this room");
  }
  return { identity, user, membership };
}

/**
 * Requires authentication, room membership, AND permission for a specific category.
 * Combines requireRoomMember + requirePermission in one call.
 */
export async function requireRoomPermission(
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"rooms">,
  category: PermissionCategory
): Promise<{
  identity: AuthIdentity;
  user: Doc<"users">;
  membership: Doc<"roomMemberships">;
  room: Doc<"rooms">;
}> {
  const { identity, user, membership } = await requireRoomMember(ctx, roomId);
  const room = await ctx.db.get(roomId);
  if (!room) {
    throw new Error("Room not found");
  }
  await requirePermission(ctx, room, membership, category);
  return { identity, user, membership, room };
}
