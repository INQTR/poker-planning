# Monetization Launch Runbook

> Phase 4 cutover playbook for Paddle + room-owner Pro gating.

## Scope

- Enable subscription infrastructure (Epic 1)
- Enable room-owner Pro gating (Epic 2)
- Preserve grandfathering promises
- Enforce free retention safely (5-day policy) after grace

## Preconditions

- Production deploy includes latest schema and functions
- Required env vars are set and verified
- Paddle webhook endpoint is reachable and signature checks pass
- Cron jobs are registered and visible in Convex dashboard
- Support team has approved warning copy and escalation paths

## Launch Sequence

1. Deploy backend changes (schema/functions) with gating still disabled.
2. Verify webhook ingestion in production using sandbox-like test events.
3. Run grandfathering migration once for permanent accounts.
4. Enable in-app warning surfaces (no destructive cleanup yet).
5. Monitor warning telemetry and support incidents for 24-72h.
6. Enable room-owner gating logic.
7. Enable retention cleanup scheduling.
8. After safety buffer confidence, enable hard purge step.

## Validation Checklist

- Owner Pro room shows Pro analytics to participants
- Non-Pro owner sees data-loss warning
- Grace starts correctly when Pro ends
- Re-subscribe during grace clears pending cleanup
- Ownership transfer changes entitlement immediately
- Audit events are being written for state transitions

## Rollback Plan

1. Disable Pro gating feature flag.
2. Pause retention cleanup and purge crons.
3. Stop webhook processing if it is causing entitlement churn.
4. Restore data from safety buffer for affected owners if needed.
5. Post incident summary and corrective plan.

## Incident Triggers

- Unexpected spike in entitlement change events
- Large jump in cleanup-scheduled jobs
- Conversion telemetry drops sharply after warning rollout
- Support tickets report data loss outside policy

## Ownership

- Engineering on-call: TBD
- Product owner: TBD
- Support lead: TBD
- Launch approver: TBD
