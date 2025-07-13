import { useParams } from "@tanstack/react-router";
import { ReactElement, useEffect, useRef } from "react";

import { useJoinRoomMutation, useRoomSubscription } from "@/api";
import { Deck, PageLayout, Room } from "@/components";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { VoteDistributionChart } from "@/components/vote-distribution-chart";
import { useAuth } from "@/contexts";
import { toast } from "@/lib/toast";
import { User } from "@/types";

export function ClassicRoomPage(): ReactElement {
  const { roomId } = useParams({ from: "/classic-room/$roomId" });
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
        {room && (
          <>
            <Room room={room} />
            <div className="absolute left-0 right-0 bottom-4 mx-auto my-0 max-w-4xl overflow-auto">
              {room.isGameOver ? (
                <div className="flex justify-center">
                  <VoteDistributionChart room={room} />
                </div>
              ) : (
                <Deck
                  roomId={roomId}
                  isGameOver={room.isGameOver}
                  cards={room.deck.cards}
                  table={room.game.table}
                />
              )}
            </div>
          </>
        )}
      </PageLayout>
      <CreateUserDialog handleJoinRoomMutation={handleJoinRoomMutation} />
    </>
  );
}
