# Premium Tier - Technical Implementation Plan

> **Reference:** [docs/premium-tier.md](../docs/premium-tier.md)

## Epic Map

| # | Epic | Dependencies | Effort |
|---|------|-------------|--------|
| 1 | [Subscription Infrastructure](./01-subscription-infrastructure.md) | None | Large |
| 2 | [Premium Gating](./02-premium-gating.md) | Epic 1 | Medium |
| 3 | [Time-to-Consensus Tracking](./03-time-to-consensus.md) | Epic 2 | Medium |
| 4 | [Voter Alignment Matrix](./04-voter-alignment.md) | Epic 2 | Medium |
| 5 | [Sprint Predictability Score](./05-sprint-predictability.md) | Epic 3, Epic 4 | Small |
| 6 | [Jira Integration](./06-jira-integration.md) | Epic 2 | XL |
| 7 | [GitHub Integration](./07-github-integration.md) | Epic 2 | XL |
| 8 | [Data Exports](./08-data-exports.md) | Epic 2 | Small |
| 9 | [Automated Summaries](./09-automated-summaries.md) | Epic 2, Epic 8 | Medium |

## Recommended Build Order

```
Phase 1 - Foundation
  Epic 1: Subscription Infrastructure (Paddle)
  Epic 2: Premium Gating

Phase 2 - Analytics
  Epic 3: Time-to-Consensus
  Epic 4: Voter Alignment Matrix
  Epic 5: Sprint Predictability Score
  Epic 8: Data Exports (enhanced)

Phase 3 - Integrations
  Epic 6: Jira Integration
  Epic 7: GitHub Integration

Phase 4 - Automation
  Epic 9: Automated Summaries
```

## Shared Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Payment provider | Paddle Billing (v2) | MoR model, handles tax/compliance globally |
| Webhook handling | Convex `httpAction` | Already used for BetterAuth routes in `convex/http.ts` |
| OAuth token storage | Encrypted in Convex DB (AES-256-GCM) | Per-user tokens need DB storage; static keys use env vars |
| Token refresh | Cron job every 30 min + just-in-time refresh | Prevents expired tokens during API calls |
| Analytics aggregation | Denormalized counters + collect-and-compute | Current room sizes make full-scan acceptable; counters for dashboard |
| Email delivery | SendGrid / Resend | Transactional email for session summaries |
| GitHub API approach | GitHub App (not OAuth App) | Fine-grained permissions, survives user departure, built-in webhooks |
| Jira API approach | OAuth 2.0 (3LO) | Standard Atlassian Cloud auth, supports refresh tokens |

## Database Schema Additions (Preview)

All new tables introduced across epics:

```typescript
// Subscription (Epic 1)
subscriptions              // Paddle subscription state per user
paddleCustomers            // Maps internal userId -> Paddle customerId
webhookEvents              // Idempotency for webhook processing

// Analytics (Epics 3-5)
votingTimestamps           // Per-issue voting start/end times
individualVotes            // Historical vote records (pre-reveal snapshot)

// Integrations (Epics 6-7)
integrationConnections     // OAuth connections (Jira, GitHub)
integrationMappings        // Room <-> Jira project / GitHub repo mappings
syncQueue                  // Pending sync operations

// Notifications (Epic 9)
sessionSummaries           // Generated summary records
notificationPreferences    // Per-user email preferences
```

## Environment Variables Needed

```bash
# Paddle (Epic 1)
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN    # Client-side token
NEXT_PUBLIC_PADDLE_ENV             # "sandbox" | "production"
PADDLE_API_KEY                     # Server-side API key
PADDLE_WEBHOOK_SECRET              # Webhook signature verification

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

# Email (Epic 9)
SENDGRID_API_KEY                   # Or Resend API key
EMAIL_FROM_ADDRESS                 # e.g., noreply@agilekit.app
```
