import { internalMutation } from "./_generated/server";
import * as Cleanup from "./model/cleanup";

/**
 * Internal mutation to clean up orphaned data
 * This should be called periodically or manually by administrators
 */
export const cleanupOrphanedData = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting orphaned data cleanup...");
    const result = await Cleanup.cleanupOrphanedData(ctx);
    console.log("Orphaned data cleanup complete:", result);
    return result;
  },
});