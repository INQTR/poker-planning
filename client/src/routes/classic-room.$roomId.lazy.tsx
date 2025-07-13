import { createLazyFileRoute } from "@tanstack/react-router";

import { ClassicRoomPage } from "@/pages";

export const Route = createLazyFileRoute("/classic-room/$roomId")({
  component: ClassicRoomPage,
});
