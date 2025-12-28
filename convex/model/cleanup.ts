import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export interface CleanupResult {
  roomsDeleted: number;
  votesDeleted: number;
  usersDeleted: number;
  canvasNodesDeleted?: number;
  canvasStatesDeleted?: number;
  presenceDeleted?: number;
}

/**
 * Removes inactive rooms and all associated data
 * @param inactiveDays - Number of days of inactivity before a room is considered inactive
 */
export async function removeInactiveRooms(
  ctx: MutationCtx,
  inactiveDays: number = 5
): Promise<CleanupResult> {
  const cutoffTime = Date.now() - (inactiveDays * 24 * 60 * 60 * 1000);

  // Find inactive rooms (excluding demo rooms which should never be deleted)
  const inactiveRooms = await ctx.db
    .query("rooms")
    .withIndex("by_activity", (q) => q.lt("lastActivityAt", cutoffTime))
    .filter((q) => q.neq(q.field("isDemoRoom"), true))
    .collect();

  console.log(`Found ${inactiveRooms.length} inactive rooms to clean up`);

  const result: CleanupResult = {
    roomsDeleted: 0,
    votesDeleted: 0,
    usersDeleted: 0,
    canvasNodesDeleted: 0,
    canvasStatesDeleted: 0,
    presenceDeleted: 0,
  };

  // Process each room
  for (const room of inactiveRooms) {
    const cleanupStats = await cleanupRoom(ctx, room._id);
    
    // Aggregate stats
    result.votesDeleted += cleanupStats.votesDeleted;
    result.usersDeleted += cleanupStats.usersDeleted;
    result.canvasNodesDeleted! += cleanupStats.canvasNodesDeleted || 0;
    result.canvasStatesDeleted! += cleanupStats.canvasStatesDeleted || 0;
    result.presenceDeleted! += cleanupStats.presenceDeleted || 0;
    result.roomsDeleted++;

    console.log(`Cleaned up room ${room.name} (${room._id})`);
  }

  return result;
}

/**
 * Cleans up all data associated with a single room
 */
export async function cleanupRoom(
  ctx: MutationCtx,
  roomId: Id<"rooms">
): Promise<Omit<CleanupResult, "roomsDeleted">> {
  // Get all related data in parallel
  const [votes, users, canvasNodes, canvasStates, presence] = await Promise.all([
    ctx.db
      .query("votes")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect(),
    ctx.db
      .query("users")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect(),
    ctx.db
      .query("canvasNodes")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect(),
    ctx.db
      .query("canvasState")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect(),
    ctx.db
      .query("presence")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect(),
  ]);

  // Delete all related data in parallel
  const deletePromises: Promise<void>[] = [];

  // Delete votes
  deletePromises.push(...votes.map((vote) => ctx.db.delete(vote._id)));

  // Delete users
  deletePromises.push(...users.map((user) => ctx.db.delete(user._id)));

  // Delete canvas nodes
  deletePromises.push(...canvasNodes.map((node) => ctx.db.delete(node._id)));

  // Delete canvas states
  deletePromises.push(...canvasStates.map((state) => ctx.db.delete(state._id)));

  // Delete presence
  deletePromises.push(...presence.map((p) => ctx.db.delete(p._id)));

  // Wait for all deletions to complete
  await Promise.all(deletePromises);

  // Delete the room itself
  await ctx.db.delete(roomId);

  return {
    votesDeleted: votes.length,
    usersDeleted: users.length,
    canvasNodesDeleted: canvasNodes.length,
    canvasStatesDeleted: canvasStates.length,
    presenceDeleted: presence.length,
  };
}

/**
 * Removes orphaned data (data without associated rooms)
 * Optimized to avoid N+1 queries by batching room existence checks
 */
export async function cleanupOrphanedData(ctx: MutationCtx): Promise<{
  orphanedVotes: number;
  orphanedUsers: number;
  orphanedCanvasNodes: number;
  orphanedCanvasStates: number;
  orphanedPresence: number;
}> {
  // Get all existing room IDs once
  const allRooms = await ctx.db.query("rooms").collect();
  const existingRoomIds = new Set(allRooms.map(room => room._id));

  // Process each table in parallel
  const [
    orphanedVotes,
    orphanedUsers,
    orphanedCanvasNodes,
    orphanedCanvasStates,
    orphanedPresence
  ] = await Promise.all([
    // Clean orphaned votes
    cleanupOrphanedRecords(ctx, "votes", existingRoomIds),
    // Clean orphaned users
    cleanupOrphanedRecords(ctx, "users", existingRoomIds),
    // Clean orphaned canvas nodes
    cleanupOrphanedRecords(ctx, "canvasNodes", existingRoomIds),
    // Clean orphaned canvas states
    cleanupOrphanedRecords(ctx, "canvasState", existingRoomIds),
    // Clean orphaned presence
    cleanupOrphanedRecords(ctx, "presence", existingRoomIds),
  ]);

  return {
    orphanedVotes,
    orphanedUsers,
    orphanedCanvasNodes,
    orphanedCanvasStates,
    orphanedPresence,
  };
}

/**
 * Helper function to clean orphaned records from a specific table
 * Processes records in batches to avoid overwhelming the system
 */
async function cleanupOrphanedRecords(
  ctx: MutationCtx,
  tableName: "votes" | "users" | "canvasNodes" | "canvasState" | "presence",
  existingRoomIds: Set<Id<"rooms">>
): Promise<number> {
  const BATCH_SIZE = 100;
  let orphanedCount = 0;
  let hasMore = true;
  let lastId: string | undefined;

  while (hasMore) {
    // Query a batch of records
    const query = ctx.db.query(tableName);
    
    // For pagination, we'll use the ID as a cursor
    // This is more efficient than using skip/take
    if (lastId) {
      // Get records after the last processed ID
      const records = await query.collect();
      const startIndex = records.findIndex(r => r._id > lastId!) + 1;
      const batch = records.slice(startIndex, startIndex + BATCH_SIZE);
      
      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      // Process the batch
      const deletePromises: Promise<void>[] = [];
      for (const record of batch) {
        if (!existingRoomIds.has(record.roomId)) {
          deletePromises.push(ctx.db.delete(record._id));
          orphanedCount++;
        }
      }
      
      // Execute deletions in parallel
      await Promise.all(deletePromises);
      
      // Update cursor
      lastId = batch[batch.length - 1]._id;
      hasMore = batch.length === BATCH_SIZE;
    } else {
      // First batch
      const batch = await query.take(BATCH_SIZE);
      
      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      // Process the batch
      const deletePromises: Promise<void>[] = [];
      for (const record of batch) {
        if (!existingRoomIds.has(record.roomId)) {
          deletePromises.push(ctx.db.delete(record._id));
          orphanedCount++;
        }
      }
      
      // Execute deletions in parallel
      await Promise.all(deletePromises);
      
      // Update cursor
      lastId = batch[batch.length - 1]._id;
      hasMore = batch.length === BATCH_SIZE;
    }
  }

  return orphanedCount;
}