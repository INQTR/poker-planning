/**
 * Admin operations for database maintenance.
 * These functions are internal-only and require explicit confirmation.
 */

import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const DELETE_CONFIRMATION = "I understand this will delete all data permanently";

/**
 * Permanently deletes ALL data from the database.
 *
 * Tables affected: rooms, issues, users, roomMemberships, votes,
 * canvasNodes, canvasState, presence
 *
 * This action cannot be undone.
 *
 * @example
 * // Local
 * npx convex run admin:dangerouslyDeleteAllData \
 *   '{"confirm": "I understand this will delete all data permanently"}'
 *
 * // Production
 * npx convex run --prod admin:dangerouslyDeleteAllData \
 *   '{"confirm": "I understand this will delete all data permanently"}'
 */
export const dangerouslyDeleteAllData = internalMutation({
  args: {
    confirm: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.confirm !== DELETE_CONFIRMATION) {
      throw new Error(
        `Safety check failed. Pass confirm: "${DELETE_CONFIRMATION}"`
      );
    }

    const tables = [
      "votes",
      "canvasNodes",
      "canvasState",
      "presence",
      "roomMemberships",
      "issues",
      "rooms",
      "users",
    ] as const;

    const results: Record<string, number> = {};

    for (const table of tables) {
      let count = 0;
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
        count++;
      }
      results[table] = count;
    }

    console.log("All data deleted:", results);

    return results;
  },
});
