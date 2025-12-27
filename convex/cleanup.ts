import { internalMutation } from "./_generated/server";
import * as Cleanup from "./model/cleanup";

export const removeInactiveRooms = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Use default 5 days for inactivity
    return await Cleanup.removeInactiveRooms(ctx, 5);
  },
});