import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import presence from "@convex-dev/presence/convex.config.js";

const app = defineApp();
app.use(betterAuth);
app.use(presence);

export default app;
