import { useMemo } from "react";
import type { RoomWithRelatedData } from "@/convex/model/rooms";
import type { Id } from "@/convex/_generated/dataModel";
import {
  type MemberRole,
  type PermissionLevel,
  type RoomPermissions,
  DEFAULT_PERMISSIONS,
  getEffectivePermissions,
} from "@/convex/permissions";
import {
  roleSatisfiesLevel,
  canRemoveMember,
  canPromoteToFacilitator,
  canDemoteFacilitator,
  canTransferOwnership,
  canChangePermissions,
} from "@/convex/model/permissions";

export interface UsePermissionsReturn {
  role: MemberRole;
  isOwner: boolean;
  isFacilitator: boolean;
  isOwnerAbsent: boolean;
  canRevealCards: boolean;
  canControlGameFlow: boolean;
  canManageIssues: boolean;
  canChangeRoomSettings: boolean;
  canRemoveTarget: (targetRole: MemberRole) => boolean;
  canPromoteTarget: (targetRole: MemberRole) => boolean;
  canDemoteFacilitatorFlag: boolean;
  canTransferOwnershipFlag: boolean;
  canChangePermissionsFlag: boolean;
  permissions: RoomPermissions;
}

/**
 * Returns permission flags computed from room data and the current user's role.
 * Pure computation — no queries or mutations.
 */
export function usePermissions(
  roomData: RoomWithRelatedData | null | undefined,
  currentUserId: Id<"users"> | string | undefined
): UsePermissionsReturn {
  return useMemo(() => {
    if (!roomData || !currentUserId) {
      return {
        role: "participant" as MemberRole,
        isOwner: false,
        isFacilitator: false,
        isOwnerAbsent: false,
        canRevealCards: true,
        canControlGameFlow: true,
        canManageIssues: true,
        canChangeRoomSettings: true,
        canRemoveTarget: () => false,
        canPromoteTarget: () => false,
        canDemoteFacilitatorFlag: false,
        canTransferOwnershipFlag: false,
        canChangePermissionsFlag: false,
        permissions: DEFAULT_PERMISSIONS,
      };
    }

    const currentUser = roomData.users.find((u) => u._id === currentUserId);
    const role: MemberRole = currentUser?.role ?? "participant";
    const permissions = getEffectivePermissions(roomData.room);
    const isOwnerAbsent = roomData.isOwnerAbsent;

    // For permission checks, if owner is absent AND level is "owner", block the action
    const canDoAction = (level: PermissionLevel): boolean => {
      if (level === "owner" && isOwnerAbsent) return false;
      return roleSatisfiesLevel(role, level);
    };

    return {
      role,
      isOwner: role === "owner",
      isFacilitator: role === "facilitator",
      isOwnerAbsent,
      canRevealCards: canDoAction(permissions.revealCards),
      canControlGameFlow: canDoAction(permissions.gameFlow),
      canManageIssues: canDoAction(permissions.issueManagement),
      canChangeRoomSettings: canDoAction(permissions.roomSettings),
      canRemoveTarget: (targetRole: MemberRole) =>
        canRemoveMember(role, targetRole),
      canPromoteTarget: (targetRole: MemberRole) =>
        targetRole === "participant" && canPromoteToFacilitator(role),
      canDemoteFacilitatorFlag: canDemoteFacilitator(role),
      canTransferOwnershipFlag: canTransferOwnership(role),
      canChangePermissionsFlag: canChangePermissions(role),
      permissions,
    };
  }, [roomData, currentUserId]);
}

/**
 * Returns a human-readable tooltip for why an action is disabled.
 */
export function getPermissionDeniedTooltip(
  level: PermissionLevel
): string {
  switch (level) {
    case "owner":
      return "Only the room owner can do this";
    case "facilitators":
      return "Only facilitators and the owner can do this";
    default:
      return "You don't have permission to do this";
  }
}
