import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import * as Rooms from "./rooms";
import * as Canvas from "./canvas";

// Bot configuration with famous developer names
export const BOT_CONFIGS = [
  { name: "Ada Lovelace", preferredCards: ["2", "3", "5"] },
  { name: "Grace Hopper", preferredCards: ["5", "8", "13"] },
  { name: "Alan Turing", preferredCards: ["3", "5", "8"] },
  { name: "Katherine Johnson", preferredCards: ["5", "8"] },
  { name: "Dennis Ritchie", preferredCards: ["8", "13", "21"] },
  { name: "Margaret Hamilton", preferredCards: ["3", "5", "8", "13"] },
] as const;

export type BotConfig = (typeof BOT_CONFIGS)[number];

/**
 * Gets the demo room ID if it exists
 */
export async function getDemoRoomId(
  ctx: QueryCtx
): Promise<Id<"rooms"> | null> {
  const demoRoom = await ctx.db
    .query("rooms")
    .filter((q) => q.eq(q.field("isDemoRoom"), true))
    .first();

  return demoRoom?._id ?? null;
}

/**
 * Ensures the demo room exists, creating it if necessary
 */
export async function ensureDemoRoom(
  ctx: MutationCtx
): Promise<Id<"rooms">> {
  // Check if demo room already exists
  const existingRoom = await ctx.db
    .query("rooms")
    .filter((q) => q.eq(q.field("isDemoRoom"), true))
    .first();

  if (existingRoom) {
    // Verify bots exist
    const bots = await ctx.db
      .query("users")
      .withIndex("by_room", (q) => q.eq("roomId", existingRoom._id))
      .filter((q) => q.eq(q.field("isBot"), true))
      .collect();

    if (bots.length < BOT_CONFIGS.length) {
      // Recreate missing bots
      await createDemoBots(ctx, existingRoom._id);
    }

    return existingRoom._id;
  }

  // Create new demo room
  const roomId = await ctx.db.insert("rooms", {
    name: "Planning Poker Demo",
    roomType: "canvas",
    votingCategorized: true,
    autoCompleteVoting: true,
    isDemoRoom: true,
    isGameOver: false,
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
  });

  // Initialize canvas nodes
  await Canvas.initializeCanvasNodes(ctx, { roomId });

  // Create bot users
  await createDemoBots(ctx, roomId);

  return roomId;
}

/**
 * Creates bot users for the demo room
 */
export async function createDemoBots(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<void> {
  const now = Date.now();

  for (const botConfig of BOT_CONFIGS) {
    // Check if bot already exists
    const existingBot = await ctx.db
      .query("users")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .filter((q) => q.eq(q.field("name"), botConfig.name))
      .first();

    if (existingBot) continue;

    // Create bot user
    const userId = await ctx.db.insert("users", {
      roomId,
      name: botConfig.name,
      isSpectator: false,
      isBot: true,
      joinedAt: now,
    });

    // Create player node for bot
    await Canvas.upsertPlayerNode(ctx, { roomId, userId });

    // Create voting card nodes for bot
    await Canvas.createVotingCardNodes(ctx, { roomId, userId });
  }
}

/**
 * Generates a vote for a bot based on their preferences
 */
export function generateBotVote(botName: string): string {
  const botConfig = BOT_CONFIGS.find((b) => b.name === botName);
  if (!botConfig) {
    // Fallback to random card
    const defaultCards = ["3", "5", "8"];
    return defaultCards[Math.floor(Math.random() * defaultCards.length)];
  }

  const cards = botConfig.preferredCards;
  return cards[Math.floor(Math.random() * cards.length)];
}

/**
 * Resets the demo room to a clean state
 */
export async function resetDemoRoom(ctx: MutationCtx): Promise<void> {
  const demoRoomId = await getDemoRoomId(ctx);
  if (!demoRoomId) return;

  await Rooms.resetRoomGame(ctx, demoRoomId);
}

/**
 * Gets full demo room data for rendering
 */
export async function getDemoRoomData(ctx: QueryCtx) {
  const demoRoomId = await getDemoRoomId(ctx);
  if (!demoRoomId) return null;

  return await Rooms.getRoomWithRelatedData(ctx, demoRoomId);
}
