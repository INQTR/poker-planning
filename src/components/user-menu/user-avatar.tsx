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
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  const initial = getInitial(name);
  const bgColor = getColorFromName(name);

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
