"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";

interface AuthContextType {
  // BetterAuth user ID (needed for mutations that require authUserId)
  authUserId: string | null;
  // Whether the user is anonymous (from BetterAuth session)
  isAnonymous: boolean;
  // Auth loading state (from Convex - waits for token validation)
  isLoading: boolean;
  // Whether user is authenticated (from Convex - token validated)
  isAuthenticated: boolean;
  // User's email address (for permanent accounts)
  email: string | null;
  // Whether this is a guest or permanent account
  accountType: "anonymous" | "permanent" | null;
}

const AuthContext = createContext<AuthContextType>({
  authUserId: null,
  isAnonymous: false,
  isLoading: true,
  isAuthenticated: false,
  email: null,
  accountType: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use Convex's auth state - this waits for token validation
  // Per docs: "Better Auth will reflect an authenticated user before Convex does"
  const { isAuthenticated, isLoading: convexAuthLoading } = useConvexAuth();

  // Still need BetterAuth session for authUserId (used in mutations)
  const { data: session } = authClient.useSession();
  const authUserId = session?.user?.id;

  const globalUser = useQuery(
    api.users.getGlobalUser,
    authUserId ? { authUserId } : "skip"
  );

  // Memoize context value to prevent cascading re-renders in consumers
  const value = useMemo(
    () => ({
      authUserId: authUserId ?? null,
      isAnonymous: session?.user?.isAnonymous ?? false,
      isLoading: convexAuthLoading,
      isAuthenticated,
      email: globalUser?.email ?? null,
      accountType: globalUser?.accountType ?? null,
    }),
    [session, convexAuthLoading, isAuthenticated, globalUser, authUserId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
