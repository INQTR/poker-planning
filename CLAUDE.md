# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

PokerPlanning.org is an open-source online planning poker tool for Scrum teams. The project is currently undergoing a migration from a React/TypeScript frontend with GraphQL backend to a Leptos/Rust-based full-stack implementation.

## Current Architecture Status

The repository contains **two implementations**:
- **React Frontend + GraphQL Backend** (`/client` + `/server`): The original implementation
- **Leptos Full-Stack** (`/src`): The new Rust-based implementation using Leptos server functions (no GraphQL)

Both exist during the migration period on the `rewrite-frontend-to-rust` branch.

## Leptos Resources

For detailed information about Leptos server functions and the latest Leptos patterns, use the **Context7 MCP server** which provides comprehensive Leptos documentation and best practices for v0.8.2.

## Development Commands

### Leptos Implementation (New)

```bash
# Development with auto-reload
cargo leptos watch

# Production build
cargo leptos build --release

# Run production server
cargo leptos serve --release

# Format code
cargo fmt

# Run lints
cargo clippy

# Run tests
cargo test
```

The Leptos development server runs on http://localhost:4000

### React Frontend (Original)

```bash
cd client
npm install                 # Install dependencies
npm run dev                 # Start development server (http://localhost:5173)
npm run build              # Production build
npm run lint               # Check for linting errors
npm run lint:fix           # Fix linting errors
npm run checkTs            # TypeScript type checking
npm test                   # Run unit tests with Vitest
npm run coverage           # Run tests with coverage report
npm run codegen            # Generate GraphQL types from schema
```

### GraphQL Backend (Original - Used by React Frontend Only)

```bash
cd server
cargo build                # Build the project
cargo run                  # Run the server (http://localhost:8000)
cargo watch -x run         # Run with auto-reload (requires cargo-watch)
cargo check                # Check for compilation errors
cargo test                 # Run tests
```

### End-to-End Tests

```bash
cd end2end
npm install
npm run test:headless      # Run Playwright tests in headless mode
npm run test:ui            # Run Playwright tests with UI
```

## Architecture Overview

### Leptos Architecture (New)

- **Framework**: Leptos 0.8.2 with SSR and hydration
- **Backend**: Integrated Leptos server functions (no separate GraphQL backend)
- **Language**: Rust with wasm-bindgen for client-side
- **Routing**: Leptos Router with nested routes
- **State Management**: Leptos reactive signals and resources
- **Server Functions**: Direct server function calls with `#[server]` macro
- **Styling**: Tailwind CSS with Rust view macros
- **Real-time**: Server-sent events or WebSockets via Leptos
- **Components**: Located in `/src/components/`
- **Pages**: Located in `/src/pages/`

### React + GraphQL Architecture (Original)

- **Frontend**: React 19 with TypeScript in strict mode
- **Backend**: Separate Actix Web server with async-graphql
- **Routing**: TanStack Router with file-based routing in `/routes`
- **State Management**: Apollo Client for GraphQL state, React Context for auth
- **UI Components**: Custom components using shadcn/ui and Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration
- **Real-time**: GraphQL subscriptions via WebSocket

## Key Patterns

### Leptos Development

1. **Server Functions**: Use `#[server]` macro for backend logic - replaces GraphQL endpoints
2. **Components**: Use `#[component]` macro with reactive signals
3. **Routing**: Define routes in `App` component with `<Route>` components
4. **State**: Use `create_signal`, `create_resource`, and `create_action`
5. **Styling**: Use Tailwind classes directly in view! macros
6. **No GraphQL**: All server communication via Leptos server functions

### React Development (Original)

1. **GraphQL Operations**: All GraphQL queries/mutations/subscriptions are in `client/src/api/operations.graphql`
2. **Type Generation**: Run `npm run codegen` after modifying GraphQL operations
3. **Component Structure**: Components are self-contained with their own directories
4. **Error Handling**: Use toast notifications for user-facing errors
5. **Authentication**: User context stored in AuthContext, persisted to localStorage

## Testing Strategy

### Unit Tests

- **Leptos**: Rust tests using `#[cfg(test)]` modules
- **React**: Vitest with Testing Library for React components
- Test files co-located with components

### E2E Tests

- Playwright tests in `/end2end/tests/`
- Test real user flows: creating rooms, joining, voting
- Must have appropriate frontend running (React on 5173 or Leptos on 4000)
- **IMPORTANT**: Always run e2e tests in headless mode: `npm run test:headless`

## Common Development Tasks

### Working with Leptos

1. **Creating a Component**: Add to `/src/components/` with `#[component]` macro
2. **Adding a Route**: Define in `App` component's router configuration
3. **Server Functions**: Use `#[server]` for backend logic, accessible from client
4. **Reactive State**: Use signals for client-side state management
5. **Consult Context7**: Use Context7 MCP server for Leptos best practices and patterns

### Working with React/GraphQL (Original)

1. Add query/mutation/subscription to `client/src/api/operations.graphql`
2. Run `npm run codegen` to generate types
3. Import and use generated hooks from `src/api/operations.generated.ts`

## Deployment

The app deploys to DigitalOcean App Platform:

- **Configuration**: `spec.yaml` in root directory
- **Frontend**: Static site build (currently React, will switch to Leptos)
- **Backend**: Dockerized Rust server (GraphQL for React, integrated for Leptos)
- **Region**: Frankfurt (fra)

## Important Notes

- **Migration Status**: Actively migrating from React+GraphQL to Leptos with server functions
- **Port Configuration**:
  - Leptos: 4000 (includes both frontend and backend)
  - React: 5173 (frontend only)
  - GraphQL Backend: 8000 (for React frontend only)
- **Node.js**: Version must be >=20 for React frontend
- **Rust**: Uses edition 2024 for Leptos implementation
- **Environment Variables**: React frontend variables must be prefixed with `VITE_`
- **WebSocket**: GraphQL subscriptions endpoint at `ws://localhost:8000/graphql` (React only)
- **Server Functions**: Leptos uses integrated server functions, not GraphQL