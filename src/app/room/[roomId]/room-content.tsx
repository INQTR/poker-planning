"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoomCanvas } from "@/components/room/room-canvas";
import { JoinRoomDialog } from "@/components/room/join-room-dialog";
import { useAuth } from "@/components/auth/auth-provider";
import { Id } from "@/convex/_generated/dataModel";

export function RoomContent() {
  const params = useParams();
  const roomId = params.roomId as Id<"rooms">;
  const { user, setUser } = useAuth();
  const roomData = useQuery(api.rooms.get, { roomId });

  // Check if user exists in room's user list (not just localStorage)
  const userExistsInRoom = roomData?.users.some((u) => u._id === user?.id);
  const isInRoom = user?.roomId === roomId && userExistsInRoom;

  // Clear stale session if localStorage says user is in room but they're not in the database
  useEffect(() => {
    if (user?.roomId === roomId && roomData && !roomData.users.some((u) => u._id === user.id)) {
      setUser(null);
    }
  }, [user, roomId, roomData, setUser]);

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

  if (!isInRoom) {
    return <JoinRoomDialog roomId={roomId} roomName={roomData.room.name} />;
  }

  return <RoomCanvas roomData={roomData} />;
}
