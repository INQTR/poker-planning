import { MutationCtx, QueryCtx } from "../_generated/server";
import { Id, Doc } from "../_generated/dataModel";
import * as Canvas from "./canvas";
import * as Rooms from "./rooms";

export interface JoinRoomArgs {
  roomId: Id<"rooms">;
  name: string;
  isSpectator?: boolean;
  authUserId: string;
}

export interface EditUserArgs {
  userId: Id<"users">;
  roomId: Id<"rooms">;
  name?: string;
  isSpectator?: boolean;
}

// Merged user data returned to frontend (user + membership combined)
export interface RoomUserData {
  _id: Id<"users">;
  name: string;
  isSpectator: boolean;
  isBot?: boolean;
  joinedAt: number;
  membershipId: Id<"roomMemberships">;
}

/**
 * Finds or creates a global user by authUserId
 */
async function findOrCreateGlobalUser(
  ctx: MutationCtx,
  args: { authUserId: string; name: string }
): Promise<Id<"users">> {
  // Check for existing global user
  const existingUser = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
    .first();

  if (existingUser) {
    // Update name if changed
    if (existingUser.name !== args.name) {
      await ctx.db.patch(existingUser._id, { name: args.name });
    }
    return existingUser._id;
  }

  // Create new global user
  return await ctx.db.insert("users", {
    authUserId: args.authUserId,
    name: args.name,
    createdAt: Date.now(),
  });
}

/**
 * Gets a global user by authUserId (without room context)
 */
export async function getGlobalUserByAuthUserId(
  ctx: QueryCtx,
  authUserId: string
): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", authUserId))
    .first();
}

/**
 * Gets membership for a user in a room
 */
export async function getMembership(
  ctx: QueryCtx,
  roomId: Id<"rooms">,
  userId: Id<"users">
): Promise<Doc<"roomMemberships"> | null> {
  return await ctx.db
    .query("roomMemberships")
    .withIndex("by_room_user", (q) => q.eq("roomId", roomId).eq("userId", userId))
    .first();
}

/**
 * Gets membership by authUserId for a specific room
 */
export async function getMembershipByAuthUserId(
  ctx: QueryCtx,
  roomId: Id<"rooms">,
  authUserId: string
): Promise<{ user: Doc<"users">; membership: Doc<"roomMemberships"> } | null> {
  // Find global user
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", authUserId))
    .first();

  if (!user) return null;

  // Find membership in this room
  const membership = await getMembership(ctx, roomId, user._id);
  if (!membership) return null;

  return { user, membership };
}

/**
 * Adds a user to a room or returns existing membership if authUserId matches
 */
export async function joinRoom(
  ctx: MutationCtx,
  args: JoinRoomArgs
): Promise<Id<"users">> {
  // Update room activity
  await Rooms.updateRoomActivity(ctx, args.roomId);

  // Find or create global user
  const userId = await findOrCreateGlobalUser(ctx, {
    authUserId: args.authUserId,
    name: args.name,
  });

  // Check if membership already exists for this room
  const existingMembership = await getMembership(ctx, args.roomId, userId);
  if (existingMembership) {
    // Already in room - just return userId
    return userId;
  }

  // Create membership
  await ctx.db.insert("roomMemberships", {
    roomId: args.roomId,
    userId,
    isSpectator: args.isSpectator ?? false,
    joinedAt: Date.now(),
  });

  // Check if this is a canvas room and create nodes
  const room = await ctx.db.get(args.roomId);
  if (room && room.roomType === "canvas") {
    // Create player node
    await Canvas.upsertPlayerNode(ctx, { roomId: args.roomId, userId });

    // Create voting card nodes for non-spectators
    if (!(args.isSpectator ?? false)) {
      await Canvas.createVotingCardNodes(ctx, { roomId: args.roomId, userId });
    }
  }

  return userId;
}

/**
 * Updates user information (name on global user, isSpectator on membership)
 */
