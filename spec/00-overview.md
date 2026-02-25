# Pro Tier - Technical Implementation Plan

> **Reference:** [docs/Pro-tier.md](../docs/Pro-tier.md)
> **Progress:** [docs/Pro-progress.md](../docs/Pro-progress.md)

## Build Strategy

**Features first, payments last.** We build all Pro features and ship them to everyone (no gating). Once features are tested and stable, we add Paddle billing and Pro gating. At that point, existing permanent accounts get 6 months of free Pro access (grandfathering).

This approach:
- Lets us ship user-visible value sooner
- Gives features time to be battle-tested before charging for them
- Defers Paddle account setup and webhook plumbing until we actually need it

## Epic Map

| # | Epic | Dependencies | Effort |
|---|------|-------------|--------|
| 0 | [Permanent Accounts](./00a-permanent-accounts.md) | None | Large |
| 3 | [Time-to-Consensus Tracking](./03-time-to-consensus.md) | Epic 0 | Medium |
| 4 | [Voter Alignment Matrix](./04-voter-alignment.md) | Epic 0 | Medium |
| 5 | [Sprint Predictability Score](./05-sprint-predictability.md) | Epic 3, Epic 4 | Small |
| 8 | [Data Exports](./08-data-exports.md) | Epic 0 | Small |
| 6 | [Jira Integration](./06-jira-integration.md) | Epic 0 | XL |
| 7 | [GitHub Integration](./07-github-integration.md) | Epic 0 | XL |
| 9 | [Automated Summaries](./09-automated-summaries.md) | Epic 8 | Medium |
| 1 | [Subscription Infrastructure](./01-subscription-infrastructure.md) | Epic 0 | Large |
| 2 | [Pro Gating](./02-Pro-gating.md) | Epic 1 | Medium |

## Build Order

```
Phase 0 — Authentication (DONE)
  Epic 0: Permanent Accounts (Google OAuth + Email Magic Link)

Phase 1 — Pro Features (no gating, available to all users)
  Epic 3: Time-to-Consensus Tracking
  Epic 4: Voter Alignment Matrix
  Epic 5: Sprint Predictability Score
  Epic 8: Data Exports (enhanced)

Phase 2 — Integrations (no gating, available to all users)
  Epic 6: Jira Integration
  Epic 7: GitHub Integration

Phase 3 — Automation (no gating, available to all users)
  Epic 9: Automated Summaries

Phase 4 — Monetization (gate features, start charging)
  Epic 1: Subscription Infrastructure (Paddle) + Grandfathering
  Epic 2: Pro Gating
  → Run grandfathering migration: existing permanent accounts get 6 months free Pro
  → Enable room-owner based gating + warnings + grace retention rules
```

**Important:** During Phases 1-3, all features are ungated. No subscription checks, no `<ProGate>` wrappers, no `requirePro` backend guards. The features are built and tested as regular functionality. Gating is added in Phase 4 as a separate step.

## Grandfathering Policy

When Phase 4 ships (Paddle + gating go live):
- All permanent accounts at that time get `subscriptionTier: "pro"` for 6 months
- Anonymous users are not affected
- Email reminders sent at 30 days and 7 days before expiry
- In-app banner shown during the last 30 days
- After 6 months: automatic drop to free tier (unless they subscribed)

## Entitlement & Retention Model (Phase 4)

- Pro is a **room-owner entitlement**.
- A room is Pro when its current owner is Pro (paid or grandfathered).
- Pro room access remains active while owner is offline/absent; it changes only when ownership changes.
- If owner Pro ends, a **14-day grace window** starts.
- After grace ends, data older than 5 days is removed for non-Pro owners.
- Non-owner participants can view Pro analytics for Pro rooms they participate in (initial policy).
- Ownership transfer warns that the previous owner's analytics will exclude that room going forward.

See [Epic 1 spec](./01-subscription-infrastructure.md) for implementation details.

## Rollout Safeguards (Phase 4)

To reduce monetization cutover risk, Phase 4 includes operational safeguards:

- **Launch runbook:** step-by-step production rollout and rollback procedure ([docs/monetization-runbook.md](../docs/monetization-runbook.md)).
- **Staged enforcement:** enable warning banners first, then retention cleanup after validation.
- **Retention safety buffer:** two-step deletion flow (mark/archive first, purge later).
- **Entitlement audit log:** append-only events for ownership changes, grace transitions, and cleanup actions.
- **Telemetry:** track warning impressions, dismissals, and conversion after warnings.
- **E2E edge-case matrix:** explicit scenarios for cancel/resubscribe, transfer, grandfather expiry, and grace cleanup.

