import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    name: v.string(),
    votingCategorized: v.boolean(),
    autoCompleteVoting: v.boolean(),
    autoRevealCountdownStartedAt: v.optional(v.number()), // Timestamp when countdown began
    roomType: v.optional(v.literal("canvas")), // Optional for backward compatibility
    isGameOver: v.boolean(),
    isDemoRoom: v.optional(v.boolean()), // Mark the global demo room
    votingScale: v.optional(
      v.object({
        type: v.union(
          v.literal("fibonacci"),
          v.literal("standard"),
          v.literal("tshirt"),
          v.literal("custom")
        ),
        cards: v.array(v.string()),
        isNumeric: v.boolean(),
      })
    ),
    createdAt: v.number(),
    lastActivityAt: v.number(),
  })
    .index("by_activity", ["lastActivityAt"])
    .index("by_created", ["createdAt"]), // For querying recent rooms

  users: defineTable({
    roomId: v.id("rooms"),
    name: v.string(),
    isSpectator: v.boolean(),
    isBot: v.optional(v.boolean()), // Mark bot users for demo room
    joinedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_join", ["roomId", "joinedAt"]),

  votes: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    cardLabel: v.optional(v.string()),
    cardValue: v.optional(v.number()),
    cardIcon: v.optional(v.string()),
  })
    .index("by_room", ["roomId"])
    .index("by_room_user", ["roomId", "userId"])
    .index("by_user", ["userId"]), // For user-specific queries

  // Canvas persistence tables
  canvasNodes: defineTable({
    roomId: v.id("rooms"),
    nodeId: v.string(), // e.g., "player-userId", "session-current"
    type: v.union(
      v.literal("player"),
      v.literal("session"),
      v.literal("timer"),
      v.literal("votingCard"),
      v.literal("results"),
      v.literal("story")
    ),
    position: v.object({ x: v.number(), y: v.number() }),
    data: v.any(), // Node-specific data
    isLocked: v.optional(v.boolean()), // Prevent accidental moves
    lastUpdatedBy: v.optional(v.id("users")),
    lastUpdatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_node", ["roomId", "nodeId"])
    .index("by_room_type", ["roomId", "type"]) // For type-specific queries
    .index("by_last_updated", ["lastUpdatedAt"]), // For activity tracking

  canvasState: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    viewport: v.object({
      x: v.number(),
      y: v.number(),
      zoom: v.number(),
    }),
    lastUpdatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_user", ["roomId", "userId"]),

  presence: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    cursor: v.optional(v.object({ x: v.number(), y: v.number() })),
    isActive: v.boolean(),
    lastPing: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_user", ["roomId", "userId"])
    .index("by_last_ping", ["lastPing"]), // For cleanup
});
