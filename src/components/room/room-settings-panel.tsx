"use client";

import { FC, useRef, useState, useEffect } from "react";
import { X, Sun, Moon, Monitor, UserMinus } from "lucide-react";
import { useTheme } from "next-themes";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import type { RoomWithRelatedData } from "@/convex/model/rooms";

interface RoomSettingsPanelProps {
  roomData: RoomWithRelatedData;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const RoomSettingsPanel: FC<RoomSettingsPanelProps> = ({
  roomData,
  isOpen,
  onClose,
  triggerRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [roomName, setRoomName] = useState(roomData.room.name);
  const [isSaving, setIsSaving] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const renameRoom = useMutation(api.rooms.rename);
  const toggleAutoComplete = useMutation(api.rooms.toggleAutoComplete);
  const removeUser = useMutation(api.users.remove);

  // Sync room name with prop when it changes externally
  useEffect(() => {
    setRoomName(roomData.room.name);
  }, [roomData.room.name]);

  // Handle click outside
  useClickOutside(panelRef, onClose, triggerRef ? [triggerRef] : undefined);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSaveRoomName = async () => {
    if (!roomName.trim() || roomName === roomData.room.name) return;

    setIsSaving(true);
    try {
      await renameRoom({ roomId: roomData.room._id, name: roomName.trim() });
      toast({
        title: "Room renamed",
        description: `Room is now called "${roomName.trim()}"`,
      });
    } catch (error) {
      console.error("Failed to rename room:", error);
      toast({
        title: "Failed to rename room",
        variant: "destructive",
      });
      setRoomName(roomData.room.name);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAutoReveal = async () => {
    try {
      await toggleAutoComplete({ roomId: roomData.room._id });
    } catch (error) {
      console.error("Failed to toggle auto-reveal:", error);
      toast({
        title: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUser = async (userId: string) => {
    setRemovingUserId(userId);
    try {
      await removeUser({ userId: userId as Id<"users"> });
      toast({
        title: "User removed",
        description: "The user has been removed from the room.",
      });
    } catch (error) {
      console.error("Failed to remove user:", error);
      toast({
        title: "Failed to remove user",
        variant: "destructive",
      });
    } finally {
      setRemovingUserId(null);
    }
  };

  if (!isOpen) return null;

  const otherUsers = roomData.users.filter((u) => u._id !== user?.id);

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute top-26 right-4 z-50 w-80",
        "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
        "rounded-xl shadow-2xl",
        "border border-gray-200/50 dark:border-gray-700/50",
        "animate-in fade-in-0 slide-in-from-top-2 duration-200"
      )}
      role="dialog"
      aria-label="Room settings"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Room Settings
        </h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Room Name Section */}
        <div className="space-y-2">
          <Label
            htmlFor="room-name"
            className="text-xs font-medium text-gray-600 dark:text-gray-400"
          >
            Room Name
          </Label>
          <div className="flex gap-2">
            <Input
              id="room-name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveRoomName();
              }}
              placeholder="Enter room name"
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              onClick={handleSaveRoomName}
              disabled={
                isSaving || !roomName.trim() || roomName === roomData.room.name
              }
              className="h-8 px-3"
            >
              {isSaving ? "..." : "Save"}
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-200/50 dark:bg-gray-700/50" />

        {/* Auto-Reveal Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label
              htmlFor="auto-reveal"
              className="text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              Auto-reveal cards
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Reveal when all vote
            </p>
          </div>
          <Switch
            id="auto-reveal"
            checked={roomData.room.autoCompleteVoting}
            onCheckedChange={handleToggleAutoReveal}
          />
        </div>

        <Separator className="bg-gray-200/50 dark:bg-gray-700/50" />

        {/* Theme Section */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Theme
          </Label>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme("light")}
              className={cn(
                "flex-1 h-8 gap-1.5 text-xs",
                theme === "light" && "bg-gray-100 dark:bg-gray-700"
              )}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme("dark")}
              className={cn(
                "flex-1 h-8 gap-1.5 text-xs",
                theme === "dark" && "bg-gray-100 dark:bg-gray-700"
              )}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme("system")}
              className={cn(
                "flex-1 h-8 gap-1.5 text-xs",
                theme === "system" && "bg-gray-100 dark:bg-gray-700"
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              System
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-200/50 dark:bg-gray-700/50" />

        {/* Users Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Participants
            </Label>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {roomData.users.length}{" "}
              {roomData.users.length === 1 ? "user" : "users"}
            </span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {otherUsers.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-500 py-2 text-center">
                No other participants
              </p>
            ) : (
              otherUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {u.name}
                    </span>
                    {u.isSpectator && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                        (spectator)
                      </span>
                    )}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(u._id)}
                        disabled={removingUserId === u._id}
                        className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 shrink-0"
                        aria-label={`Remove ${u.name}`}
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove user</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
