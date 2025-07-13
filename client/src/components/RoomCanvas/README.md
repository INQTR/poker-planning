# RoomCanvas Component

## Overview

The RoomCanvas component implements an interactive planning poker room using ReactFlow. It provides a spatial canvas where team members can participate in estimation sessions with real-time synchronization.

## Architecture

### Core Components

- **RoomCanvas** (`index.tsx`) - Main component that orchestrates the canvas
- **Custom Nodes** (`nodes/`) - Specialized ReactFlow nodes for different UI elements
- **Hooks** (`hooks/`) - Custom React hooks for state and layout management
- **Types** (`types.ts`) - TypeScript type definitions

### Performance Optimizations

1. **Memoization**
   - All node components are wrapped with `React.memo()`
   - Complex calculations use `useMemo()`
   - Event handlers use `useCallback()`

2. **Efficient State Management**
   - Layout calculations extracted to `useCanvasLayout` hook
   - Separate state slices for nodes and edges
   - Minimal re-renders through proper dependency arrays

3. **ReactFlow Best Practices**
   - Node types defined outside components
   - Proper use of ReactFlow hooks
   - Optimized viewport management

### Accessibility Features

- ARIA labels and roles on interactive elements
- Keyboard navigation support
- Screen reader announcements for state changes
- Proper focus management

### Theme Support

- Dynamic theme detection via `useTheme` hook
- Consistent dark/light mode styling
- Theme-aware MiniMap coloring

## Node Types

1. **PlayerNode** - Displays team members with voting status
2. **SessionNode** - Central hub showing session info and controls
3. **StoryNode** - Shows the current story being estimated (legacy)
4. **VotingCardNode** - Interactive cards for submitting votes
5. **TimerNode** - Session timer with built-in controls
6. **ResultsNode** - Vote results visualization

## Real-time Features

- GraphQL subscriptions for live updates
- Automatic edge creation for votes
- Synchronized player states
- Instant vote reflections

## Usage

```tsx
import { RoomCanvas } from "@/components/RoomCanvas";

<RoomCanvas room={room} roomId={roomId} />
```

## Future Enhancements

- Spatial audio zones
- Advanced layout algorithms
- Gesture controls
- Canvas persistence
- Mobile optimization