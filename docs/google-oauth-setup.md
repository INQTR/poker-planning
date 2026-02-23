# Google Cloud Console Setup Guide

This guide explains how to configure Google OAuth 2.0 credentials for AgileKit's authentication system. This is required for the "Continue with Google" sign-in functionality.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the **Project Dropdown** at the top left and select **New Project**.
3. Name your project (e.g., `agilekit-auth`) and click **Create**.
4. Once created, make sure you have the project selected in the top navigation bar.

## 2. Configure OAuth Consent Screen

Before you can create credentials, you need to configure the OAuth consent screen.

1. In the left sidebar, navigate to **APIs & Services** > **OAuth consent screen**.
2. Select **External** (unless you are restricting this app to users within your own Google Workspace organization).
3. Click **Create**.
4. Fill out the required App information:
   - **App name:** `AgileKit` (or your preferred name)
   - **User support email:** Your email address
   - **Developer contact information:** Your email address
5. Add an App Logo if desired (must be square).
6. Under **Authorized domains**, you will eventually need to add your production domain (e.g., `agilekit.app`). You can skip this for local development.
7. Click **Save and Continue**.
8. On the **Scopes** step, click **Add or Remove Scopes**.
9. Select the following standard scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
10. Click **Update**, then **Save and Continue**.
11. Add yourself as a **Test User** while the app is in the "Testing" publishing status.
12. Click **Save and Continue**.

## 3. Create OAuth 2.0 Credentials

Now you can generate the Client ID and Secret needed by BetterAuth.

1. In the left sidebar, navigate to **APIs & Services** > **Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. Set the **Application type** to **Web application**.
4. Name the client (e.g., `AgileKit Web Client`).
5. Under **Authorized redirect URIs**, click **+ Add URI**.
6. Add the redirect URI for your environment:
   - **Local Development:** `http://localhost:3000/api/auth/callback/google`
   - **Convex Dev Deployment:** `https://your-convex-site-url.convex.site/api/auth/callback/google`
   - **Production:** `https://agilekit.app/api/auth/callback/google`
7. Click **Create**.

A modal will appear containing your **Client ID** and **Client Secret**.

## 4. Set Environment Variables

You need to add these credentials to your Convex backend environment, as BetterAuth runs on the Convex server.

Run the following commands in your terminal (replace with your actual values):

```bash
# Set Google Client ID
npx convex env set GOOGLE_CLIENT_ID "your-client-id-here.apps.googleusercontent.com"

# Set Google Client Secret
npx convex env set GOOGLE_CLIENT_SECRET "your-client-secret-here"
```

## Troubleshooting

- **Redirect URI Mismatch Error:** If Google shows a `redirect_uri_mismatch` error during login, ensure that the URI exactly matches what is configured in the Google Cloud Console. Note that BetterAuth automatically appends `/api/auth/callback/google` to the `baseURL` defined in `convex/auth.ts` (which pulls from `SITE_URL`).
- **Missing Avatar or Email:** Ensure that you have properly requested the `profile` and `email` scopes in the OAuth consent screen.