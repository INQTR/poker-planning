import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { RoomPermissions, getEffectiveRole } from "../permissions";
import {
  canPromoteToFacilitator,
  canDemoteFacilitator,
  canTransferOwnership,
  canChangePermissions,
} from "./permissions";
import { requireRoomMember } from "./auth";

/**
 * Promotes a participant to facilitator.
 * Caller must be owner or facilitator.
 */
export async function promoteFacilitator(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; targetUserId: Id<"users"> }
): Promise<void> {
  const { membership: actorMembership } = await requireRoomMember(
    ctx,
    args.roomId
  );
  const actorRole = getEffectiveRole(actorMembership);

  if (!canPromoteToFacilitator(actorRole)) {
    throw new Error("Only owners and facilitators can promote members");
  }

  const targetMembership = await ctx.db
    .query("roomMemberships")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", args.roomId).eq("userId", args.targetUserId)
    )
    .first();

  if (!targetMembership) {
    throw new Error("Target user is not a member of this room");
  }

  const targetRole = getEffectiveRole(targetMembership);
  if (targetRole !== "participant") {
    throw new Error("Can only promote participants to facilitator");
  }

  await ctx.db.patch(targetMembership._id, { role: "facilitator" });
}

/**
 * Demotes a facilitator to participant.
 * Caller must be owner.
 */
export async function demoteFacilitator(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; targetUserId: Id<"users"> }
): Promise<void> {
  const { membership: actorMembership } = await requireRoomMember(
    ctx,
    args.roomId
  );
  const actorRole = getEffectiveRole(actorMembership);

  if (!canDemoteFacilitator(actorRole)) {
    throw new Error("Only the owner can demote facilitators");
  }

  const targetMembership = await ctx.db
    .query("roomMemberships")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", args.roomId).eq("userId", args.targetUserId)
    )
    .first();

  if (!targetMembership) {
    throw new Error("Target user is not a member of this room");
  }

  const targetRole = getEffectiveRole(targetMembership);
  if (targetRole !== "facilitator") {
    throw new Error("Target user is not a facilitator");
  }

  await ctx.db.patch(targetMembership._id, { role: "participant" });
}

/**
 * Transfers ownership from the current owner to another member.
 * The old owner becomes a participant; the new owner gets the "owner" role.
 */
export async function transferOwnership(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; targetUserId: Id<"users"> }
): Promise<void> {
  const { user, membership: actorMembership } = await requireRoomMember(
    ctx,
    args.roomId
  );
  const actorRole = getEffectiveRole(actorMembership);

  if (!canTransferOwnership(actorRole)) {
    throw new Error("Only the owner can transfer ownership");
  }

  // Authoritative check: membership role must match room.ownerId
  const room = await ctx.db.get(args.roomId);
  if (!room || room.ownerId !== user._id) {
    throw new Error("Only the room owner can transfer ownership");
  }

  const targetMembership = await ctx.db
    .query("roomMemberships")
    .withIndex("by_room_user", (q) =>
      q.eq("roomId", args.roomId).eq("userId", args.targetUserId)
    )
    .first();

  if (!targetMembership) {
    throw new Error("Target user is not a member of this room");
  }

  if (args.targetUserId === user._id) {
    throw new Error("Cannot transfer ownership to yourself");
  }

  // Swap roles: old owner → participant, new owner → owner
  await ctx.db.patch(actorMembership._id, { role: "participant" });
  await ctx.db.patch(targetMembership._id, { role: "owner" });

  // Update room's ownerId
  await ctx.db.patch(args.roomId, { ownerId: args.targetUserId });
}

/**
 * Updates room permission settings.
 * Caller must be owner.
 */
export async function updatePermissions(
  ctx: MutationCtx,
  args: { roomId: Id<"rooms">; permissions: RoomPermissions }
): Promise<void> {
  const { membership: actorMembership } = await requireRoomMember(
    ctx,
    args.roomId
  );
  const actorRole = getEffectiveRole(actorMembership);

  if (!canChangePermissions(actorRole)) {
    throw new Error("Only the owner can change room permissions");
  }

  await ctx.db.patch(args.roomId, { permissions: args.permissions });
}
