# Room Permissions & Ownership - Business Analysis

## Problem Statement

Currently, all room members have equal permissions. Any participant can reveal cards prematurely, delete issues, rename the room, or remove other users. This causes:

- **Accidental disruptions** - premature card reveals, unintended game resets
- **Facilitation difficulty** - hosts can't control session flow in large/formal teams
- **No accountability** - anyone can modify/delete issues without restriction
- **No ownership** - if a disruptive user joins, they have full control equal to the creator

> Ref: [GitHub Issue #142](https://github.com/INQTR/poker-planning/issues/142)

---

## Design Principles

1. **Zero-friction by default** - new rooms work exactly as today (everyone can do everything). Permissions are opt-in.
2. **Progressive disclosure** - simple surface, depth when needed. Don't overwhelm casual users.
3. **Facilitator-centric** - the person running the session needs control; others need to participate smoothly.
4. **Recoverable** - ownership can be transferred, permissions can be changed mid-session. No dead ends.
5. **Session-aware** - planning poker is ephemeral. Don't build enterprise RBAC; build lightweight facilitation tools.

---

## Roles

### Three roles (simple hierarchy)

| Role | Description | Default count |
|------|-------------|---------------|
| **Owner** | Room creator. Full control. Can transfer ownership. | Exactly 1 per room |
| **Facilitator** | Trusted participant promoted by owner. Shares session control powers. | 0+ per room |
| **Participant** | Regular voter. Permissions governed by room settings. | 0+ per room |

**Spectator** remains orthogonal - it's a voting mode, not a permission role. A Facilitator can be a spectator (controls session but doesn't vote). A Participant can be a spectator (watches only).

### Role assignment rules

- Room creator automatically becomes **Owner**
- Owner can promote any Participant to **Facilitator**
- Owner can demote any Facilitator back to Participant
- Owner can **transfer ownership** to any member (they become Participant; target becomes Owner)
- Facilitators can promote Participants to Facilitator (but cannot demote other Facilitators)
- **Escalation note:** If the owner is absent, facilitators can still promote others but no one can demote. This is an accepted trade-off — planning poker sessions are short-lived and the risk is low. If this proves problematic, a future iteration can cap promotions or require owner presence.
- There is always exactly one Owner per room

### What happens when the Owner leaves?

**Room locks down partially.** When the owner **explicitly leaves** the room (clicks "Leave room"), **owner-only actions** become unavailable. Specifically:

**What lockdown disables:**
- Any configurable action set to `"owner"` level — disabled for everyone (no owner present)
- Owner-only non-configurable actions: change permissions, demote facilitator, transfer ownership

**What lockdown does NOT disable:**
- Configurable actions set to `"everyone"` — still work for all members
- Configurable actions set to `"facilitators"` — still work for existing facilitators
- Facilitator promotion — facilitators can still promote participants
- Member removal — facilitators can still remove participants
- Voting — always open

**"Leave" is defined as:** The owner explicitly invokes the "Leave room" action, which deletes their membership record. Network disconnects, tab closes, or going offline do **not** trigger lockdown — the owner's membership persists and they remain owner. Presence status (online/offline) is cosmetic only and does not affect permissions.

- If the Owner has a permanent account, they can rejoin and automatically reclaim ownership (lockdown ends)
- If the Owner had an anonymous session and all permissions are at default (`"everyone"`), lockdown has minimal impact — only owner-only non-configurable actions are blocked. If the owner had tightened permissions to `"owner"` level before leaving, those specific actions become unavailable.
- A subtle banner appears: _"The room owner has left. Some actions are unavailable."_

**Rationale:** This is the safest option — no one gains elevated permissions they weren't explicitly granted. Planning poker rooms are short-lived, so orphaned rooms naturally expire.

---

## Permissioned Actions

### Action categories and their permission levels

Each action category has a **permission level** configurable by the Owner:

| Permission Level | Who can act |
|-----------------|-------------|
| `everyone` | All members (current behavior) |
| `facilitators` | Owner + Facilitators only |
| `owner` | Owner only |

### Configurable permissions