## Shared Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth providers | Google OAuth + Email magic link | Google covers majority of users; magic link avoids password management |
| Email service | Resend | Modern API, good deliverability, used for magic links and later for summaries (Epic 9) |
| Account linking | BetterAuth `onLinkAccount` callback | Built-in anonymous→permanent upgrade, handles authUserId migration |
| Payment provider | Paddle Billing (v2) | MoR model, handles tax/compliance globally |
| Pro entitlement | Room owner subscription | Matches planning-poker ownership workflow and simplifies billing |
| Webhook handling | Convex `httpAction` | Already used for BetterAuth routes in `convex/http.ts` |
| OAuth token storage | Encrypted in Convex DB (AES-256-GCM) | Per-user tokens need DB storage; static keys use env vars |
| Token refresh | Cron job every 30 min + just-in-time refresh | Prevents expired tokens during API calls |
| Analytics aggregation | Denormalized counters + collect-and-compute | Current room sizes make full-scan acceptable; counters for dashboard |
| Email delivery | Resend | Keep one provider for auth + lifecycle emails |
| Rollout method | Staged cutover with runbook + rollback | Reduces production monetization risk |
| Retention enforcement | Two-step cleanup (schedule -> purge) | Prevents accidental data loss and supports recovery window |
| Observability | Entitlement audit events + warning telemetry | Improves supportability and rollout tuning |
| GitHub API approach | GitHub App (not OAuth App) | Fine-grained permissions, survives user departure, built-in webhooks |
| Jira API approach | OAuth 2.0 (3LO) | Standard Atlassian Cloud auth, supports refresh tokens |
| OAuth callback → Convex | Convex HTTP client + admin key from Next.js route | Server-side token passing avoids exposing tokens to browser |
| Pro gating toggle | `PRO_GATING_ENABLED` env var | Instant rollback without redeploy; checked at query time |
| Webhook idempotency | Shared `webhookEvents` table | Deduplicates Paddle, Jira, and GitHub webhook deliveries |
| Tier name | "Pro" everywhere (code + UI) | Single name avoids confusion; `subscriptionTier: "pro"` |

## Database Schema Additions (Preview)

All new tables introduced across epics:

```typescript
// Accounts (Epic 0) — extends existing users table
users.email                // Email from OAuth or magic link
users.avatarUrl            // Google profile picture
users.accountType          // "anonymous" | "permanent"

// Analytics (Epics 3-5)
votingTimestamps           // Per-issue voting start/end times
individualVotes            // Historical vote records (pre-reveal snapshot)

// Integrations (Epics 6-7)
integrationConnections     // OAuth connections (Jira, GitHub)
integrationMappings        // Room <-> Jira project / GitHub repo mappings
issueLinks                 // Bidirectional links between AgileKit issues and external issues

// Rooms (Epic 9) — extends existing rooms table
rooms.closedAt             // Timestamp when room was explicitly closed

// Notifications (Epic 9)
sessionSummaries           // Generated summary records
notificationPreferences    // Per-user email preferences

// Subscription (Epic 1) — added last, in Phase 4
subscriptions              // Paddle subscription state per user
paddleCustomers            // Maps internal userId -> Paddle customerId
webhookEvents              // Idempotency for webhook processing (shared: Paddle, Jira, GitHub)
entitlementEvents          // Append-only audit log for Pro state transitions
retentionCleanupJobs       // Two-step retention cleanup tracking
users.subscriptionTier     // "free" | "pro"
users.grandfatheredUntil   // Timestamp when grandfathered access expires
users.proGraceUntil    // Timestamp when lapsed-Pro grace ends
```

## Environment Variables Needed

```bash
# Google OAuth (Epic 0) — already configured
GOOGLE_CLIENT_ID                  # Google OAuth client ID
GOOGLE_CLIENT_SECRET              # Google OAuth client secret

# Email / Magic Link (Epic 0) — already configured
RESEND_API_KEY                    # Resend API key for magic link emails
EMAIL_FROM_ADDRESS                # e.g., noreply@agilekit.app

# Encryption (Epic 6-7)
TOKEN_ENCRYPTION_KEY               # AES-256 key for OAuth token encryption

# Jira (Epic 6)
JIRA_CLIENT_ID                     # Atlassian app client ID
JIRA_CLIENT_SECRET                 # Atlassian app client secret

# GitHub (Epic 7)
GITHUB_APP_ID                      # GitHub App ID
GITHUB_APP_CLIENT_ID               # GitHub App client ID
GITHUB_APP_CLIENT_SECRET           # GitHub App client secret
GITHUB_APP_PRIVATE_KEY             # RSA private key (PEM)
GITHUB_WEBHOOK_SECRET              # Webhook HMAC secret

# Convex admin (Epics 6-7) — for server-side OAuth callback flows
CONVEX_ADMIN_KEY                   # Admin key for Next.js -> Convex internal action calls

# Pro gating (Epic 2)
PRO_GATING_ENABLED             # "true" | "false" — controls Pro enforcement

# Paddle (Epic 1) — added last, in Phase 4
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN    # Client-side token
NEXT_PUBLIC_PADDLE_ENV             # "sandbox" | "production"
PADDLE_API_KEY                     # Server-side API key
PADDLE_API_URL                     # Optional override (defaults to sandbox)
PADDLE_WEBHOOK_SECRET              # Webhook signature verification
```
