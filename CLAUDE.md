# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

AgileKit is an open-source online planning poker tool for Scrum teams. The project is a modern Next.js/Convex stack with a whiteboard-style interface.

## Development Commands

```bash
# Install dependencies
npm install

# Development
npm run dev              # Start Next.js dev server (http://localhost:3000)
npx convex dev           # Start Convex backend (separate terminal)

# Build & Deploy
npm run build            # Production build
npx convex deploy --prod # Deploy Convex functions

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix         # Fix linting errors
npm run ts:check        # TypeScript type checking

# Testing
npm run test:e2e            # Run Playwright tests
npm run test:e2e:ui         # Run with Playwright UI
npm run test:e2e:headless   # Run Playwright tests in headless mode
```

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Convex (serverless TypeScript functions)
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Canvas**: @xyflow/react for room canvas functionality
- **State Management**: Convex reactive queries + React Context for auth
- **Real-time**: Built-in Convex reactivity

### Project Structure

```
/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── room/            # Room-specific components
│   │   │   ├── nodes/       # Canvas node types
│   │   │   └── hooks/       # Custom hooks
│   │   └── ui/              # shadcn/ui components
│   └── hooks/               # Global hooks
├── convex/                  # Backend functions
│   ├── model/               # Domain logic
│   └── *.ts                 # API endpoints
└── public/                  # Static assets
```

### Key Patterns

1. **Convex Functions**: All backend logic in `/convex/*.ts` files
2. **Type Safety**: Convex generates types automatically, import from `convex/_generated/api`
3. **Component Organization**: Features in dedicated directories with co-located hooks
4. **Canvas Nodes**: Each node type is a separate component in `src/components/room/nodes/`

## Common Development Tasks

### Working with Convex

1. **Adding a New Function**: Create in `/convex/` directory
2. **Using in Frontend**: Import with `useQuery`, `useMutation`, or `useAction` from `convex/react`
3. **Real-time Updates**: Convex queries are reactive by default

Example:

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const room = useQuery(api.rooms.getRoom, { roomId });
```

### Adding UI Components

When you need a shadcn/ui component:

```bash
npx shadcn@latest add [component-name]
```

**Never manually create shadcn/ui components** - always use the CLI.

### Canvas Room Development

The canvas room uses React Flow for the whiteboard interface:

- Node types defined in `src/components/room/nodes/`
- Layout logic in `src/components/room/hooks/useCanvasLayout.ts`
- Canvas state managed by `useCanvasNodes` hook

## Important Notes

- Database schema is in `/convex/schema.ts`
- Convex dev server must be running alongside Next.js for full functionality
