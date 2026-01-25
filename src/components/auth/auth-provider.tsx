"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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

  // Convert BetterAuth session to AuthUser (null if no session yet)
  const authUser: AuthUser | null = session?.user
    ? {
        authUserId: session.user.id,
        preferredName: session.user.name ?? undefined,
      }
    : null;

  const isLoading = sessionLoading;

  return (
    <AuthContext.Provider
      value={{ authUser, roomUser, setRoomUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
