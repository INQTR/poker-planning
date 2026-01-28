"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  // BetterAuth user ID (needed for mutations that require authUserId)
  authUserId: string | null;
  // Whether the user is anonymous (from BetterAuth session)
  isAnonymous: boolean;
  // Auth loading state (from Convex - waits for token validation)
  isLoading: boolean;
  // Whether user is authenticated (from Convex - token validated)
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  authUserId: null,
  isAnonymous: false,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use Convex's auth state - this waits for token validation
  // Per docs: "Better Auth will reflect an authenticated user before Convex does"
  const { isAuthenticated, isLoading: convexAuthLoading } = useConvexAuth();

  // Still need BetterAuth session for authUserId (used in mutations)
  const { data: session } = authClient.useSession();

  // Memoize context value to prevent cascading re-renders in consumers
  const value = useMemo(
    () => ({
      authUserId: session?.user?.id ?? null,
      isAnonymous: session?.user?.isAnonymous ?? false,
      isLoading: convexAuthLoading,
      isAuthenticated,
    }),
    [session, convexAuthLoading, isAuthenticated],
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
