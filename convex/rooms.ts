import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import * as Rooms from "./model/rooms";

// Create a new room
export const create = mutation({
  args: {
    name: v.string(),
    roomType: v.optional(v.literal("canvas")), // Optional, defaults to canvas
    votingCategorized: v.optional(v.boolean()),
    autoCompleteVoting: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await Rooms.createRoom(ctx, args);
  },
});

// Get room with all related data
export const get = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await Rooms.getRoomWithRelatedData(ctx, args.roomId);
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
      await ctx.db.patch(args.roomId, {
        autoCompleteVoting: !room.autoCompleteVoting,
        // Clear any active countdown when toggling
        autoRevealCountdownStartedAt: undefined,
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
      await ctx.db.patch(args.roomId, {
        autoRevealCountdownStartedAt: undefined,
      });
    }
  },
});

// Execute reveal if countdown has expired (called by client when timer reaches 0)
export const executeAutoReveal = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room || !room.autoRevealCountdownStartedAt || room.isGameOver) {
      return { revealed: false };
    }

    const COUNTDOWN_DURATION_MS = 3000; // 3 seconds
    const elapsed = Date.now() - room.autoRevealCountdownStartedAt;

    if (elapsed >= COUNTDOWN_DURATION_MS) {
      // Clear countdown and reveal cards
      await ctx.db.patch(args.roomId, {
        autoRevealCountdownStartedAt: undefined,
      });
      await Rooms.showRoomCards(ctx, args.roomId);
      return { revealed: true };
    }

    return { revealed: false };
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