| Action Category | Actions included | Default | Configurable levels |
|----------------|-----------------|---------|-------------------|
| **Reveal cards** | Reveal votes, cancel auto-reveal countdown | `everyone` | everyone / facilitators / owner |
| **Game flow** | Reset game, start voting on issue, clear current issue | `everyone` | everyone / facilitators / owner |
| **Issue management** | Create, edit, delete, reorder issues | `everyone` | everyone / facilitators / owner |
| **Room settings** | Rename room, toggle auto-reveal | `everyone` | everyone / facilitators / owner |

### Non-configurable permissions (always restricted)

| Action | Who can do it | Rationale |
|--------|--------------|-----------|
| Remove member | Owner can remove anyone. Facilitators can remove Participants only (not other Facilitators or Owner). | Kicking is destructive; role hierarchy must be respected. |
| Change permissions | Owner only | Meta-control must stay with owner |
| Promote to Facilitator | Owner + Facilitators | Facilitators can grow the facilitation team |
| Demote Facilitator | Owner only | Only owner can remove facilitator status |
| Transfer ownership | Owner only | Ownership transfer is owner-only |
| Vote / pick card | All non-spectators | Core activity, never restricted |
| Toggle own spectator mode | Self | Personal preference |
| Create/edit own notes | Self | Personal workspace |
| Leave room | Self | Always allowed |

---

## User Experience Design

### 1. Room creation - no change

Room creation flow stays identical. Creator automatically becomes Owner. All four permission categories default to `everyone` (preserving current behavior). No extra steps.

### 2. Visual role indicators

**In the room canvas (PlayerNode):**
- Owner: crown icon next to name
- Facilitator: star icon next to name
- Participant: no icon (default)

**In the settings panel (member list):**
- Role badge next to each user: "Owner", "Facilitator", or none
- Owner sees action menu on each member (promote/demote/transfer/remove)
- Facilitators see: promote action on Participants, remove action on Participants only (not on other Facilitators or Owner)

**In the header presence bar:**
- Owner/Facilitator avatars get a subtle ring/badge indicator

### 3. Permissions settings UI

**Location:** Room Settings panel, new "Permissions" section below existing settings.

**Layout:**

```
Permissions
────────────────────────────────
Reveal cards         [Everyone ▼]
Game flow            [Everyone ▼]
Issue management     [Everyone ▼]
Room settings        [Everyone ▼]
────────────────────────────────
```

Each dropdown has three options: Everyone, Facilitators, Owner only.

**Visibility:** Only the Owner sees the permission dropdowns. Facilitators and Participants see the current settings as read-only text.

**Presets (optional, future):** "Open" (all everyone), "Moderated" (facilitators for most), "Strict" (owner only for most). Not required for MVP.

### 4. Member management UX

**Owner's view in settings panel:**

```
Participants
────────────────────────────────
👑 Alice (you)          Owner
⭐ Bob                  Facilitator  [··· ]
   Charlie              Participant  [··· ]
   Diana (spectator)    Participant  [··· ]
────────────────────────────────
```

The `[···]` menu contains contextual actions:
- On a Facilitator: "Remove Facilitator role", "Transfer ownership", "Remove from room"
- On a Participant: "Make Facilitator", "Transfer ownership", "Remove from room"

**Transfer ownership flow:**
1. Owner clicks "Transfer ownership" on target user
2. Confirmation dialog: _"Transfer room ownership to Bob? You will become a Participant."_
3. Dialog warning (monetization): _"After transfer, this room's Pro analytics will be excluded from your personal analytics dashboard unless you participate in another Pro room."_
4. On confirm: owner becomes Participant, target becomes Owner
5. Toast notification to all: _"Bob is now the room owner"_

### 5. Denied action feedback

When a user tries an action they don't have permission for:

- **Button state:** Disabled buttons with tooltip explaining why. Example: _"Only facilitators can reveal cards"_
- **No hidden UI:** Show the button but disable it. Users should see what's possible, not have features disappear.
- **Toast on attempt:** If user somehow triggers a restricted action (keyboard shortcut, API), show toast: _"You don't have permission to reveal cards"_

### 6. Ownerless room lock-down

When owner explicitly leaves without transferring:

