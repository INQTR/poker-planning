# AgileKit - Free Online Planning Poker for Scrum Teams

[![Live Demo](https://img.shields.io/badge/demo-agilekit.app-blue?style=flat-square)](https://agilekit.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/INQTR/poker-planning?style=flat-square)](https://github.com/INQTR/poker-planning/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/INQTR/poker-planning?style=flat-square)](https://github.com/INQTR/poker-planning/network/members)

**The open-source planning poker tool that's completely free, requires no registration, and makes agile estimation simple for remote Scrum teams.**

[**Try AgileKit Now**](https://agilekit.app) | [Report Bug](https://github.com/INQTR/poker-planning/issues) | [Request Feature](https://github.com/INQTR/poker-planning/issues)

![AgileKit Planning Poker Room - Free Scrum Estimation Tool](public/agilekit-screenshot.png "AgileKit Planning Poker Room")

## Features

- **100% Free** - No premium tier, no hidden costs, no credit card required
- **No Registration** - Create a room and start estimating in seconds
- **Real-time Collaboration** - Instant vote synchronization across all participants
- **Modern Canvas Interface** - Whiteboard-style room with intuitive drag-and-drop
- **Multiple Voting Scales** - Fibonacci, Standard, T-Shirt sizes, or create custom scales
- **Issues Management** - Create, edit, and track issues within planning sessions
- **CSV Export** - Export issues with vote statistics (average, median, agreement)
- **Auto-Complete Voting** - Automatic reveal with countdown when all participants vote
- **Vote Analytics** - Average, median, and consensus percentage for each round
- **Visual Voting Progress** - See who has voted at a glance with emoji indicators
- **Built-in Timer** - Session timer for timeboxed estimation rounds
- **Spectator Mode** - Join sessions as an observer without voting
- **Dark/Light Theme** - Toggle themes or follow system preference
- **Auto-cleanup** - Rooms automatically cleaned up after 5 days of inactivity
- **Open Source** - Fully transparent codebase, self-host if you prefer

## Quick Start

**Option 1: Use the hosted version (recommended)**

Visit [agilekit.app](https://agilekit.app), create a room, and share the link with your team.

**Option 2: Self-host**

```bash
# Clone the repository
git clone https://github.com/INQTR/poker-planning.git
cd poker-planning

# Install dependencies
npm install

# Start Convex backend (terminal 1)
npx convex dev

# Start Next.js dev server (terminal 2)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The repository is named `poker-planning` while the product is branded as **AgileKit**. This reflects our [evolution from a single-purpose tool to a broader Agile toolkit](https://github.com/INQTR/poker-planning/discussions/87).

### Prerequisites

- Node.js 20+
- npm

## Technology Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Backend**  | Convex (serverless with real-time reactivity) |
| **Styling**  | Tailwind CSS 4, shadcn/ui                     |
| **Canvas**   | @xyflow/react                                 |
| **State**    | Convex reactive queries                       |

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with Playwright UI for debugging
npm run test:e2e:ui

# Run in headless mode (CI)
npm run test:e2e:headless
```

## Deployment

### Frontend (Next.js)

Deploy to Vercel, Netlify, or any platform supporting Next.js:

```bash
npm run build
```

### Backend (Convex)

```bash
npx convex deploy --prod
```

## Use Cases

- **Sprint Planning** - Estimate user stories with your Scrum team
- **Backlog Refinement** - Collaboratively size your product backlog
- **Remote Estimation** - Perfect for distributed and hybrid teams
- **Agile Training** - Teach planning poker techniques interactively

## Roadmap

- [ ] Jira integration
- [ ] Team velocity tracking
- [ ] Session history (view past sessions)

## Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy & Analytics

The hosted version at [agilekit.app](https://agilekit.app) uses Google Analytics 4 for basic usage analytics (page views, session duration). No personal data is collected beyond standard analytics. Self-hosted instances do not include analytics by default.

See our [Privacy Policy](https://agilekit.app/privacy) for details.

## License

This project is open source under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Made with care for the Agile community</strong><br>
  <a href="https://agilekit.app">agilekit.app</a> - Free Planning Poker for Everyone
</p>
