import { Doc } from "./_generated/dataModel";

// --- Types ---

export type MemberRole = "owner" | "facilitator" | "participant";

export type PermissionLevel = "everyone" | "facilitators" | "owner";

export type PermissionCategory =
  | "revealCards"
  | "gameFlow"
  | "issueManagement"
  | "roomSettings";

export type RoomPermissions = {
  [K in PermissionCategory]: PermissionLevel;
};

// --- Defaults ---

export const DEFAULT_PERMISSIONS: RoomPermissions = {
  revealCards: "everyone",
  gameFlow: "everyone",
  issueManagement: "everyone",
  roomSettings: "everyone",
};

// --- Helpers ---

/**
 * Returns the effective permissions for a room, falling back to defaults
 * for legacy rooms without permissions set.
 */
export function getEffectivePermissions(room: Doc<"rooms">): RoomPermissions {
  return room.permissions ?? DEFAULT_PERMISSIONS;
}

/**
 * Returns the effective role for a membership, defaulting to "participant"
 * for legacy memberships without a role.
 */
export function getEffectiveRole(
  membership: Doc<"roomMemberships">
): MemberRole {
  return membership.role ?? "participant";
}