1. A subtle banner appears at top of canvas: _"The room owner has left. Some actions are unavailable."_
2. Actions set to `"owner"` permission level become disabled for everyone. Actions set to `"facilitators"` still work for existing facilitators. Actions set to `"everyone"` are unaffected.
3. Owner-only non-configurable actions (change permissions, demote, transfer) are disabled.
4. Facilitator non-configurable actions (promote, remove members) still work.
5. Voting continues normally.
6. If the owner (permanent account) rejoins, they automatically reclaim ownership and the banner disappears.

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Owner is also a spectator | Owner retains all control powers but doesn't vote |
| Owner is offline | Ownership and Pro entitlement remain tied to owner account until ownership changes |
| Owner subscription lapses | Room keeps Pro access during grace period; then free retention rules apply unless owner re-subscribes |
| All facilitators leave, permissions set to "facilitators" | Only owner can perform those actions. No auto-demotion of settings. |
| Owner removes themselves | Not allowed. Owner must transfer ownership first, or simply leave the room. |
| Room has only 1 member (owner) | Full control, no restrictions apply |
| Guest (anonymous) user creates room | They are still owner. If session is lost, ownership is orphaned — partial lockdown. Owner-only actions and any actions configured to `"owner"` level become unavailable. Facilitator-level and everyone-level actions continue working. |
| Permanent account owner reconnects | Ownership is restored automatically via auth |
| Owner changes permission mid-vote | Takes effect immediately. In-progress votes are not affected. Reveal/reset buttons update state instantly. |
| User rejoins after being removed | They rejoin as Participant (not Facilitator, even if they were before) |

---

## Data Model Requirements

### Schema changes (all fields optional for backward compatibility)

**rooms table** — add:
- `ownerId: Id<"users">` — the user who owns this room. Set at creation time. Updated on ownership transfer. When undefined, room operates in legacy mode (no restrictions).
- `permissions: { revealCards, gameFlow, issueManagement, roomSettings }` — each value is `"everyone" | "facilitators" | "owner"`. When undefined, all default to `"everyone"`.

**roomMemberships table** — add:
- `role: "owner" | "facilitator" | "participant"` — the member's role in this room. When undefined, treated as `"participant"`.

### Lockdown detection

A room is in lockdown when `room.ownerId` is set AND no active membership exists for that user ID. This is a computed state (query-time), not stored.

### No migration needed

All new fields are optional. Existing rooms continue working in "everyone" mode. New rooms automatically get `ownerId` + default permissions.

---

## Impact on Existing Features

| Feature | Impact |
|---------|--------|
| Room creation | Add `ownerId` and `permissions` object to rooms table. Add `role` field to roomMemberships table. All optional — existing data unaffected. |
| Join flow | No change (joins as Participant) |
| Voting | No change (always open to non-spectators) |
| Auto-reveal | Governed by "Reveal cards" permission |
| Issue panel | Governed by "Issue management" permission |
| Session controls | Governed by "Game flow" permission |
| Room settings | Governed by "Room settings" permission |
| Member removal | Now restricted to Owner + Facilitators |
| Canvas nodes | No change (positions are per-user) |
| Timer | No change (per-user timer) |
| Notes | No change (per-user notes) |
| Export/CSV | No change (read-only action) |

---

## Success Metrics

- **Adoption:** % of rooms that change at least one permission from default
- **Retention:** Do teams with permissions enabled return more often?
- **Friction check:** Time from room creation to first vote should not increase
- **Support signals:** Decrease in complaints about accidental reveals/resets

---

## Resolved Decisions

1. **Facilitators CAN promote other Participants to Facilitator.** Only the Owner can demote Facilitators.
2. **Owner leaving = partial lockdown.** No claim flow. Owner-level actions and owner-only non-configurable actions become unavailable. Facilitator-level and everyone-level actions continue working. Owner with permanent account can reclaim on rejoin.

## Open Questions (future scope)

1. **Permission templates** - "Always use Moderated mode for my rooms." Requires user-level settings. Follow-up feature.
2. **Lock room** - Prevent new members from joining. Related but out of scope.
3. **Removed Facilitators re-joining** - Currently rejoin as Participant. Is the absence of the badge sufficient notification?
