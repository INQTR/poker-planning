"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/components/auth/auth-provider";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "./user-avatar";
import { EditNameDialog } from "./edit-name-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Moon, Sun, LogOut, UserPen, Monitor, Eye } from "lucide-react";

export function UserMenu() {
  const { authUser, roomUser, setRoomUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Get global user data
  const globalUser = useQuery(
    api.users.getGlobalUser,
    authUser?.authUserId ? { authUserId: authUser.authUserId } : "skip"
  );

  // Get room membership data (for spectator status)
  const roomMembership = useQuery(
    api.users.getByAuthUserId,
    authUser?.authUserId && roomUser?.roomId
      ? { authUserId: authUser.authUserId, roomId: roomUser.roomId }
      : "skip"
  );

  const editGlobalUser = useMutation(api.users.editGlobalUser);
  const editUser = useMutation(api.users.edit);
  const deleteUser = useMutation(api.users.deleteUser);

  if (!authUser || !globalUser) {
    return null;
  }

  const userName = globalUser.name || authUser.preferredName || "Guest";
  const isInRoom = !!roomUser;
  const isSpectator = roomMembership?.isSpectator ?? false;

  const handleEditName = async (name: string) => {
    await editGlobalUser({
      authUserId: authUser.authUserId,
      name,
    });
  };

  const handleSpectatorToggle = async (checked: boolean) => {
    if (!roomUser) return;
    await editUser({
      userId: roomUser.id,
      roomId: roomUser.roomId,
      isSpectator: checked,
    });
  };

  const handleSignOut = async () => {
    // Only delete user completely if they are anonymous
    // Non-anonymous users keep their data for when they sign back in
    if (authUser.isAnonymous) {
      await deleteUser({ authUserId: authUser.authUserId });
    }
    // Clear local room state
    setRoomUser(null);
    // Sign out from auth (clears session cookie)
    await authClient.signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="user-menu-trigger" className="flex items-center gap-2 rounded-full border bg-background px-2 py-1.5 hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <UserAvatar name={userName} size="sm" />
          <span className="text-sm font-medium max-w-24 truncate hidden sm:block">
            {userName}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Profile header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <UserAvatar name={userName} size="lg" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{userName}</span>
              <span className="text-xs text-muted-foreground">Guest</span>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Edit name */}
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <UserPen className="mr-2 size-4" />
            Edit name
          </DropdownMenuItem>

          {/* Spectator toggle - only show when in a room */}
          {isInRoom && (
            <div
              data-testid="spectator-toggle-row"
              className="flex items-center justify-between px-1.5 py-1 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={() => handleSpectatorToggle(!isSpectator)}
            >
              <div className="flex items-center gap-2">
                <Eye className="size-4" />
                <span className="text-sm">Spectator</span>
              </div>
              <Switch
                checked={isSpectator}
                onCheckedChange={handleSpectatorToggle}
                size="sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Appearance submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="relative mr-2 size-4">
                <Sun className="absolute size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </span>
              Appearance
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => setTheme(value)}
                >
                  <DropdownMenuRadioItem value="light">
                    <Sun className="mr-2 size-4" />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <Moon className="mr-2 size-4" />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <Monitor className="mr-2 size-4" />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Sign out */}
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditNameDialog
        currentName={userName}
        onSave={handleEditName}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
