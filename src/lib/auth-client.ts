"use client";

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { anonymousClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    convexClient(),
    anonymousClient(),
    magicLinkClient(),
  ],
});

// Export typed hooks for convenience
export const { useSession, signIn, signOut, signUp } = authClient;
