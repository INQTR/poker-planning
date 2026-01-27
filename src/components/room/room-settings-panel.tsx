"use client";

import { FC, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { X, Sun, Moon, Monitor, UserMinus, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import type { RoomWithRelatedData } from "@/convex/model/rooms";
import type { UserWithPresence } from "@/hooks/useRoomPresence";
import { getColorFromName } from "@/lib/avatar-utils";
import { formatLastSeen } from "./user-presence-avatars";

interface RoomSettingsPanelProps {
  roomData: RoomWithRelatedData;
  usersWithPresence: UserWithPresence[];
  currentUserId?: Id<"users">;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  isDemoMode?: boolean;
}

export const RoomSettingsPanel: FC<RoomSettingsPanelProps> = ({
  roomData,
  usersWithPresence,
  currentUserId,
  isOpen,
  onClose,
  triggerRef,
  isDemoMode = false,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [roomName, setRoomName] = useState(roomData.room.name);
  const [isSaving, setIsSaving] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [pendingDeleteUser, setPendingDeleteUser] = useState<{id: Id<"users">, name: string} | null>(null);

  const renameRoom = useMutation(api.rooms.rename);
  const toggleAutoComplete = useMutation(api.rooms.toggleAutoComplete);
  const removeUser = useMutation(api.users.remove);

  // Sync room name with prop when it changes externally
  useEffect(() => {
    setRoomName(roomData.room.name);
  }, [roomData.room.name]);

  // Handle click outside - only when dialog is not open
  useClickOutside(
    panelRef,
    () => {
      if (!pendingDeleteUser) {
        onClose();
      }
    },
    triggerRef ? [triggerRef] : undefined
  );

  // Handle escape key - only when dialog is not open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pendingDeleteUser) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, pendingDeleteUser]);

  // Reset pending delete state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setPendingDeleteUser(null);
    }
  }, [isOpen]);

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

  const handleRemoveUser = (userId: Id<"users">, userName: string) => {
    setPendingDeleteUser({ id: userId, name: userName });
  };

  const handleConfirmRemoveUser = async () => {
    if (!pendingDeleteUser) return;
    setRemovingUserId(pendingDeleteUser.id);
    try {
      await removeUser({ userId: pendingDeleteUser.id, roomId: roomData.room._id });
      toast({
        title: "User removed",
        description: `${pendingDeleteUser.name} has been removed from the room.`,
      });
    } catch (error) {
      console.error("Failed to remove user:", error);
      toast({
        title: "Failed to remove user",
        variant: "destructive",
      });
    } finally {
      setRemovingUserId(null);
      setPendingDeleteUser(null);
    }
  };

  // Filter out current user and sort: online first, then by join time
  const otherUsers = usersWithPresence
    .filter((u) => u._id !== currentUserId)
    .sort((a, b) => {
      // Online users first
      if (a.isOnline !== b.isOnline) {
        return a.isOnline ? -1 : 1;
      }
      // Then by join time (earliest first)
      return a.joinedAt - b.joinedAt;
    });

  if (!isOpen) {
    return (
      // Render dialog even when panel is closed so it can animate out properly
      <AlertDialog
        open={!!pendingDeleteUser}
        onOpenChange={(open) => !open && setPendingDeleteUser(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {pendingDeleteUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the user from the room. They can rejoin using the room link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmRemoveUser}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute top-26 right-4 z-50 w-96",
        "max-h-[calc(100vh-7rem)]",
        "flex flex-col",
        "bg-white/95 dark:bg-surface-1/95 backdrop-blur-sm",
        "rounded-xl shadow-2xl",
        "border border-gray-200/50 dark:border-border",
        "animate-in fade-in-0 slide-in-from-top-2 duration-200"
      )}
      role="dialog"
      aria-label="Room settings"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-border shrink-0">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Room Settings
        </h2>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-surface-3 rounded-md"
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent>
            <p>Close</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-4 min-h-0 flex-1 overflow-hidden">
        {/* Room Name Section */}
        <div className="space-y-2 shrink-0">
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
              onChange={(e) => !isDemoMode && setRoomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isDemoMode) handleSaveRoomName();
              }}
              placeholder="Enter room name"
              className="h-8 text-sm"
              readOnly={isDemoMode}
            />
            {!isDemoMode && (
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
            )}
          </div>
        </div>

        <Separator className="bg-gray-200/50 dark:bg-surface-3/50 shrink-0" />

        {/* Auto-Reveal Section */}
        <div className="flex items-center justify-between shrink-0">
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
            onCheckedChange={isDemoMode ? undefined : handleToggleAutoReveal}
            disabled={isDemoMode}
          />
        </div>

        <Separator className="bg-gray-200/50 dark:bg-surface-3/50 shrink-0" />

        {/* Theme Section */}
        <div className="space-y-2 shrink-0">
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
                theme === "light" && "bg-gray-100 dark:bg-surface-3"
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
                theme === "dark" && "bg-gray-100 dark:bg-surface-3"
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
                theme === "system" && "bg-gray-100 dark:bg-surface-3"
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              System
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-200/50 dark:bg-surface-3/50 shrink-0" />

        {/* Users Section */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center justify-between shrink-0 mb-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Participants
            </Label>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {usersWithPresence.length}{" "}
              {usersWithPresence.length === 1 ? "user" : "users"}
            </span>
          </div>
          <div className="space-y-1 min-h-0 flex-1 overflow-y-auto">
            {otherUsers.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-500 py-2 text-center">
                No other participants
              </p>
            ) : (
              otherUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-100/50 dark:hover:bg-surface-3/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative shrink-0">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white",
                        getColorFromName(u.name)
                      )}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-surface-1",
                          u.isOnline ? "bg-green-500" : "bg-gray-400"
                        )}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {u.name}
                        </span>
                        {u.isSpectator && (
                          <Badge variant="secondary" className="h-4 text-[10px] px-1.5">
                            Spectator
                          </Badge>
                        )}
                      </div>
                      {!u.isOnline && u.lastSeen && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatLastSeen(u.lastSeen)}
                        </span>
                      )}
                    </div>
                  </div>
                  {!isDemoMode && (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(u._id, u.name)}
                            disabled={removingUserId === u._id}
                            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 shrink-0"
                            aria-label={`Remove ${u.name}`}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <TooltipContent>
                        <p>Remove user</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Demo CTA */}
        {isDemoMode && (
          <div className="pt-4 border-t border-gray-200/50 dark:border-border shrink-0">
            <Link href="/room/new">
              <Button className="w-full gap-2" size="sm">
                Create a room to customize settings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Remove user confirmation dialog */}
      <AlertDialog
        open={!!pendingDeleteUser}
        onOpenChange={(open) => !open && setPendingDeleteUser(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {pendingDeleteUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the user from the room. They can rejoin using the room link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmRemoveUser}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
