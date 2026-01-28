# Analytics Dashboard

> **Status: Work in Progress**
>
> This feature is functional but basic. See [Future Improvements](#future-improvements) for planned enhancements.

The Analytics Dashboard provides Scrum Masters with insights into their estimation sessions, team agreement trends, and voting patterns over time.

## Overview

The dashboard aggregates data from all planning rooms a user has participated in, displaying:

- **Summary Statistics** - Total sessions, issues estimated, story points, average agreement
- **Agreement Trend** - Line chart showing team alignment over time
- **Estimation Velocity** - Bar chart of story points per day
- **Vote Distribution** - Histogram of most common estimate values
- **Session History** - List of rooms with quick stats and links

```
┌─────────────────────────────────────────────────────────────────┐
│                     Analytics Dashboard                          │
├─────────────────────────────────────────────────────────────────┤
│  [Sessions: 12]  [Issues: 47]  [Points: 156]  [Agreement: 78%]  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │  Agreement Trend    │  │  Estimation Velocity│               │
│  │  (Line Chart)       │  │  (Bar Chart)        │               │
│  └─────────────────────┘  └─────────────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────────────────────────┐   │
│  │ Vote Dist.  │  │  Session History                        │   │
│  │ (Histogram) │  │  • Room A - 5 issues, 82% agreement     │   │
│  │             │  │  • Room B - 3 issues, 75% agreement     │   │
│  └─────────────┘  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Architecture

### Backend (Convex)

| File | Purpose |
|------|---------|
| `convex/analytics.ts` | API layer - queries with validation |
| `convex/model/analytics.ts` | Business logic - aggregation functions |

**Key Functions:**

- `getUserSessions()` - All rooms user participated in with computed stats
- `getAgreementTrend()` - Agreement % data points from completed issues
- `getVelocityStats()` - Story points grouped by date
- `getVoteDistribution()` - Count of each final estimate value
- `getDashboardSummary()` - Aggregated stats for header cards

### Frontend (Next.js)

| File | Purpose |
|------|---------|
| `src/app/dashboard/page.tsx` | Page route with metadata |
| `src/app/dashboard/dashboard-content.tsx` | Main dashboard component |
| `src/components/dashboard/DateRangePicker.tsx` | Date range filter (7d, 30d, 90d, all) |
| `src/components/dashboard/StatsSummary.tsx` | Header stat cards |
| `src/components/dashboard/SessionHistory.tsx` | Room list with links |
| `src/components/dashboard/AgreementChart.tsx` | Line chart (Recharts) |
| `src/components/dashboard/VelocityChart.tsx` | Bar chart (Recharts) |
| `src/components/dashboard/VoteDistribution.tsx` | Horizontal bar chart |

### Data Flow

1. User visits `/dashboard`
2. Auth check - redirects to home if not authenticated
3. `authUserId` passed to Convex queries
4. Queries aggregate across all `roomMemberships` for user
5. Issue data (`voteStats`) provides agreement, estimates
6. Charts render with Recharts via shadcn/ui chart component

## Access

- Route: `/dashboard`
- Link in user menu dropdown ("Analytics")
- Requires authentication (anonymous session counts)

## Date Range Filtering

All analytics support optional date range filtering:

- **Last 7 days** - Recent activity
- **Last 30 days** - Monthly view
- **Last 90 days** - Quarterly view
- **All time** - Complete history (default)

The filter applies to:
- Session list (by `joinedAt`)
- Issue data (by `votedAt`)
- All computed statistics

## Known Issues

1. **Navigation spacing** - Dashboard uses marketing navbar with insufficient top margin
2. **Marketing nav in dashboard** - Current navbar shows marketing links (Features, Blog, etc.) which aren't relevant in the dashboard context

## Future Improvements

### Navigation
- [ ] Create dedicated dashboard navbar (minimal, app-focused)
- [ ] Add proper page spacing for dashboard layout
- [ ] Consider sidebar navigation for dashboard sections

### Analytics Enhancements
- [ ] Weekly/monthly velocity aggregation view
- [ ] Comparison between time periods
- [ ] Export analytics data (CSV/PDF)
- [ ] Per-room analytics drill-down
- [ ] Team-level analytics (aggregate across team members)

### Charts
- [ ] Interactive tooltips with issue details
- [ ] Click-through from chart points to sessions
- [ ] More chart types (pie chart for distribution, area chart for cumulative)

### Premium Features (Phase 3)
- [ ] Add `subscriptionTier` to user model
- [ ] Gated access with blurred preview for free users
- [ ] Upgrade CTA with feature highlights
- [ ] Payment integration

### Data Improvements
- [ ] Track individual vote participation per issue (currently votes cleared after reveal)
- [ ] Store historical vote snapshots for deeper analysis
- [ ] Add issue complexity/category tagging for filtered analytics

## Testing

Manual verification:
1. Create user with multiple sessions (different rooms)
2. Complete voting on several issues with varying agreement
3. Visit `/dashboard` and verify:
   - Summary stats match expected totals
   - Charts render with correct data
   - Date range filter updates all components
   - Session links navigate to rooms
   - Mobile layout is responsive
