"use client";

import { FC } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { UserWithPresence } from "@/hooks/useRoomPresence";

// 8 predefined colors for avatar backgrounds (matching user-avatar.tsx)
const AVATAR_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-pink-500",
];

// Deterministic hash from name to pick a color
export function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

// Get the first letter of the name, uppercase
function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

// Format relative time for "last seen" display
function formatLastSeen(timestamp: number | null): string {
  if (!timestamp) return "Online";

  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Last seen just now";
  if (minutes < 60) return `Last seen ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  if (hours < 24) return `Last seen ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  return `Last seen ${days} ${days === 1 ? "day" : "days"} ago`;
}

interface UserPresenceAvatarsProps {
  users: UserWithPresence[];
  maxVisible?: number;
  size?: "sm" | "default";
}

export const UserPresenceAvatars: FC<UserPresenceAvatarsProps> = ({
  users,
  maxVisible = 4,
  size = "sm",
}) => {
  // Sort users: online first, then by join time
  const sortedUsers = [...users].sort((a, b) => {
    if (a.isOnline !== b.isOnline) {
      return a.isOnline ? -1 : 1;
    }
    return a.joinedAt - b.joinedAt;
  });

  const visibleUsers = sortedUsers.slice(0, maxVisible);
  const remainingCount = sortedUsers.length - maxVisible;

  return (
    <AvatarGroup>
      {visibleUsers.map((user) => (
        <Tooltip key={user._id}>
          <TooltipTrigger
            render={
              <Avatar
                size={size}
                className={cn(
                  "ring-2",
                  user.isOnline ? "ring-green-500" : "ring-gray-400 grayscale"
                )}
              >
                <AvatarFallback className={getColorFromName(user.name)}>
                  <span className="text-white font-medium">
                    {getInitial(user.name)}
                  </span>
                </AvatarFallback>
              </Avatar>
            }
          />
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">
                {user.name}
                {user.isSpectator && " (spectator)"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.isOnline ? "Online" : formatLastSeen(user.lastSeen)}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
      {remainingCount > 0 && (
        <Tooltip>
          <TooltipTrigger
            render={
              <AvatarGroupCount>+{remainingCount}</AvatarGroupCount>
            }
          />
          <TooltipContent className="p-2 max-h-64 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {sortedUsers.slice(maxVisible).map((user) => (
                <div key={user._id} className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    className={cn(
                      user.isOnline ? "ring-2 ring-green-500" : "grayscale"
                    )}
                  >
                    <AvatarFallback className={getColorFromName(user.name)}>
                      <span className="text-white font-medium text-xs">
                        {getInitial(user.name)}
                      </span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user.name}
                      {user.isSpectator && " (spectator)"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.isOnline ? "Online" : formatLastSeen(user.lastSeen)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </AvatarGroup>
  );
};
