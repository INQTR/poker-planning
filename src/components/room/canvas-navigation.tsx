"use client";

import Link from "next/link";
import { useReactFlow } from "@xyflow/react";
import {
  Copy,
  Users,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  Download,
  Share2,
  Settings,
  Home,
} from "lucide-react";
import { FC, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { RoomSettingsPanel } from "./room-settings-panel";
import { cn } from "@/lib/utils";
import type { RoomWithRelatedData } from "@/convex/model/rooms";

interface CanvasNavigationProps {
  roomData: RoomWithRelatedData;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const CanvasNavigation: FC<CanvasNavigationProps> = ({
  roomData,
  onToggleFullscreen,
  isFullscreen = false,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { toast } = useToast();
  const [isFullscreenSupported] = useState(() =>
    typeof document !== 'undefined' && document.fullscreenEnabled
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const handleCopyRoomUrl = async () => {
    if (roomData?.room) {
      const url = `${window.location.origin}/room/${roomData.room._id}`;
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Room URL copied!",
          description: "Share this link with others to join the room.",
        });
      } catch {
        toast({
          title: "Failed to copy URL",
          description: "Please copy the URL from your browser's address bar.",
          variant: "destructive",
        });
      }
    }
  };

  const handleZoomIn = () => {
    zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    zoomOut({ duration: 300 });
  };

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 300 });
  };

  const handleFullscreen = () => {
    if (!isFullscreenSupported) return;
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    
    onToggleFullscreen?.();
  };

  const buttonClass =
    "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors";

  if (!roomData) return null;

  const { room, users } = roomData;

  return (
    <>
      {/* Left Navigation Bar */}
      <div 
        className="absolute top-4 left-4 z-50"
        role="navigation"
        aria-label="Canvas Room Controls"
        data-testid="canvas-navigation"
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Logo/Home */}
          <Link href="/" className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={buttonClass}
                  aria-label="Back to home"
                >
                  <Home className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to home</p>
              </TooltipContent>
            </Tooltip>
          </Link>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Room Info Section */}
          <div className="flex items-center gap-2 px-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {room.name || `Room ${room._id.slice(0, 6)}`}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyRoomUrl}
                  className={buttonClass}
                  aria-label="Copy room URL"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy room link</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Users Section */}
          <div className="flex items-center gap-2 px-2">
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {users.length} {users.length === 1 ? "user" : "users"}
            </span>
          </div>
        </div>
      </div>

      {/* Right Navigation Bar */}
      <div 
        className="absolute top-4 right-4 z-50"
        data-testid="canvas-zoom-controls"
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className={buttonClass}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom out</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className={buttonClass}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom in</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFitView}
                  className={buttonClass}
                  aria-label="Fit view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fit to view</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Additional Actions */}
          <div className="flex items-center gap-1 px-2">
            {isFullscreenSupported && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFullscreen}
                    className={buttonClass}
                    aria-label="Toggle fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={buttonClass}
                  aria-label="Share and export options"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopyRoomUrl}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy room link
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Export results
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  ref={settingsButtonRef}
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={cn(
                    buttonClass,
                    isSettingsOpen && "bg-gray-100 dark:bg-gray-700"
                  )}
                  aria-label="Room settings"
                  aria-expanded={isSettingsOpen}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Room settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <RoomSettingsPanel
        roomData={roomData}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        triggerRef={settingsButtonRef}
      />
    </>
  );
};