import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import * as Users from "./model/users";

function validateName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Name is required");
  }
  if (trimmed.length > 50) {
    throw new Error("Name must be 50 characters or less");
  }
  return trimmed;
}

// Get global user by authUserId (for auto-join logic)
export const getGlobalUser = query({
  args: {
    authUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await Users.getGlobalUserByAuthUserId(ctx, args.authUserId);
  },
});

// Get membership by authUserId in a specific room (for auto-restore)
export const getByAuthUserId = query({
  args: {
    roomId: v.id("rooms"),
    authUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await Users.getMembershipByAuthUserId(ctx, args.roomId, args.authUserId);
    if (!result) return null;

    // Return merged user + membership data for frontend
    return {
      _id: result.user._id,
      name: result.user.name,
      avatarUrl: result.user.avatarUrl,
      isSpectator: result.membership.isSpectator,
      isBot: result.membership.isBot,
      joinedAt: result.membership.joinedAt,
      membershipId: result.membership._id,
    };
  },
});

export const join = mutation({
  args: {
    roomId: v.id("rooms"),
    name: v.string(),
    isSpectator: v.optional(v.boolean()),
    authUserId: v.string(), // Now required
  },
  handler: async (ctx, args) => {
    return await Users.joinRoom(ctx, {
      roomId: args.roomId,
      name: validateName(args.name),
      isSpectator: args.isSpectator,
      authUserId: args.authUserId,
    });
  },
});

export const edit = mutation({
  args: {
    userId: v.id("users"),
    roomId: v.id("rooms"), // Now required for membership context
    name: v.optional(v.string()),
    isSpectator: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await Users.editUser(ctx, {
      userId: args.userId,
      roomId: args.roomId,
      name: args.name !== undefined ? validateName(args.name) : undefined,
      isSpectator: args.isSpectator,
    });
  },
});

export const leave = mutation({
  args: {
    userId: v.id("users"),
    roomId: v.id("rooms"), // Now required
  },
  handler: async (ctx, args) => {
    await Users.leaveRoom(ctx, args.userId, args.roomId);
  },
});

// Remove a user from a room (admin action - can remove any user)
export const remove = mutation({
  args: {
    userId: v.id("users"),
    roomId: v.id("rooms"), // Now required
  },
  handler: async (ctx, args) => {
    await Users.leaveRoom(ctx, args.userId, args.roomId);
  },
});

// Edit global user (name only, no room context required)
export const editGlobalUser = mutation({
  args: {
    authUserId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await Users.updateGlobalUserName(ctx, args.authUserId, validateName(args.name));
  },
});

// Delete user completely (called on sign out)
export const deleteUser = mutation({
  args: {
    authUserId: v.string(),
  },
  handler: async (ctx, args) => {
    await Users.deleteUserByAuthUserId(ctx, args.authUserId);
  },
});

export const linkAnonymousAccount = internalMutation({
  args: {
    oldAuthUserId: v.string(),
    newAuthUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await Users.linkAnonymousToPermanent(ctx, args);
  },
});
