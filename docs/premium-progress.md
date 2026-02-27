# Pro Tier Implementation Progress

> Tracks implementation status of each epic and task from `spec/00-overview.md`.
>
> **Build strategy:** Features first, payments last. All Pro features are built
> and tested without gating (available to everyone). Paddle billing and Pro gating
> are added as the final step. At that point, existing permanent accounts get 6 months
> of free Pro access (grandfathering).
>
> Updated: 2026-02-26

## Status Legend

- [x] Complete
- [ ] Not started
- [~] Partial

> **Note on task numbering:** This tracker uses condensed numbering that may differ
> from the detailed spec files in `spec/`. When in doubt, the spec files are authoritative
> for task scope and acceptance criteria. This document tracks implementation progress only.

---

## Phase 0 — Authentication (DONE)

### Epic 0: Permanent Accounts

**Status: Complete**

- [x] **0.1** Schema: Extend users table (`email`, `avatarUrl`, `accountType`)
- [x] **0.2** Backend: Google OAuth provider (`convex/auth.ts`)
- [x] **0.3** Backend: Magic link plugin + Resend email (`convex/auth.ts`, `convex/email.ts`)
- [x] **0.4** Client: Magic link + anonymous plugins (`src/lib/auth-client.ts`)
- [x] **0.5** Backend: Account linking — anonymous to permanent (`convex/model/users.ts` — `linkAnonymousToPermanent`)
- [x] **0.6** Backend: Sign-out behavior — permanent users preserve data, anonymous users delete
- [x] **0.7** Frontend: Auth context with `email` and `accountType` (`src/components/auth/auth-provider.tsx`)
- [x] **0.8** Frontend: Sign-in page at `/auth/signin` — Google, magic link, guest options (`src/components/auth/signin-form.tsx`)
- [x] **0.9** Frontend: User menu — "Sign in" link for anonymous users, email shown for permanent users
- [~] **0.10** Frontend: Avatar UI — user menu shows `avatarUrl`, but player nodes on canvas do not yet
- [x] **0.11** Frontend: Account linking from room context — `?from=/room/[roomId]` redirect flow
- [x] **0.12** Frontend: Magic link verification page (`src/app/auth/verify/page.tsx`)
- [x] **0.13** Updated authentication docs (`docs/authentication.md`)
- [x] **0.14** Google OAuth setup guide (`docs/google-oauth-setup.md`)

---

## Phase 1 — Pro Features (no gating, available to all users)

### Epic 3: Time-to-Consensus Tracking

**Status: Complete**

- [x] **3.1** Schema: `votingTimestamps` table + `timeToConsensusMs` in `voteStats`
- [x] **3.2** Backend: Record voting start/end timestamps (start, complete, reset, switch, New Round)
- [x] **3.3** Backend: Time-to-consensus analytics query (`getTimeToConsensusStats`)
- [x] **3.4** Frontend: Session summary metrics (`TimeToConsensusCard`)
- [x] **3.5** Frontend: Outlier issue highlights (`ConsensusOutliers`)
- [x] **3.6** Frontend: Trend analysis chart (`ConsensusTrend`)

### Epic 4: Voter Alignment Matrix

**Status: Complete**

- [x] **4.1** Schema: `individualVotes` table (pre-reveal snapshots)
- [x] **4.2** Backend: Capture individual votes before reveal
- [x] **4.3** Backend: Alignment analytics queries
- [x] **4.4** Frontend: Alignment scatter plot / matrix
- [x] **4.5** Frontend: Individual voting stats

### Epic 5: Sprint Predictability Score

**Status: Complete**

- [x] **5.1** Backend: Predictability score computation
- [x] **5.2** Frontend: Predictability health gauge
- [x] **5.3** Frontend: Velocity trend charts

### Epic 8: Data Exports (Enhanced)

**Status: Complete**

- [x] **8.1** Backend: Pro export with extended data (time-to-consensus, individual votes)
- [x] **8.2** Frontend: Export format options (CSV + JSON)

---

## Phase 2 — Integrations (no gating, available to all users)

### Epic 6: Jira Integration

**Status: Complete**

