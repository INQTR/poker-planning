"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoomCanvas } from "@/components/room/room-canvas";
import { JoinRoomDialog } from "@/components/room/join-room-dialog";
import { useAuth } from "@/components/auth/auth-provider";
import { Id } from "@/convex/_generated/dataModel";

export function RoomContent() {
  const params = useParams();
  const roomId = params.roomId as Id<"rooms">;
  const { roomUser, setRoomUser, authUser, isLoading: authLoading } = useAuth();
  const roomData = useQuery(api.rooms.get, { roomId });
  const joinRoom = useMutation(api.users.join);
  const [isAutoJoining, setIsAutoJoining] = useState(false);
  const autoJoinAttemptedRef = useRef(false);

  // Query for existing membership by authUserId (for this room)
  const existingMembership = useQuery(
    api.users.getByAuthUserId,
    authUser?.authUserId ? { roomId, authUserId: authUser.authUserId } : "skip"
  );

  // Query for global user (to check if they've joined any room before)
  const globalUser = useQuery(
    api.users.getGlobalUser,
    authUser?.authUserId ? { authUserId: authUser.authUserId } : "skip"
  );

  // Check if user exists in room's user list
  const userExistsInRoom = roomData?.users.some((u) => u._id === roomUser?.id);
  const isInRoom = roomUser?.roomId === roomId && userExistsInRoom;

  // Auto-join callback
  const performAutoJoin = useCallback(async () => {
    if (!globalUser || !authUser?.authUserId) return;

    setIsAutoJoining(true);
    try {
      const userId = await joinRoom({
        roomId,
        name: globalUser.name,
        authUserId: authUser.authUserId,
      });
      setRoomUser({
        id: userId,
        name: globalUser.name,
        roomId,
      });
    } catch (error) {
      console.error("Auto-join failed:", error);
    } finally {
      setIsAutoJoining(false);
    }
  }, [globalUser, authUser, roomId, joinRoom, setRoomUser]);

  // Auto-restore membership if authUserId has existing membership but roomUser is not set
  useEffect(() => {
    if (!roomUser && existingMembership && roomData) {
      setRoomUser({
        id: existingMembership._id,
        name: existingMembership.name,
        roomId,
      });
    }
  }, [roomUser, existingMembership, roomData, setRoomUser, roomId]);

  // Auto-join if global user exists but no membership in this room
  useEffect(() => {
    const shouldAutoJoin =
      !autoJoinAttemptedRef.current &&
      roomData?.room &&
      globalUser &&
      existingMembership === null && // No membership in this room
      authUser?.authUserId;

    if (shouldAutoJoin) {
      autoJoinAttemptedRef.current = true;
      performAutoJoin();
    }
  }, [roomData, globalUser, existingMembership, authUser, performAutoJoin]);

  // Clear stale session if roomUser is set but they're not actually in the database
  useEffect(() => {
    if (roomUser?.roomId === roomId && roomData && !roomData.users.some((u) => u._id === roomUser.id)) {
      setRoomUser(null);
    }
  }, [roomUser, roomId, roomData, setRoomUser]);

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Fetching room data</p>
        </div>
      </div>
    );
  }

  if (!roomData.room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Room Not Found</h2>
          <p className="text-muted-foreground">This room doesn&apos;t exist or has been deleted</p>
        </div>
      </div>
    );
  }

  // Show loading while auto-joining
  if (isAutoJoining) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Joining room...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isInRoom) {
    // Wait for auth state to be determined before deciding what to show
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Checking session</p>
          </div>
        </div>
      );
    }

    // If no session exists, show JoinRoomDialog directly (session will be created on join)
    if (!authUser) {
      return <JoinRoomDialog roomId={roomId} roomName={roomData.room.name} />;
    }

    // If session exists, wait for queries to determine auto-join
    const queriesLoaded = existingMembership !== undefined && globalUser !== undefined;

    // If existing membership found, show loading while useEffect restores roomUser
    if (!queriesLoaded || existingMembership) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Checking membership</p>
          </div>
        </div>
      );
    }

    return <JoinRoomDialog roomId={roomId} roomName={roomData.room.name} />;
  }

  return <RoomCanvas roomData={roomData} />;
}
