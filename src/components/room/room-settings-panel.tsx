"use client";

import { FC, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Sun,
  Moon,
  Monitor,
  UserMinus,
  ArrowRight,
  Crown,
  Star,
  ChevronUp,
  ChevronDown,
  ArrowRightLeft,
  AlertTriangle,
  Info,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermissions, getPermissionDeniedTooltip } from "@/hooks/usePermissions";
import { IntegrationSettingsSection } from "./integration-settings";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import type { RoomWithRelatedData } from "@/convex/model/rooms";
import type { UserWithPresence } from "@/hooks/useRoomPresence";
import type { PermissionLevel, PermissionCategory, RoomPermissions } from "@/convex/permissions";
import { getEffectivePermissions } from "@/convex/permissions";
import { UserAvatar } from "@/components/user-menu/user-avatar";
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

const PERMISSION_CONFIG: Record<PermissionCategory, { label: string; description: string; tooltip: string }> = {
  revealCards: {
    label: "Reveal cards",
    description: "Reveal votes, cancel auto-reveal",
    tooltip: "Controls who can reveal votes and cancel the auto-reveal countdown.",
  },
  gameFlow: {
    label: "Game flow",
    description: "Reset game, start voting on issues",
    tooltip: "Controls who can reset the game, start voting on an issue, or clear the current issue.",
  },
  issueManagement: {
    label: "Issue management",
    description: "Create, edit, delete, reorder issues",
    tooltip: "Controls who can create, edit, delete, and reorder issues in the backlog.",
  },
  roomSettings: {
    label: "Room settings",
    description: "Rename room, toggle auto-reveal",
    tooltip: "Controls who can rename the room and toggle the auto-reveal setting.",
  },
};

