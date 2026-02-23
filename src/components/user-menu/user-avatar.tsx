"use client";

import { cn } from "@/lib/utils";
import { getColorFromName, getInitial } from "@/lib/avatar-utils";

const sizeClasses = {
  sm: "size-6 text-xs",
  md: "size-8 text-sm",
  lg: "size-10 text-base",
};

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ name, avatarUrl, size = "md", className }: UserAvatarProps) {
  const initial = getInitial(name);
  const bgColor = getColorFromName(name);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-medium text-white",
        sizeClasses[size],
        bgColor,
        className
      )}
    >
      {initial}
    </div>
  );
}
