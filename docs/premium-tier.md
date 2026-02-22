# Premium Tier Strategy

> **Status: Planning Phase**
>
> This document outlines the strategy for AgileKit's monetization through a single Premium Tier.

## Monetization Strategy

AgileKit uses a simple Freemium model to drive adoption, while offering high-value workflow and analytics features in a single Premium subscription.

### 1. Free Tier (Current Functionality)
- **Unlimited Usage:** No time limits or usage limits on planning poker sessions.
- **Full Core Features:** All current functionality remains free. Users can participate, vote, and manage rooms.
- **Basic Analytics:** Recent session history, total points, and average agreement.

### 2. Premium Tier (Paid)
A single paid tier that unlocks all advanced features for the subscribing user.
- **No Complex Roles:** There is no need for dedicated "Scrum Master" or "Admin" roles. Any user who subscribes to the Premium tier can access and use all advanced features (whether they are a player or spectator).
- **All-in-One Package:** All of the premium features below are included in this single subscription tier.

---

## Premium Features Business Analysis

This section details the functional requirements and business value of each Premium feature to guide the implementation.

### Actionable Insights

These features transform AgileKit from a simple voting tool into a team performance optimization platform.

#### 1. Time-to-Consensus Tracking
- **Business Value:** Helps Scrum Masters and Agile Coaches identify bottlenecks in planning meetings. Long discussions often indicate unclear requirements, missing acceptance criteria, or hidden technical debt.
- **How it Works:** 
  - The system records a timestamp when voting starts for an issue and when the final consensus estimate is selected.
  - The duration is calculated and stored per issue.
- **User Experience (UI):** 
  - **Session Summary:** A new metric in the session history showing the "Average Time per Issue."
  - **Issue Breakdown:** A chart or highlighted list showing outlier tickets (e.g., "Issue PROJ-123 took 15 minutes to estimate, 3x the session average").
  - **Trend Analysis:** A graph showing whether the team is getting faster at estimating over multiple sprints, indicating improving backlog refinement.

#### 2. Voter Alignment Matrix
- **Business Value:** Highlights team members who might lack domain knowledge (always estimating too high) or who might be overly optimistic/reckless (always estimating too low). It fosters targeted coaching and better alignment without pointing fingers during the meeting.
- **How it Works:**
  - The system tracks every individual's initial vote before the reveal.
  - It compares this vote against the final agreed-upon consensus value.
  - A delta is calculated (e.g., User A voted 8, consensus was 3 -> User A was +2 steps higher on the Fibonacci scale).
- **User Experience (UI):**
  - **Alignment Radar:** A scatter plot or matrix showing users plotted by their tendency to under-estimate vs. over-estimate across multiple sessions.
  - **Individual Stats:** Metrics like "Agrees with consensus 80% of the time" or "Averages +1 point above consensus."

#### 3. Sprint Predictability Score
- **Business Value:** Connects planning estimation with actual delivery. Demonstrates the accuracy of the team's estimation process over time, which is highly valuable for management and stakeholders.
- **How it Works:**
  - Aggregates the total estimated complexity (story points) from a set of issues in a specific timeframe.
  - *(Future phase: Ingests completed ticket data from Jira/GitHub to compare estimated points vs. actual completed points).*
- **User Experience (UI):**
  - A "Predictability Health" gauge (e.g., 85% predictability).
  - Trend charts showing estimated velocity vs. historical capacity.

### Workflow Integrations (Highest Value)

Integrations are the core driver for B2B monetization as they directly eliminate manual data entry and context switching, providing an immediate return on investment.

#### 1. Two-Way Sync (Jira & GitHub Projects)
- **Business Value:** Eliminates the need for a Scrum Master to manually create issues in the poker tool and then manually update Jira/GitHub after the meeting.
- **How it Works:**
  - User authenticates via OAuth 2.0 with Jira or GitHub.
  - User maps their AgileKit room to a specific Jira Project/Sprint or GitHub Repository/Project.
  - Webhooks or polling ensure that if an issue title/description changes in Jira, it updates in the AgileKit room (and vice versa).

#### 2. One-Click Import
- **Business Value:** Drastically reduces meeting preparation time from 10+ minutes to 10 seconds.
- **How it Works:**
  - Inside a room, the Premium user clicks "Import Issues".
  - A modal opens showing their active Sprints or Backlog from the connected integration.
  - User selects issues, and they are instantly populated in the room's issue queue with titles, descriptions, and direct links back to the original tracker.

#### 3. Auto-Update (Push Estimates Back)
- **Business Value:** The "magic moment" for the user. Saves 10-15 minutes of administrative work per planning session.
- **How it Works:**
  - Once consensus is reached on an issue in AgileKit, the system automatically triggers an API call to Jira/GitHub.
  - The designated "Story Points" or "Estimate" custom field on the original ticket is updated with the consensus value.
  - If an issue is skipped or deferred, a comment can optionally be posted to the ticket.

### Advanced Session Management

#### 1. Data Exports
- **Business Value:** Allows organizations to keep compliance records, build custom reports, or import data into internal BI tools (Tableau, PowerBI).
- **How it Works:**
  - Premium users see an "Export" button on past sessions.
  - Generates a CSV containing: Issue Name, Description, Final Estimate, Time to Consensus, and Individual Votes.

#### 2. Automated Summaries
- **Business Value:** Keeps stakeholders and absent team members informed without manual write-ups from the Scrum Master.
- **How it Works:**
  - When a room is marked as "Closed" or "Finished", a background job generates a summary.
  - The email contains: Total issues estimated, total points, average alignment, longest discussed issue, and a link to the full report.
  - Sent automatically to all participants (or a specified mailing list).

---

## Architecture & Implementation Notes

- Add `subscriptionTier` to the `users` table in Convex.
- Premium features in the UI will check the current user's subscription status.
- Integrations will require storing OAuth tokens securely for Jira and GitHub.
- The existing analytics dashboard will be revamped to include the new Actionable Insights (Time-to-Consensus, Alignment Matrix), which will be gated behind the Premium tier.
- Use **Paddle** (paddle.com) as the Merchant of Record and subscription management platform.