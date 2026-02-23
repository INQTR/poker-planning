import { query } from "./_generated/server";
import { v } from "convex/values";
import * as Analytics from "./model/analytics";

const dateRangeValidator = v.optional(
  v.object({
    from: v.number(),
    to: v.number(),
  })
);

// Get summary stats for dashboard header
export const getSummary = query({
  args: {
    authUserId: v.string(),
    dateRange: dateRangeValidator,
  },
  handler: async (ctx, args) => {
    return await Analytics.getDashboardSummary(
      ctx,
      args.authUserId,
      args.dateRange
    );
  },
});

// Get session history list
export const getSessions = query({
  args: {
    authUserId: v.string(),
    dateRange: dateRangeValidator,
  },
  handler: async (ctx, args) => {
    return await Analytics.getUserSessions(ctx, args.authUserId, args.dateRange);
  },
});

// Get agreement trend data for line chart
export const getAgreementTrend = query({
  args: {
    authUserId: v.string(),
    dateRange: dateRangeValidator,
  },
  handler: async (ctx, args) => {
    return await Analytics.getAgreementTrend(
      ctx,
      args.authUserId,
      args.dateRange
    );
  },
});

// Get velocity stats for bar chart
export const getVelocityStats = query({
  args: {
    authUserId: v.string(),
    dateRange: dateRangeValidator,
  },
  handler: async (ctx, args) => {
    return await Analytics.getVelocityStats(
      ctx,
      args.authUserId,
      args.dateRange
    );
  },
});

// Get vote distribution for histogram
export const getVoteDistribution = query({
  args: {
    authUserId: v.string(),
    dateRange: dateRangeValidator,
  },
  handler: async (ctx, args) => {
    return await Analytics.getVoteDistribution(
      ctx,
      args.authUserId,
      args.dateRange
    );
  },
});

// Get participation statistics
export const getParticipationStats = query({
  args: {
    authUserId: v.string(),
    dateRange: dateRangeValidator,
  },
  handler: async (ctx, args) => {
    return await Analytics.getParticipationStats(
      ctx,
      args.authUserId,
      args.dateRange
    );
  },
});
