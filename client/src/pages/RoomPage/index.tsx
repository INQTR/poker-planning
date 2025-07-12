import { useParams } from "@tanstack/react-router";
import { ReactElement, useEffect, useRef } from "react";

import { useJoinRoomMutation, useRoomSubscription } from "@/api";
import { PageLayout } from "@/components";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { RoomCanvas } from "@/components/RoomCanvas";
import { useAuth } from "@/contexts";
import { toast } from "@/lib/toast";
import { User } from "@/types";

export function RoomPage(): ReactElement {
  const { roomId } = useParams({ from: "/room/$roomId" });
  const { user } = useAuth();
  const isJoinRoomCalledRef = useRef(false);

  const { data: subscriptionData, error: roomSubscriptionError } =
    useRoomSubscription({
      variables: { roomId },
    });

  useEffect(() => {
    if (roomSubscriptionError) {
      toast.error(`Room subscription: ${roomSubscriptionError.message}`);
    }
  }, [roomSubscriptionError]);

  const [joinRoomMutation, { data: joinRoomData }] = useJoinRoomMutation({
    onError: (error) => {
      toast.error(`Join room: ${error.message}`);
    },
  });

  useEffect(() => {
    if (user && !isJoinRoomCalledRef.current) {
      joinRoomMutation({
        variables: {
          roomId,
          user: {
            id: user.id,
            username: user.username,
          },
        },
      });

      isJoinRoomCalledRef.current = true;
    }
  }, [joinRoomMutation, roomId, user]);

  function handleJoinRoomMutation(user: User) {
    joinRoomMutation({
      variables: {
        roomId,
        user: { id: user.id, username: user.username },
      },
    });
  }

  const room = subscriptionData?.room || joinRoomData?.joinRoom;

  return (
    <>
      <PageLayout room={room} users={room?.users}>
        {room && <RoomCanvas room={room} roomId={roomId} />}
      </PageLayout>
      <CreateUserDialog handleJoinRoomMutation={handleJoinRoomMutation} />
    </>
  );
}
