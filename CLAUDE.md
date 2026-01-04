# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AgileKit is an open-source online planning poker tool for Scrum teams. The project is a modern Next.js/Convex stack with a whiteboard-style interface using React Flow.

## Development Commands

```bash
# Development (run both in separate terminals)
npm run dev              # Start Next.js dev server (http://localhost:3000)
npx convex dev           # Start Convex backend

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting errors
npm run ts:check         # TypeScript type checking

# Testing
npm run test:e2e            # Run Playwright tests (starts servers automatically)
npm run test:e2e:ui         # Run with Playwright UI for debugging
npm run test:e2e:headless   # Run in headless mode (CI)

# Run a single test file
npx playwright test tests/room/room-creation.spec.ts

# Run tests matching a pattern
npx playwright test -g "should create a new room"
```

## Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Convex (serverless TypeScript functions with real-time reactivity)
- **Styling**: shadcn/ui, Tailwind CSS 4
- **Canvas**: @xyflow/react for the whiteboard interface

### Convex Backend Pattern

The backend uses a two-layer architecture:

```
convex/
├── rooms.ts           # API layer - thin handlers with validation
├── model/
│   └── rooms.ts       # Domain logic - business rules and data access
```

**API layer** (`convex/*.ts`): Defines mutations/queries with argument validation, delegates to model layer.

**Model layer** (`convex/model/*.ts`): Contains business logic, database operations, and helper functions.

Example usage in frontend:

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const room = useQuery(api.rooms.get, { roomId });
const createRoom = useMutation(api.rooms.create);
```

### Canvas Node System

The room canvas (`src/components/room/`) uses React Flow with custom node types:

- **Node types** defined in `src/components/room/nodes/` (PlayerNode, SessionNode, TimerNode, VotingCardNode, ResultsNode)
- **Type definitions** in `src/components/room/types.ts` - defines `CustomNodeType` union
- **Node state** synced via Convex (`canvasNodes` table)
- **Layout logic** in `useCanvasLayout.ts`, state management in `useCanvasNodes.ts`

### Database Schema

Schema defined in `convex/schema.ts`. Key tables:

- `rooms` - Room configuration and state
- `users` - Participants in rooms
- `votes` - User votes (sanitized based on reveal state)
- `canvasNodes` - Persisted node positions and data

### E2E Testing Pattern

Tests use Page Object Model pattern:

```
tests/
├── pages/              # Page objects (HomePage, RoomPage, JoinRoomPage)
├── utils/              # Helper functions (room-helpers.ts, test-helpers.ts)
├── fixtures/           # Test fixtures
└── *.spec.ts           # Test files
```

### Design Tokens

The project uses semantic design tokens defined in `src/app/globals.css`. These tokens ensure consistent theming across light and dark modes.

**Surface Tokens** - For layered UI elements (stacking depth: 1=base, 2=elevated, 3=highest):
- `surface-1`: Primary containers (cards, panels)
- `surface-2`: Secondary/elevated containers
- `surface-3`: Interactive elements (handles, hover states)

**Status Tokens** - For contextual feedback with `-bg` (background) and `-fg` (foreground) variants:
- `status-info-*`: Informational states (blue)
- `status-success-*`: Success states (green)
- `status-warning-*`: Warning states (amber)
- `status-error-*`: Error states (red)

**Usage in Tailwind**:
```tsx
// Surface tokens
className="bg-white dark:bg-surface-1"
className="hover:bg-gray-100 dark:hover:bg-surface-3"

// Status tokens
className="bg-green-50 dark:bg-status-success-bg"
className="text-green-700 dark:text-status-success-fg"
```

**When to use tokens vs hardcoded values**:
- Use surface tokens for container backgrounds in dark mode
- Use status tokens for semantic feedback colors
- Keep hardcoded values for gradients (tokens don't support gradient pairs)
- Keep hardcoded values for hover states that need distinct visual feedback

## Important Notes

- **shadcn/ui components**: Always use `npx shadcn@latest add [component-name]` - never create manually
- **Convex dev server** must be running alongside Next.js for full functionality
- Both servers start automatically when running Playwright tests
