import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    name: v.string(),
    autoCompleteVoting: v.boolean(),
    autoRevealCountdownStartedAt: v.optional(v.number()), // Timestamp when countdown began
    autoRevealScheduledId: v.optional(v.id("_scheduled_functions")), // Scheduled function ID for auto-reveal
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
    // Issues panel feature
    currentIssueId: v.optional(v.id("issues")), // Currently active issue being voted
    nextIssueNumber: v.optional(v.number()), // Counter for sequential IDs (1, 2, 3...)
    createdAt: v.number(),
    lastActivityAt: v.number(),
    // Room permissions & ownership
    ownerId: v.optional(v.id("users")),
    permissions: v.optional(
      v.object({
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
      })
    ),
  })
    .index("by_activity", ["lastActivityAt"])
    .index("by_created", ["createdAt"]), // For querying recent rooms

  issues: defineTable({
    roomId: v.id("rooms"),
    sequentialId: v.number(), // 1, 2, 3... displayed as PP-1, PP-2, etc.
    title: v.string(), // e.g., "CC-278" or "User authentication"
    finalEstimate: v.optional(v.string()), // Consensus value after reveal
    status: v.union(
      v.literal("pending"), // Not yet voted
      v.literal("voting"), // Currently being voted on
      v.literal("completed") // Voting complete
    ),
    votedAt: v.optional(v.number()), // Timestamp when voting completed
    // Vote statistics snapshot (stored when voting is revealed)
    voteStats: v.optional(
      v.object({
        average: v.optional(v.number()), // Average of numeric votes
        median: v.optional(v.number()), // Median of numeric votes
        agreement: v.number(), // Percentage of votes matching consensus
        voteCount: v.number(), // Total votes cast
        timeToConsensusMs: v.optional(v.number()), // Total voting duration across all rounds
      })
    ),
    createdAt: v.number(),
    order: v.number(), // For ordering in the list
  })
    .index("by_room", ["roomId"])
    .index("by_room_order", ["roomId", "order"]),

  // Global user identity (one per person)
  users: defineTable({
    authUserId: v.string(), // BetterAuth ID (required, unique)
    name: v.string(),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    accountType: v.optional(v.union(v.literal("anonymous"), v.literal("permanent"))),
    createdAt: v.number(),
  })
    .index("by_auth_user", ["authUserId"])
    .index("by_email", ["email"]),

  // Room memberships (user <-> room relationship)
  roomMemberships: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"), // FK to global users
    isSpectator: v.boolean(),
    isBot: v.optional(v.boolean()),
    role: v.optional(
      v.union(
        v.literal("owner"),
        v.literal("facilitator"),
        v.literal("participant")
      )
    ),
    joinedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_room_user", ["roomId", "userId"]),

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
    nodeId: v.string(), // e.g., "player-userId", "session-current", "note-issueId"
    type: v.union(
      v.literal("player"),
      v.literal("session"),
      v.literal("timer"),
      v.literal("results"),
      v.literal("story"),
      v.literal("note")
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
    .index("by_last_updated", ["lastUpdatedAt"]) // For activity tracking
    .index("by_last_updated_by", ["lastUpdatedBy"]), // For account linking transfers

  // Voting round timestamps for time-to-consensus tracking
  votingTimestamps: defineTable({
    roomId: v.id("rooms"),
    issueId: v.id("issues"),
    votingStartedAt: v.number(),
    votingEndedAt: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    roundNumber: v.number(),
  })
    .index("by_issue", ["issueId"])
    .index("by_room", ["roomId"]),
});
