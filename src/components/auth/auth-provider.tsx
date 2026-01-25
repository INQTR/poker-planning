"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";

// BetterAuth user - account-level identity
interface AuthUser {
  authUserId: string;
  preferredName?: string;
}

// Room membership record
interface RoomUser {
  id: Id<"users">;
  name: string;
  roomId: Id<"rooms">;
}

interface AuthContextType {
  // BetterAuth account (persists across rooms)
  authUser: AuthUser | null;
  // Room membership (specific to current room, derived from queries)
  roomUser: RoomUser | null;
  setRoomUser: (user: RoomUser | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  roomUser: null,
  setRoomUser: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [roomUser, setRoomUser] = useState<RoomUser | null>(null);

  // Memoize authUser to prevent object recreation on every render
  const authUser = useMemo<AuthUser | null>(
    () =>
      session?.user
        ? {
            authUserId: session.user.id,
            preferredName: session.user.name ?? undefined,
          }
        : null,
    [session]
  );

  const isLoading = sessionLoading;

  // Memoize context value to prevent cascading re-renders in consumers
  const value = useMemo(
    () => ({ authUser, roomUser, setRoomUser, isLoading }),
    [authUser, roomUser, setRoomUser, isLoading]
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
