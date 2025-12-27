import { mutation } from "./_generated/server";
import { v } from "convex/values";
import * as Users from "./model/users";

export const join = mutation({
  args: {
    roomId: v.id("rooms"),
    name: v.string(),
    isSpectator: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await Users.joinRoom(ctx, args);
  },
});

export const edit = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    isSpectator: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await Users.editUser(ctx, args);
  },
});

export const leave = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await Users.leaveRoom(ctx, args.userId);
  },
});

// Remove a user from a room (admin action - can remove any user)
export const remove = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await Users.leaveRoom(ctx, args.userId);
  },
});