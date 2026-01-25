import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import * as Canvas from "./model/canvas";

// Initialize canvas nodes when a canvas room is created
export const initializeCanvasNodes = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    await Canvas.initializeCanvasNodes(ctx, args);
  },
});

// Get all canvas nodes for a room
export const getCanvasNodes = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await Canvas.getCanvasNodes(ctx, args.roomId);
  },
});

// Update node position
export const updateNodePosition = mutation({
  args: {
    roomId: v.id("rooms"),
    nodeId: v.string(),
    position: v.object({ x: v.number(), y: v.number() }),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await Canvas.updateNodePosition(ctx, args);
  },
});

// Create or update player node
export const upsertPlayerNode = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    position: v.optional(v.object({ x: v.number(), y: v.number() })),
  },
  handler: async (ctx, args) => {
    return await Canvas.upsertPlayerNode(ctx, args);
  },
});

// Create or update results node
export const upsertResultsNode = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await Canvas.upsertResultsNode(ctx, args);
  },
});

// Remove player node when user leaves
export const removePlayerNode = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await Canvas.removePlayerNode(ctx, args);
  },
});

// Lock/unlock node
export const toggleNodeLock = mutation({
  args: {
    roomId: v.id("rooms"),
    nodeId: v.string(),
    locked: v.boolean(),
  },
  handler: async (ctx, args) => {
    await Canvas.toggleNodeLock(ctx, args);
  },
});

// Update user viewport state
export const updateViewport = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    viewport: v.object({
      x: v.number(),
      y: v.number(),
      zoom: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await Canvas.updateViewport(ctx, args);
  },
});

// Get viewports for all users in a room
export const getViewports = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const viewports = await ctx.db
      .query("canvasState")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    return viewports;
  },
});

// Update user presence (cursor position, active state)
export const updatePresence = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
    cursor: v.optional(v.object({ x: v.number(), y: v.number() })),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await Canvas.updatePresence(ctx, args);
  },
});

// Get active presence for all users in a room
export const getPresence = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return presence;
  },
});

// Clean up inactive presence (to be called by a cron job)
export const cleanupInactivePresence = mutation({
  args: {},
  handler: async (ctx) => {
    await Canvas.cleanupInactivePresence(ctx);
  },
});

// Mark user as inactive when they leave
export const markUserInactive = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await Canvas.markUserInactive(ctx, args);
  },
});

// Create a note node for an issue
export const createNote = mutation({
  args: {
    roomId: v.id("rooms"),
    issueId: v.id("issues"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await Canvas.createNoteNode(ctx, args);
  },
});

// Update note content
export const updateNoteContent = mutation({
  args: {
    roomId: v.id("rooms"),
    nodeId: v.string(),
    content: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await Canvas.updateNoteContent(ctx, args);
  },
});

// Get note content for an issue (for export)
export const getNoteContentForIssue = query({
  args: {
    roomId: v.id("rooms"),
    issueId: v.id("issues"),
  },
  handler: async (ctx, args) => {
    return await Canvas.getNoteContentForIssue(ctx, args);
  },
});

// Delete a note node
export const deleteNote = mutation({
  args: {
    roomId: v.id("rooms"),
    nodeId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await Canvas.deleteNoteNode(ctx, args);
  },
});
