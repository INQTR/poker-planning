import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import * as Rooms from "./model/rooms";

// Internal mutation called by scheduler for auto-reveal
export const scheduledAutoReveal = internalMutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    // Idempotency: skip if already revealed, cancelled, or room doesn't exist
    if (!room || room.isGameOver || !room.autoRevealCountdownStartedAt) {
      return;
    }
    // Clear the scheduled ID and reveal cards
    await ctx.db.patch(args.roomId, { autoRevealScheduledId: undefined });
    await Rooms.showRoomCards(ctx, args.roomId);
  },
});

// Create a new room
export const create = mutation({
  args: {
    name: v.string(),
    roomType: v.optional(v.literal("canvas")), // Optional, defaults to canvas
    autoCompleteVoting: v.optional(v.boolean()),
    votingScale: v.optional(
      v.object({
        type: v.union(
          v.literal("fibonacci"),
          v.literal("standard"),
          v.literal("tshirt"),
          v.literal("custom")
        ),
        cards: v.optional(v.array(v.string())), // Required only for custom type
      })
    ),
  },
  handler: async (ctx, args) => {
    return await Rooms.createRoom(ctx, args);
  },
});

// Get room with all related data
export const get = query({
  args: {
    roomId: v.id("rooms"),
    currentUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await Rooms.getRoomWithRelatedData(ctx, args.roomId, args.currentUserId);
  },
});

// Get rooms for a user
export const getUserRooms = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await Rooms.getUserRooms(ctx, args.userId);
  },
});

// Update room activity
export const updateActivity = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    await Rooms.updateRoomActivity(ctx, args.roomId);
  },
});

// Show cards
export const showCards = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    await Rooms.showRoomCards(ctx, args.roomId);
  },
});

// Reset game
export const resetGame = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    await Rooms.resetRoomGame(ctx, args.roomId);
  },
});

// Toggle auto-complete voting
export const toggleAutoComplete = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (room) {
      // Cancel any scheduled reveal when toggling
      if (room.autoRevealScheduledId) {
        try {
          await ctx.scheduler.cancel(room.autoRevealScheduledId);
        } catch {
          // Job may have already executed - this is fine
        }
      }
      await ctx.db.patch(args.roomId, {
        autoCompleteVoting: !room.autoCompleteVoting,
        // Clear any active countdown when toggling
        autoRevealCountdownStartedAt: undefined,
        autoRevealScheduledId: undefined,
      });
    }
  },
});

// Cancel the auto-reveal countdown
export const cancelAutoRevealCountdown = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (room && room.autoRevealCountdownStartedAt) {
      // Cancel the scheduled job if it exists
      if (room.autoRevealScheduledId) {
        try {
          await ctx.scheduler.cancel(room.autoRevealScheduledId);
        } catch {
          // Job may have already executed - this is fine
        }
      }
      await ctx.db.patch(args.roomId, {
        autoRevealCountdownStartedAt: undefined,
        autoRevealScheduledId: undefined,
      });
    }
  },
});

// Rename a room
export const rename = mutation({
  args: {
    roomId: v.id("rooms"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    await ctx.db.patch(args.roomId, {
      name: args.name,
      lastActivityAt: Date.now(),
    });
  },
});
