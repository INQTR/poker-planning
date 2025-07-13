import { Link } from "@tanstack/react-router";
import { useReactFlow } from "@xyflow/react";
import {
  Copy,
  Users,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  Download,
  Share2,
  Settings,
  Home,
} from "lucide-react";
import { FC } from "react";

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
import { useCopyRoomUrlToClipboard } from "@/hooks";
import { Room } from "@/types";

interface CanvasNavigationProps {
  room: Room;
  onRevealCards?: () => void;
  onResetGame?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const CanvasNavigation: FC<CanvasNavigationProps> = ({
  room,
  onRevealCards,
  onResetGame,
  onToggleFullscreen,
  isFullscreen = false,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { copyRoomUrlToClipboard } = useCopyRoomUrlToClipboard();

  const handleCopyRoomUrl = async () => {
    if (room) {
      await copyRoomUrlToClipboard(room.id);
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

  const buttonClass =
    "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors";
  const actionButtonClass =
    "h-8 px-3 gap-1.5 font-medium rounded-md transition-colors";

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        {/* Logo/Home */}
        <Link to="/" className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className={buttonClass}>
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
            {room.name || `Room ${room.id.slice(0, 6)}`}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyRoomUrl}
                className={buttonClass}
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
            {room.users.length} {room.users.length === 1 ? "user" : "users"}
          </span>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Game Controls */}
        <div className="flex items-center gap-1 px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRevealCards}
                disabled={room.isGameOver || room.game.table.length === 0}
                className={`${actionButtonClass} ${
                  !room.isGameOver && room.game.table.length > 0
                    ? "hover:bg-primary/10 dark:hover:bg-primary/20 text-primary"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Play className="h-4 w-4" />
                Reveal
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reveal all cards</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetGame}
                disabled={!room.isGameOver}
                className={`${actionButtonClass} hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start new round</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className={buttonClass}
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className={buttonClass}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={buttonClass}>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={buttonClass}>
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled>
                <Settings className="h-4 w-4 mr-2" />
                Room settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