- [x] **6.1** Schema: `integrationConnections`, `integrationMappings`, `issueLinks`, `webhookEvents` tables
- [x] **6.2** Token encryption (AES-256-GCM) — `convex/lib/encryption.ts`
- [x] **6.3** OAuth 2.0 (3LO) authentication with Atlassian — Next.js API routes + Convex actions
- [x] **6.4** Token refresh — cron job every 30 min + just-in-time refresh
- [x] **6.5** Jira API client — `convex/integrations/jiraClient.ts`
- [x] **6.6** Import issues from sprint/backlog — `importIssues` action + modal UI
- [x] **6.7** Push estimates to Jira — auto-push after consensus via `pushEstimateToJira`
- [x] **6.8** Jira webhook handling — HTTP endpoint + dedup + issue sync
- [x] **6.9** Frontend: Connect Jira UI — settings page at `/dashboard/settings`
- [x] **6.10** Frontend: Import modal — multi-step project/board/sprint/issues selector
- [x] **6.11** Frontend: Room mapping — integration settings section in room settings panel
- [x] **6.12** Jira webhook registration + refresh cron
- [x] **6.13** Cleanup cascade — integrationMappings + issueLinks deleted with rooms
- [x] **6.14** Export populated — `externalUrl`/`externalId` fields in enhanced export

### Epic 7: GitHub Integration

**Status: Not started**

- [ ] **7.1** GitHub App OAuth flow
- [ ] **7.2** GraphQL API for Projects V2
- [ ] **7.3** Import issues from repositories
- [ ] **7.4** Push estimates to number fields
- [ ] **7.5** Webhook signature verification

---

## Phase 3 — Automation (no gating, available to all users)

### Epic 9: Automated Summaries

**Status: Not started**

- [ ] **9.1** Backend: Auto-generate session summary on room close
- [ ] **9.2** Backend: Email delivery to participants
- [ ] **9.3** Schema: `sessionSummaries`, `notificationPreferences` tables
- [ ] **9.4** Frontend: Notification preferences UI
- [ ] **9.5** Frontend: Summary history in dashboard

---

## Phase 4 — Monetization (gate features, start charging)

> This phase is added **after** all Pro features are built and tested.
> It introduces Paddle billing and locks Pro features behind a paywall.
> Existing permanent accounts are grandfathered with 6 months of free Pro.

### Epic 1: Subscription Infrastructure (Paddle) + Grandfathering

**Status: Not started**

- [ ] **1.1** Schema: Add `subscriptions`, `paddleCustomers`, `webhookEvents` tables + `users.subscriptionTier` + `users.grandfatheredUntil` + `users.proGraceUntil`
- [ ] **1.2** Backend: Grandfathering migration — set existing permanent accounts to Pro for 6 months
- [ ] **1.3** Backend: Grandfathering expiry cron — daily job to downgrade expired grandfathered users
- [ ] **1.4** Backend: Grandfathering expiry email notifications — reminders at 30 and 7 days
- [ ] **1.4b** Backend: Lapsed Pro grace + retention cleanup — 14-day grace then remove data older than 5 days
- [ ] **1.5** Backend: Paddle webhook endpoint with signature verification (`convex/http.ts`, `convex/paddle.ts`)
- [ ] **1.6** Backend: Subscription query (`getSubscription`) — includes grandfathering info
- [ ] **1.7** Backend: Customer portal session action (`createPortalSession`)
- [ ] **1.8** Frontend: Paddle.js initialization (`PaddleProvider`)
- [ ] **1.9** Frontend: Checkout + manage subscription buttons
- [ ] **1.10** Frontend: Update pricing page with working checkout + owner/grace retention messaging
- [ ] **1.11** Testing: Paddle sandbox, webhook simulation, grandfathering, E2E
- [ ] **1.12** Ops: Monetization launch runbook + rollback checklist
- [ ] **1.13** Observability: Entitlement audit events + support query tooling

### Epic 2: Pro Gating

**Status: Not started**

- [ ] **2.1** Backend: Room-owner entitlement helpers (`getRoomProState`, `requireRoomPro`)
- [ ] **2.2** Frontend: Subscription + room Pro hooks (`isGrandfathered`, `isInGrace`, `graceDaysLeft`)
- [ ] **2.3** Frontend: Room-aware Pro gate component(s)
- [ ] **2.4** Frontend: Retention/grandfathering warnings — includes data-loss messaging
- [ ] **2.5** Frontend: Ownership transfer warning — analytics exclusion notice
- [ ] **2.6** Backend: Apply room-owner Pro filtering to analytics/export queries
- [ ] **2.7** Navigation: Room-level Pro/grace badges
- [ ] **2.8** Product telemetry: warning impressions, CTA, and conversion tracking

---

## Next Focus

**Epic 7 (GitHub Integration)** — next integration to build. Shares infrastructure with Epic 6 (`integrationConnections`, encryption, `issueLinks`). No gating needed yet.
