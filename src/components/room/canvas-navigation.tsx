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
  Menu,
  ListTodo,
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
import { IssuesPanel } from "./issues-panel";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { RoomWithRelatedData } from "@/convex/model/rooms";
import { copyTextToClipboard } from "@/utils/copy-text-to-clipboard";

interface CanvasNavigationProps {
  roomData: RoomWithRelatedData;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  isIssuesPanelOpen: boolean;
  onIssuesPanelChange: (open: boolean) => void;
}

export const CanvasNavigation: FC<CanvasNavigationProps> = ({
  roomData,
  onToggleFullscreen,
  isFullscreen = false,
  isIssuesPanelOpen,
  onIssuesPanelChange,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { toast } = useToast();
  const [isFullscreenSupported] = useState(() =>
    typeof document !== 'undefined' && document.fullscreenEnabled
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const handleCopyRoomUrl = async () => {
    if (roomData?.room) {
      const url = `${window.location.origin}/room/${roomData.room._id}`;
      const success = await copyTextToClipboard(url);
      if (success) {
        toast({
          title: "Room URL copied!",
          description: "Share this link with others to join the room.",
        });
      } else {
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
    "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-surface-3 rounded-md transition-colors";

  if (!roomData) return null;

  const { room, users } = roomData;

  return (
    <>
      {/* Mobile Navigation Header */}
      <div
        className="md:hidden fixed top-2 left-2 right-2 z-50"
        role="navigation"
        data-testid="mobile-navigation"
      >
        <div className="flex items-center justify-between px-2 py-1.5 bg-white/95 dark:bg-surface-1/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-border">
          {/* Home Button */}
          <Link href="/">
            <Button
              variant="ghost"
              className="h-11 w-11 p-0"
              aria-label="Back to home"
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>

          {/* Room Name */}
          <span
            className="flex-1 mx-2 text-sm font-semibold text-gray-800 dark:text-gray-200 truncate text-center"
            data-testid="mobile-room-name"
          >
            {room.name || `Room ${room._id.slice(0, 6)}`}
          </span>

          {/* User Count Badge */}
          <div
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-surface-2 rounded-full"
            data-testid="mobile-user-count"
          >
            <Users className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {users.length}
            </span>
          </div>

          {/* Hamburger Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-11 w-11 p-0 ml-1"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-[280px] px-4"
              aria-label="Room menu"
            >
              <SheetHeader className="pb-2">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 px-2">
                {/* Copy Room Link */}
                <Button
                  variant="outline"
                  onClick={handleCopyRoomUrl}
                  className="w-full h-11 justify-start gap-3"
                >
                  <Copy className="h-4 w-4" />
                  Copy Room Link
                </Button>

                {/* View Controls */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    View Controls
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={handleZoomOut}
                      className="h-11"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleFitView}
                      className="h-11"
                      aria-label="Fit to view"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleZoomIn}
                      className="h-11"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Fullscreen */}
                {isFullscreenSupported && (
                  <Button
                    variant="outline"
                    onClick={handleFullscreen}
                    className="w-full h-11 justify-start gap-3"
                  >
                    <Maximize2 className="h-4 w-4" />
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </Button>
                )}

                {/* Issues Panel */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onIssuesPanelChange(true);
                  }}
                  className="w-full h-11 justify-start gap-3"
                >
                  <ListTodo className="h-4 w-4" />
                  Issues
                </Button>

                {/* Room Settings */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full h-11 justify-start gap-3"
                >
                  <Settings className="h-4 w-4" />
                  Room Settings
                </Button>

                {/* User Menu */}
                <div className="pt-2 border-t border-gray-200 dark:border-border">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                    Account
                  </span>
                  <UserMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Left Navigation Bar - Desktop only */}
      <div
        className="hidden md:block absolute top-4 left-4 z-50"
        role="navigation"
        aria-label="Canvas Room Controls"
        data-testid="canvas-navigation"
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-surface-1/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-border">
          {/* Logo/Home */}
          <Link href="/" className="flex items-center">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className={buttonClass}
                    aria-label="Back to home"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                }
              />
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
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyRoomUrl}
                    className={buttonClass}
                    aria-label="Copy room URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                }
              />
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

      {/* Right Navigation Bar - Desktop only */}
      <div
        className="hidden md:block absolute top-4 right-4 z-50"
        data-testid="canvas-zoom-controls"
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-surface-1/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-border">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomOut}
                    className={buttonClass}
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>Zoom out</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleZoomIn}
                    className={buttonClass}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>Zoom in</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFitView}
                    className={buttonClass}
                    aria-label="Fit view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                }
              />
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
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFullscreen}
                      className={buttonClass}
                      aria-label="Toggle fullscreen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <TooltipContent>
                  <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onIssuesPanelChange(!isIssuesPanelOpen)}
                    className={cn(
                      buttonClass,
                      isIssuesPanelOpen && "bg-gray-100 dark:bg-surface-3"
                    )}
                    aria-label="Issues panel"
                    aria-expanded={isIssuesPanelOpen}
                  >
                    <ListTodo className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>
                <p>Issues</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className={buttonClass}
                    aria-label="Share and export options"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                }
              />
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
              <TooltipTrigger
                render={(props) => (
                  <Button
                    {...props}
                    ref={settingsButtonRef}
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={cn(
                      buttonClass,
                      isSettingsOpen && "bg-gray-100 dark:bg-surface-3"
                    )}
                    aria-label="Room settings"
                    aria-expanded={isSettingsOpen}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              />
              <TooltipContent>
                <p>Room settings</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Settings Panel */}
      <RoomSettingsPanel
        roomData={roomData}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        triggerRef={settingsButtonRef}
      />

      {/* Issues Panel */}
      <IssuesPanel
        roomId={room._id}
        roomName={room.name}
        isOpen={isIssuesPanelOpen}
        onClose={() => onIssuesPanelChange(false)}
      />
    </>
  );
};