const LEVEL_LABELS: Record<PermissionLevel, string> = {
  everyone: "Everyone",
  facilitators: "Facilitators",
  owner: "Owner only",
};

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
  const [pendingTransferUser, setPendingTransferUser] = useState<{id: Id<"users">, name: string} | null>(null);
  const openSelectCountRef = useRef(0);

  const renameRoom = useMutation(api.rooms.rename);
  const toggleAutoComplete = useMutation(api.rooms.toggleAutoComplete);
  const removeUser = useMutation(api.users.remove);
  const promoteFacilitator = useMutation(api.roles.promoteFacilitator);
  const demoteFacilitator = useMutation(api.roles.demoteFacilitator);
  const transferOwnership = useMutation(api.roles.transferOwnership);
  const updatePermissions = useMutation(api.roles.updatePermissions);

  const perms = usePermissions(roomData, currentUserId);

  // Sync room name with prop when it changes externally
  useEffect(() => {
    setRoomName(roomData.room.name);
  }, [roomData.room.name]);

  // Handle click outside - only when dialog/select popup is not open
  useClickOutside(
    panelRef,
    () => {
      if (!pendingDeleteUser && !pendingTransferUser && openSelectCountRef.current === 0) {
        onClose();
      }
    },
    triggerRef ? [triggerRef] : undefined
  );

  // Handle escape key - only when dialog is not open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pendingDeleteUser && !pendingTransferUser) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, pendingDeleteUser, pendingTransferUser]);

  // Reset pending state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setPendingDeleteUser(null);
      setPendingTransferUser(null);
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

  const handlePromote = async (userId: Id<"users">, userName: string) => {
    try {
      await promoteFacilitator({ roomId: roomData.room._id, targetUserId: userId });
      toast({
        title: "User promoted",
        description: `${userName} is now a facilitator.`,
      });
    } catch (error) {
      console.error("Failed to promote user:", error);
      toast({ title: "Failed to promote user", variant: "destructive" });
    }
  };

  const handleDemote = async (userId: Id<"users">, userName: string) => {
    try {
      await demoteFacilitator({ roomId: roomData.room._id, targetUserId: userId });
      toast({
        title: "User demoted",
        description: `${userName} is now a participant.`,
      });
    } catch (error) {
      console.error("Failed to demote user:", error);
      toast({ title: "Failed to demote user", variant: "destructive" });
    }
  };

  const handleConfirmTransfer = async () => {
    if (!pendingTransferUser) return;
    try {
      await transferOwnership({ roomId: roomData.room._id, targetUserId: pendingTransferUser.id });
      toast({
        title: "Ownership transferred",
        description: `${pendingTransferUser.name} is now the room owner.`,
      });
    } catch (error) {
      console.error("Failed to transfer ownership:", error);
      toast({ title: "Failed to transfer ownership", variant: "destructive" });
    } finally {
      setPendingTransferUser(null);
    }
  };

  const handlePermissionChange = async (category: PermissionCategory, value: PermissionLevel) => {
    const currentPermissions = getEffectivePermissions(roomData.room);
    const newPermissions: RoomPermissions = {
      ...currentPermissions,
      [category]: value,
    };
    try {
      await updatePermissions({ roomId: roomData.room._id, permissions: newPermissions });
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast({ title: "Failed to update permissions", variant: "destructive" });
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

  const currentPermissions = getEffectivePermissions(roomData.room);

  if (!isOpen) {
    return (
      // Render dialogs even when panel is closed so they can animate out properly
      <>
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
      </>
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
        {/* Owner-absent banner */}
        {perms.isOwnerAbsent && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-status-warning-bg border border-amber-200 dark:border-amber-800 shrink-0">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-status-warning-fg shrink-0" />
            <span className="text-xs text-amber-700 dark:text-status-warning-fg">
              The room owner has left. Owner-level actions are disabled.
            </span>
          </div>
        )}

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
              onChange={(e) => !isDemoMode && perms.canChangeRoomSettings && setRoomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isDemoMode && perms.canChangeRoomSettings) handleSaveRoomName();
              }}
              placeholder="Enter room name"
              className="h-8 text-sm"
              readOnly={isDemoMode || !perms.canChangeRoomSettings}
              title={!perms.canChangeRoomSettings ? getPermissionDeniedTooltip(currentPermissions.roomSettings) : undefined}
            />
            {!isDemoMode && (
              <Button
                size="sm"
                onClick={handleSaveRoomName}
                disabled={
                  !perms.canChangeRoomSettings ||
                  isSaving ||
                  !roomName.trim() ||
                  roomName === roomData.room.name
                }
                className="h-8 px-3"
                title={!perms.canChangeRoomSettings ? getPermissionDeniedTooltip(currentPermissions.roomSettings) : undefined}
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
            onCheckedChange={isDemoMode || !perms.canChangeRoomSettings ? undefined : handleToggleAutoReveal}
            disabled={isDemoMode || !perms.canChangeRoomSettings}
          />
        </div>

        <Separator className="bg-gray-200/50 dark:bg-surface-3/50 shrink-0" />

        {/* Permissions Section */}
        <div className="space-y-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Permissions
            </Label>
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="inline-flex cursor-help">
                    <Info className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                  </span>
                }
              />
              <TooltipContent side="top" className="max-w-56">
                <p>Control who can perform actions in this room. Defaults to everyone. {perms.canChangePermissionsFlag ? "Only you (the owner) can change these." : "Only the room owner can change these."}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="space-y-1">
            {(Object.keys(PERMISSION_CONFIG) as PermissionCategory[]).map((category) => {
              const config = PERMISSION_CONFIG[category];
              return (
                <div
                  key={category}
                  className="flex items-center justify-between gap-3 py-1.5 px-2 -mx-2 rounded-md hover:bg-gray-50 dark:hover:bg-surface-2/50 transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <span className="inline-flex cursor-help text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <Info className="h-3 w-3" />
                          </span>
                        }
                      />
                      <TooltipContent side="left" className="max-w-52">
                        <p>{config.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="min-w-0">
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {config.label}
                      </span>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {perms.canChangePermissionsFlag ? (
                      <Select
                        value={currentPermissions[category]}
                        onValueChange={(value) => handlePermissionChange(category, value as PermissionLevel)}
                        onOpenChange={(open) => { openSelectCountRef.current += open ? 1 : -1; }}
                      >
                        <SelectTrigger size="sm" className="text-xs w-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="facilitators">Facilitators</SelectItem>
                          <SelectItem value="owner">Owner only</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-500 px-2 py-1 rounded-md bg-gray-100 dark:bg-surface-2">
                        {LEVEL_LABELS[currentPermissions[category]]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-gray-200/50 dark:bg-surface-3/50 shrink-0" />

        {/* Jira Integration Section */}
        <div className="shrink-0">
          <IntegrationSettingsSection roomId={roomData.room._id} />
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
              otherUsers.map((u) => {
                const userRole = u.role ?? "participant";
                const canRemoveThis = perms.canRemoveTarget(userRole);
                const canPromoteThis = perms.canPromoteTarget(userRole);
                const canDemoteThis = perms.canDemoteFacilitatorFlag && userRole === "facilitator";
                const canTransfer = perms.canTransferOwnershipFlag;

                return (
                  <div
                    key={u._id}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-100/50 dark:hover:bg-surface-3/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <UserAvatar name={u.name} avatarUrl={u.avatarUrl} size="sm" className="w-7 h-7" />
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-surface-1",
                            u.isOnline ? "bg-green-500" : "bg-gray-400"
                          )}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {u.name}
                          </span>
                          {userRole === "owner" && (
                            <span className="flex items-center gap-0.5">
                              <Crown className="h-3 w-3 text-amber-500" />
                              <Badge variant="secondary" className="h-4 text-[10px] px-1.5">
                                Owner
                              </Badge>
                            </span>
                          )}
                          {userRole === "facilitator" && (
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-blue-500" />
                              <Badge variant="secondary" className="h-4 text-[10px] px-1.5">
                                Facilitator
                              </Badge>
                            </span>
                          )}
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
                      <div className="flex items-center gap-0.5 shrink-0">
                        {/* Promote button (for participants) */}
                        {canPromoteThis && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePromote(u._id, u.name)}
                                  className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                                  aria-label={`Promote ${u.name} to facilitator`}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>
                              <p>Promote to facilitator</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Demote button (for facilitators, owner only) */}
                        {canDemoteThis && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDemote(u._id, u.name)}
                                  className="h-7 w-7 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400"
                                  aria-label={`Demote ${u.name} to participant`}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <TooltipContent>
                              <p>Demote to participant</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Transfer ownership button (owner only, on non-owners) */}
                        {canTransfer && userRole !== "owner" && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setPendingTransferUser({ id: u._id, name: u.name })}
                                  className="h-7 w-7 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400"
                                  aria-label={`Transfer ownership to ${u.name}`}
                                >
                                  <ArrowRightLeft className="h-3.5 w-3.5" />
                                </Button>
                              }
                            />
                            <TooltipContent>
                              <p>Transfer ownership</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Remove button */}
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={canRemoveThis ? () => handleRemoveUser(u._id, u.name) : undefined}
                                disabled={removingUserId === u._id || !canRemoveThis}
                                className={cn(
                                  "h-7 w-7 p-0 shrink-0",
                                  canRemoveThis
                                    ? "hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                                    : "opacity-40 cursor-not-allowed",
                                )}
                                aria-label={
                                  canRemoveThis
                                    ? `Remove ${u.name}`
                                    : "You don't have permission to remove this user"
                                }
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>
                            <p>
                              {canRemoveThis
                                ? "Remove user"
                                : "Only facilitators and the owner can remove members"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                );
              })
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

      {/* Transfer ownership confirmation dialog */}
      <AlertDialog
        open={!!pendingTransferUser}
        onOpenChange={(open) => !open && setPendingTransferUser(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Transfer ownership to {pendingTransferUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will become a participant. This action cannot be undone by you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer}>
              Transfer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
