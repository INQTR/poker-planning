import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run daily at 3 AM UTC
crons.daily(
  "cleanup-inactive-rooms",
  { hourUTC: 3, minuteUTC: 0 },
  internal.cleanup.removeInactiveRooms
);

// Demo room automation - run every 8 seconds to cycle bots through voting
crons.interval(
  "demo-room-automation",
  { seconds: 8 },
  internal.demo.runDemoCycle
);

export default crons;