import { mutation } from "./_generated/server";
import { v } from "convex/values";
import * as Roles from "./model/roles";

export const promoteFacilitator = mutation({
  args: {
    roomId: v.id("rooms"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await Roles.promoteFacilitator(ctx, args);
  },
});

export const demoteFacilitator = mutation({
  args: {
    roomId: v.id("rooms"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await Roles.demoteFacilitator(ctx, args);
  },
});

export const transferOwnership = mutation({
  args: {
    roomId: v.id("rooms"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await Roles.transferOwnership(ctx, args);
  },
});

export const updatePermissions = mutation({
  args: {
    roomId: v.id("rooms"),
    permissions: v.object({
      revealCards: v.union(
        v.literal("everyone"),
        v.literal("facilitators"),
        v.literal("owner")
      ),
      gameFlow: v.union(
        v.literal("everyone"),
        v.literal("facilitators"),
        v.literal("owner")
      ),
      issueManagement: v.union(
        v.literal("everyone"),
        v.literal("facilitators"),
        v.literal("owner")
      ),
      roomSettings: v.union(
        v.literal("everyone"),
        v.literal("facilitators"),
        v.literal("owner")
      ),
    }),
  },
  handler: async (ctx, args) => {
    await Roles.updatePermissions(ctx, args);
  },
});
