import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAuthAction } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    redirect("/dashboard/settings?tab=integrations&error=jira_denied");
  }

  if (!code || !state) {
    redirect("/dashboard/settings?tab=integrations&error=jira_invalid");
  }

  // Verify CSRF state
  const cookieStore = await cookies();
  const storedState = cookieStore.get("jira_oauth_state")?.value;
  cookieStore.delete("jira_oauth_state");

  if (!storedState || storedState !== state) {
    redirect("/dashboard/settings?tab=integrations&error=jira_state_mismatch");
  }

  const clientId = process.env.JIRA_CLIENT_ID!;
  const clientSecret = process.env.JIRA_CLIENT_SECRET!;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL!;

  // Exchange code for tokens
  const tokenResponse = await fetch(
    "https://auth.atlassian.com/oauth/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${appUrl}/api/integrations/jira/callback`,
      }),
    }
  );

  if (!tokenResponse.ok) {
    console.error(
      "Jira token exchange failed:",
      await tokenResponse.text()
    );
    redirect("/dashboard/settings?tab=integrations&error=jira_token_failed");
  }

  const tokens = await tokenResponse.json();

  // Get accessible resources (Cloud ID)
  const resourcesResponse = await fetch(
    "https://api.atlassian.com/oauth/token/accessible-resources",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }
  );

  if (!resourcesResponse.ok) {
    console.error(
      "Jira resources fetch failed:",
      await resourcesResponse.text()
    );
    redirect(
      "/dashboard/settings?tab=integrations&error=jira_resources_failed"
    );
  }

  const resources = await resourcesResponse.json();
  const cloudId = resources[0]?.id;
  const siteUrl = resources[0]?.url;

  if (!cloudId) {
    redirect(
      "/dashboard/settings?tab=integrations&error=jira_no_site"
    );
  }

  try {
    // Get Jira user info for metadata
    const jiraUserResponse = await fetch(
      "https://api.atlassian.com/me",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    const jiraUser = jiraUserResponse.ok
      ? await jiraUserResponse.json()
      : null;

    // Call public action via user's auth session (fetchAuthAction
    // carries the user's session cookie automatically)
    await fetchAuthAction(api.integrations.jira.connectJira, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      cloudId,
      siteUrl,
      scopes: (tokens.scope as string).split(" "),
      providerUserId: jiraUser?.account_id,
      providerUserEmail: jiraUser?.email,
    });
  } catch (err) {
    console.error("Failed to store Jira connection:", err);
    redirect(
      "/dashboard/settings?tab=integrations&error=jira_store_failed"
    );
  }

  redirect("/dashboard/settings?tab=integrations&connected=jira");
}
