import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/dashboard/settings?tab=integrations&error=jira_unauthorized");
  }

  const clientId = process.env.JIRA_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

  if (!clientId || !appUrl) {
    redirect("/dashboard/settings?tab=integrations&error=jira_not_configured");
  }

  // CSRF protection: store random state in httpOnly cookie
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("jira_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  const params = new URLSearchParams({
    audience: "api.atlassian.com",
    client_id: clientId,
    scope:
      "read:jira-work write:jira-work read:project:jira read:board-scope:jira-software read:sprint:jira-software read:issue:jira-software write:issue:jira-software offline_access",
    redirect_uri: `${appUrl}/api/integrations/jira/callback`,
    state,
    response_type: "code",
    prompt: "consent",
  });

  return Response.redirect(
    `https://auth.atlassian.com/authorize?${params.toString()}`
  );
}
