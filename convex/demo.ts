import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import * as Demo from "./model/demo";

// v is imported for consistency with other API layer files
void v;

/**
 * Get the demo room ID (creates if doesn't exist)
 */
export const getDemoRoomId = query({
  args: {},
  handler: async (ctx) => {
    return await Demo.getDemoRoomId(ctx);
  },
});

/**
 * Get full demo room data for rendering
 */
export const getDemoRoom = query({
  args: {},
  handler: async (ctx) => {
    return await Demo.getDemoRoomData(ctx);
  },
});

/**
 * Initialize the demo room (admin/setup action)
 */
export const initializeDemo = mutation({
  args: {},
  handler: async (ctx) => {
    return await Demo.ensureDemoRoom(ctx);
  },
});

/**
 * Reset the demo room to a clean state
 */
export const resetDemo = mutation({
  args: {},
  handler: async (ctx) => {
    await Demo.resetDemoRoom(ctx);
  },
});

/**
 * Internal mutation called by cron to run demo cycle
 */
export const runDemoCycle = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Ensure demo room exists
    const demoRoomId = await Demo.ensureDemoRoom(ctx);

    // Get room state
    const room = await ctx.db.get(demoRoomId);
    if (!room) return;

    // Get bots and votes
    const [bots, votes] = await Promise.all([
      ctx.db
        .query("users")
        .withIndex("by_room", (q) => q.eq("roomId", demoRoomId))
        .filter((q) => q.eq(q.field("isBot"), true))
        .collect(),
      ctx.db
        .query("votes")
        .withIndex("by_room", (q) => q.eq("roomId", demoRoomId))
        .collect(),
    ]);

    // State machine logic
    if (room.isGameOver) {
      // Revealed state: wait 5 seconds then reset
      const timeSinceReveal = Date.now() - room.lastActivityAt;
      if (timeSinceReveal > 5000) {
        await Demo.resetDemoRoom(ctx);
      }
      return;
    }

    // Voting phase
    const votedUserIds = new Set(votes.map((v) => v.userId.toString()));
    const botsWhoHaventVoted = bots.filter(
      (bot) => !votedUserIds.has(bot._id.toString())
    );

    if (botsWhoHaventVoted.length > 0) {
      // Make one bot vote per cycle (staggered voting)
      const bot = botsWhoHaventVoted[0];
      const cardLabel = Demo.generateBotVote(bot.name);
      const cardValue = parseInt(cardLabel) || 0;

      // Insert vote
      await ctx.db.insert("votes", {
        roomId: demoRoomId,
        userId: bot._id,
        cardLabel,
        cardValue,
      });

      // Update room activity
      await ctx.db.patch(demoRoomId, {
        lastActivityAt: Date.now(),
      });

      // Check if all bots have voted now
      if (botsWhoHaventVoted.length === 1) {
        // This was the last bot, start countdown
        await ctx.db.patch(demoRoomId, {
          autoRevealCountdownStartedAt: Date.now(),
        });
      }
    }
  },
});
