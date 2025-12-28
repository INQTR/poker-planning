"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RoomCanvas } from "@/components/room/room-canvas";
import { useEffect, useRef } from "react";

export default function DemoPage() {
  const demoRoom = useQuery(api.demo.getDemoRoom);
  const initializeDemo = useMutation(api.demo.initializeDemo);
  const hasInitialized = useRef(false);

  // Initialize demo room if it doesn't exist (only once)
  useEffect(() => {
    if (demoRoom === null && !hasInitialized.current) {
      hasInitialized.current = true;
      initializeDemo();
    }
  }, [demoRoom, initializeDemo]);

  if (!demoRoom) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-white dark:bg-black">
      {/* Demo mode badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
        Live Demo - View Only
      </div>

      {/* Demo canvas */}
      <RoomCanvas roomData={demoRoom} isDemoMode={true} />
    </div>
  );
}
