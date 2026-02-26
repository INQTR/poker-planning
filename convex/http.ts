import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Jira webhook endpoint — receives issue updates from Jira Cloud
http.route({
  path: "/webhooks/jira",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Verify webhook authenticity via shared secret header.
      // Jira sends the secret as a query parameter or header when registered.
      const webhookSecret = process.env.JIRA_WEBHOOK_SECRET;
      if (webhookSecret) {
        const url = new URL(request.url);
        const token = url.searchParams.get("secret")
          ?? request.headers.get("x-hub-secret");
        if (token !== webhookSecret) {
          console.warn("Jira webhook rejected: invalid secret");
          return new Response("Forbidden", { status: 403 });
        }
      }

      const payload = await request.json();
      const eventType = payload.webhookEvent as string;
      const issue = payload.issue;

      if (!issue?.key) {
        return new Response(null, { status: 200 });
      }

      // Build a stable dedup key. Use Jira's own timestamp field which is
      // consistent across retries of the same delivery. Never fall back to
      // Date.now() — that would make retries non-deduplicable.
      if (!payload.timestamp) {
        console.warn("Jira webhook missing timestamp, skipping");
        return new Response(null, { status: 200 });
      }
      const eventKey = `jira:${issue.id}:${payload.timestamp}`;

      // Dedup + processing happen in a single mutation (atomic).
      // This avoids the race where concurrent deliveries both pass a
      // separate query check and then both insert + process.
      await ctx.runMutation(internal.integrations.jira.processJiraWebhook, {
        eventKey,
        eventType,
        issueKey: issue.key,
        issueSummary: issue.fields?.summary,
      });

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Jira webhook error:", error);
      return new Response(null, { status: 200 }); // Always 200 to prevent retries
    }
  }),
});

export default http;