export async function editUser(
  ctx: MutationCtx,
  args: EditUserArgs
): Promise<void> {
  const user = await ctx.db.get(args.userId);
  if (!user) throw new Error("User not found");

  // Get membership for room context
  const membership = await getMembership(ctx, args.roomId, args.userId);
  if (!membership) throw new Error("User not in room");

  // Update room activity
  await Rooms.updateRoomActivity(ctx, args.roomId);

  // Update name on global user if changed
  if (args.name !== undefined) {
    await ctx.db.patch(args.userId, { name: args.name });
  }

  // Handle spectator status transitions
  if (args.isSpectator !== undefined && args.isSpectator !== membership.isSpectator) {
    // Check if this is a canvas room
    const room = await ctx.db.get(args.roomId);
    const isCanvasRoom = room?.roomType === "canvas";

    if (args.isSpectator) {
      // Becoming spectator: remove voting cards and votes
      if (isCanvasRoom) {
        await Canvas.removeVotingCardNodes(ctx, { roomId: args.roomId, userId: args.userId });
      }
      await deleteUserVotesInRoom(ctx, args.roomId, args.userId);
    } else {
      // Becoming participant: create voting cards
      if (isCanvasRoom) {
        await Canvas.createVotingCardNodes(ctx, { roomId: args.roomId, userId: args.userId });
      }
    }

    await ctx.db.patch(membership._id, { isSpectator: args.isSpectator });
  }
}

/**
 * Deletes all votes for a user in a room
 */
async function deleteUserVotesInRoom(
  ctx: MutationCtx,
  roomId: Id<"rooms">,
  userId: Id<"users">
): Promise<void> {
  const votes = await ctx.db
    .query("votes")
    .withIndex("by_room_user", (q) => q.eq("roomId", roomId).eq("userId", userId))
    .collect();

  await Promise.all(votes.map((vote) => ctx.db.delete(vote._id)));
}

/**
 * Removes a user from a room (deletes membership, keeps global user)
 */
export async function leaveRoom(
  ctx: MutationCtx,
  userId: Id<"users">,
  roomId: Id<"rooms">
): Promise<void> {
  const membership = await getMembership(ctx, roomId, userId);
  if (!membership) return;

  // Perform all cleanup operations in parallel for better performance
  const cleanupPromises: Promise<void>[] = [];

  // Delete user's votes in this room
  const votes = await ctx.db
    .query("votes")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", roomId).eq("userId", userId)
    )
    .collect();

  cleanupPromises.push(...votes.map((vote) => ctx.db.delete(vote._id)));

  // Check if this is a canvas room and remove nodes
  const room = await ctx.db.get(roomId);
  if (room && room.roomType === "canvas") {
    // Remove player node and voting cards
    cleanupPromises.push(
      Canvas.removePlayerNodeAndCards(ctx, { roomId, userId })
    );
  }

  // Wait for all cleanup operations to complete
  await Promise.all(cleanupPromises);

  // Delete membership (keep global user)
  await ctx.db.delete(membership._id);

  // Update room activity
  await Rooms.updateRoomActivity(ctx, roomId);
}

/**
 * Gets all users in a room (via memberships)
 */
export async function getRoomUsers(
  ctx: QueryCtx,
  roomId: Id<"rooms">
): Promise<RoomUserData[]> {
  // Get all memberships for this room
  const memberships = await ctx.db
    .query("roomMemberships")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();

  // Get all users for these memberships
  const users = await Promise.all(
    memberships.map((m) => ctx.db.get(m.userId))
  );

  // Merge user and membership data
  return memberships.map((membership, index) => {
    const user = users[index];
    if (!user) throw new Error("User not found for membership");
    return {
      _id: user._id,
      name: user.name,
      isSpectator: membership.isSpectator,
      isBot: membership.isBot,
      joinedAt: membership.joinedAt,
      membershipId: membership._id,
    };
  });
}

/**
 * Checks if a user name is already taken in a room
 */
export async function isUserNameTaken(
  ctx: QueryCtx,
  roomId: Id<"rooms">,
  name: string
): Promise<boolean> {
  const users = await getRoomUsers(ctx, roomId);
  return users.some((user) => user.name.toLowerCase() === name.toLowerCase());
}

/**
 * Updates a global user's name by authUserId
 */
export async function updateGlobalUserName(
  ctx: MutationCtx,
  authUserId: string,
  name: string
): Promise<void> {
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", authUserId))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  await ctx.db.patch(user._id, { name });
}

/**
 * Completely deletes a user from the system (on sign out)
 * Removes from all rooms, deletes memberships, votes, canvas nodes, presence, and the user record
 */
export async function deleteUserByAuthUserId(
  ctx: MutationCtx,
  authUserId: string
): Promise<void> {
  // Find global user
  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q) => q.eq("authUserId", authUserId))
    .first();

  if (!user) return;

  // Find all memberships for this user
  const memberships = await ctx.db
    .query("roomMemberships")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  // Leave each room (cleans up votes, canvas nodes, presence)
  await Promise.all(
    memberships.map((membership) => leaveRoom(ctx, user._id, membership.roomId))
  );

  // Delete the global user record
  await ctx.db.delete(user._id);
}
