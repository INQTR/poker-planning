import { QueryCtx } from "../_generated/server";
import { Doc } from "../_generated/dataModel";
import {
  MemberRole,
  PermissionLevel,
  PermissionCategory,
  getEffectivePermissions,
  getEffectiveRole,
} from "../permissions";

/**
 * Checks whether a role satisfies a required permission level.
 * - "everyone" → any role passes
 * - "facilitators" → facilitator or owner passes
 * - "owner" → only owner passes
 */
export function roleSatisfiesLevel(
  role: MemberRole,
  level: PermissionLevel
): boolean {
  if (level === "everyone") return true;
  if (level === "facilitators") return role === "facilitator" || role === "owner";
  if (level === "owner") return role === "owner";
  return false;
}

/**
 * Checks if the room owner has left (no active membership).
 * Only explicit leave removes membership — network disconnect does NOT trigger this.
 * Returns false for legacy rooms without an owner.
 */
export async function isRoomOwnerAbsent(
  ctx: QueryCtx,
  room: Doc<"rooms">
): Promise<boolean> {
  if (!room.ownerId) return false; // Legacy room, no owner set

  const ownerMembership = await ctx.db
    .query("roomMemberships")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", room._id).eq("userId", room.ownerId!)
    )
    .first();

  return !ownerMembership;
}

/**
 * Permission guard for mutations. Throws if the actor's role doesn't satisfy
 * the required permission level for the given category.
 *
 * Lockdown logic: if the room owner is absent AND the category's permission
 * level is "owner", throws an error. Facilitator-level and everyone-level
 * actions are unaffected by lockdown.
 */
export async function requirePermission(
  ctx: QueryCtx,
  room: Doc<"rooms">,
  membership: Doc<"roomMemberships">,
  category: PermissionCategory
): Promise<void> {
  const permissions = getEffectivePermissions(room);
  const level = permissions[category];
  const role = getEffectiveRole(membership);

  // Check lockdown: if owner is absent and this action requires owner level
  if (level === "owner") {
    const ownerAbsent = await isRoomOwnerAbsent(ctx, room);
    if (ownerAbsent) {
      throw new Error(
        "Room owner has left. Owner-level actions are disabled until the owner returns."
      );
    }
  }

  if (!roleSatisfiesLevel(role, level)) {
    throw new Error(
      `Permission denied: ${category} requires "${level}" level`
    );
  }
}

/**
 * Check if an actor can remove a target member.
 * - Owner can remove anyone
 * - Facilitator can remove participants only (not other facilitators or owner)
 * - Participant cannot remove anyone
 */
export function canRemoveMember(
  actorRole: MemberRole,
  targetRole: MemberRole
): boolean {
  if (actorRole === "owner") return true;
  if (actorRole === "facilitator") return targetRole === "participant";
  return false;
}

/**
 * Check if an actor can promote a target to facilitator.
 * Owner and facilitator can promote participants.
 */
export function canPromoteToFacilitator(actorRole: MemberRole): boolean {
  return actorRole === "owner" || actorRole === "facilitator";
}

/**
 * Check if an actor can demote a facilitator to participant.
 * Only owner can demote.
 */
export function canDemoteFacilitator(actorRole: MemberRole): boolean {
  return actorRole === "owner";
}

/**
 * Check if an actor can transfer ownership.
 * Only owner can transfer.
 */
export function canTransferOwnership(actorRole: MemberRole): boolean {
  return actorRole === "owner";
}

/**
 * Check if an actor can change room permissions.
 * Only owner can change permissions.
 */
export function canChangePermissions(actorRole: MemberRole): boolean {
  return actorRole === "owner";
}
