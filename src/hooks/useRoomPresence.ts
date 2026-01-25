"use client";

import { useMemo } from "react";
import usePresence from "@convex-dev/presence/react";
import type { RoomUserData } from "@/convex/model/users";
import { api } from "@/convex/_generated/api";

export interface UserWithPresence extends RoomUserData {
  isOnline: boolean;
  lastSeen: number | null; // Timestamp when user was last online (null if currently online)
}

/**
 * Hook that combines room user data with presence information.
 * Returns users with their online status and last seen timestamp.
 *
 * @param roomId - The room identifier
 * @param userId - The current user's ID (used for heartbeats)
 * @param users - The room users from roomData
 * @returns Array of users with isOnline status and lastSeen timestamp
 */
export function useRoomPresence(
  roomId: string,
  userId: string,
  users: RoomUserData[]
): UserWithPresence[] {
  // Subscribe to presence updates for this room
  const presenceState = usePresence(api.presence, roomId, userId);

  // Merge presence data with user data
  const usersWithPresence = useMemo(() => {
    if (!presenceState) {
      // While loading, show all users as offline with no last seen
      return users.map((user) => ({
        ...user,
        isOnline: false,
        lastSeen: null,
      }));
    }

    // Create a map of presence data by userId
    const presenceByUserId = new Map(
      presenceState.map((p) => [p.userId, p])
    );

    return users.map((user) => {
      const presence = presenceByUserId.get(user._id);
      return {
        ...user,
        isOnline: presence?.online ?? false,
        lastSeen: presence?.online ? null : (presence?.lastDisconnected ?? null),
      };
    });
  }, [users, presenceState]);

  return usersWithPresence;
}
