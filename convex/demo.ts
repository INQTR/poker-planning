import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import * as Demo from "./model/demo";
import * as Rooms from "./model/rooms";
import {
  COUNTDOWN_DURATION_MS,
  DEMO_VOTE_PROBABILITY,
  DEMO_RESULTS_DISPLAY_MS,
} from "./constants";

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
 * State machine: voting → countdown → reveal → display results → reset
 */
export const runDemoCycle = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Ensure demo room exists
    const demoRoomId = await Demo.ensureDemoRoom(ctx);

    // Get room state
    const room = await ctx.db.get(demoRoomId);
    if (!room) return;

    // State 1: Results are displayed (game over)
    if (room.isGameOver) {
      const timeSinceReveal = Date.now() - room.lastActivityAt;
      if (timeSinceReveal > DEMO_RESULTS_DISPLAY_MS) {
        await Demo.resetDemoRoom(ctx);
      }
      return;
    }

    // State 2: Countdown is active - check if expired
    if (room.autoRevealCountdownStartedAt) {
      const elapsed = Date.now() - room.autoRevealCountdownStartedAt;
      if (elapsed >= COUNTDOWN_DURATION_MS) {
        // Countdown expired, reveal cards
        await Rooms.showRoomCards(ctx, demoRoomId);
      }
      // Wait during countdown (don't vote)
      return;
    }

    // State 3: Voting phase
    const [botMemberships, votes] = await Promise.all([
      ctx.db
        .query("roomMemberships")
        .withIndex("by_room", (q) => q.eq("roomId", demoRoomId))
        .filter((q) => q.eq(q.field("isBot"), true))
        .collect(),
      ctx.db
        .query("votes")
        .withIndex("by_room", (q) => q.eq("roomId", demoRoomId))
        .collect(),
    ]);

    // Get bot user data
    const bots = await Promise.all(
      botMemberships.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        return { ...user!, membershipId: m._id, userId: m.userId };
      })
    );

    const votedUserIds = new Set(votes.map((v) => v.userId.toString()));
    const botsWhoHaventVoted = bots.filter(
      (bot) => !votedUserIds.has(bot.userId.toString())
    );

    if (botsWhoHaventVoted.length > 0) {
      // Random chance to vote this cycle (more natural pacing)
      if (Math.random() > DEMO_VOTE_PROBABILITY) {
        return;
      }

      // Shuffle bots and pick 1-3 to vote this cycle
      const shuffled = [...botsWhoHaventVoted].sort(() => Math.random() - 0.5);
      const maxVoters = Math.min(shuffled.length, Math.floor(Math.random() * 3) + 1);
      const botsToVote = shuffled.slice(0, maxVoters);

      // Make selected bots vote
      await Promise.all(
        botsToVote.map(async (bot) => {
          const cardLabel = Demo.generateBotVote(bot.name);
          const cardValue = parseInt(cardLabel) || 0;

          await ctx.db.insert("votes", {
            roomId: demoRoomId,
            userId: bot.userId,
            cardLabel,
            cardValue,
          });
        })
      );

      await ctx.db.patch(demoRoomId, {
        lastActivityAt: Date.now(),
      });

      // Check if all bots have now voted
      if (botsWhoHaventVoted.length === botsToVote.length) {
        // Start countdown
        await ctx.db.patch(demoRoomId, {
          autoRevealCountdownStartedAt: Date.now(),
        });
      }
    }
  },
});
