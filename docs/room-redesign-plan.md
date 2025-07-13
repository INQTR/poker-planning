# Room Page Redesign Plan: Endless Canvas with ReactFlow

## Executive Summary

This document outlines a comprehensive redesign of the PokerPlanning.org room page, transforming it from a static table-centered layout to a dynamic, spatial endless canvas experience using ReactFlow (@xyflow/react). This redesign aims to create a more expansive, flexible, and engaging environment for distributed teams conducting planning poker sessions.

## Vision & Goals

### Primary Vision

Transform the room experience from a constrained table metaphor to an expansive collaborative canvas where teams can:

- **Spatially organize** their planning sessions with unlimited room to spread out
- **Create zones** for different discussion topics or story groups
- **Build visual context** around their planning with notes, diagrams, and annotations
- **Maintain focus** while having the freedom to explore and organize

### Key Goals

1. **Spatial Freedom**: Remove the constraints of a fixed table layout
2. **Enhanced Collaboration**: Enable richer team interactions through visual elements
3. **Improved Context**: Allow teams to build visual context around their planning
4. **Better Organization**: Support grouping and categorizing of planning items
5. **Scalability**: Handle sessions with many participants and stories gracefully

## Architecture Overview

### Technology Stack

- **ReactFlow** (@xyflow/react): Core canvas engine
- **Custom Node Types**: Specialized components for poker planning
- **Real-time Sync**: GraphQL subscriptions for collaborative features
- **State Management**: Hybrid approach using ReactFlow state + Apollo Client

### Core Components

#### 1. Canvas Foundation

```typescript
interface CanvasState {
  nodes: Node[]; // All visual elements
  edges: Edge[]; // Connections between elements
  viewport: Viewport; // User's current view
  layout: LayoutConfig; // Active layout algorithm
}
```

#### 2. Node Types

- **PlayerNode**: Represents a team member with avatar and status
- **StoryNode**: Displays a story/task to be estimated
- **VotingCardNode**: Interactive card for submitting estimates
- **NoteNode**: Freeform text annotations
- **GroupNode**: Container for organizing related items
- **TimerNode**: Session timer widget
- **ResultsNode**: Vote distribution visualization

#### 3. Layout Engines

- **CircleLayout**: Players arranged in a circle (default)
- **GridLayout**: Organized grid for many stories
- **FreeformLayout**: Manual positioning
- **ClusterLayout**: Smart grouping by tags/epics

## Design Concepts

### 1. Infinite Canvas Space

The canvas provides unlimited space in all directions, with:

- **Smart viewport management**: Auto-focus on active areas
- **Minimap navigation**: Overview of the entire workspace
- **Breadcrumb zones**: Quick navigation between canvas areas
- **Background grid**: Subtle spatial reference with customizable patterns

### 2. Spatial Organization Patterns

#### Zone-Based Planning

```
┌─────────────────────────────────────────────────┐
│                    Canvas                        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │  Backlog  │  │  Current  │  │ Completed │   │
│  │   Zone    │  │  Sprint   │  │  Stories  │   │
│  └───────────┘  └───────────┘  └───────────┘   │
│                                                  │
│  ┌─────────────────────────────┐               │
│  │     Active Voting Area      │               │
│  │   ┌─────┐ ┌─────┐ ┌─────┐  │               │
│  │   │Story│ │Story│ │Story│  │               │
│  │   └─────┘ └─────┘ └─────┘  │               │
│  └─────────────────────────────┘               │
└─────────────────────────────────────────────────┘
```

#### Radial Player Distribution

Players float freely around stories, creating organic clusters:

- **Magnetic attraction**: Players drawn to stories they're discussing
- **Personal space**: Automatic collision avoidance
- **Status indicators**: Visual cues for thinking/voted/observing

### 3. Interactive Elements

#### Drag & Drop Capabilities

- **Players**: Can reposition themselves on the canvas
- **Stories**: Draggable between zones
- **Cards**: Drag voting cards onto stories
- **Groups**: Create containers by dragging items together

#### Connection Lines

- **Discussion threads**: Visual lines between players and stories
- **Vote connections**: Show which player voted on which story
- **Relationship links**: Connect related stories

### 4. Visual Enhancements

#### Dynamic Backgrounds

- **Heat maps**: Show activity concentration
- **Time gradients**: Visualize session progression
- **Custom themes**: Team-specific visual identities

#### Particle Effects

- **Vote submission**: Subtle animation when cards are played
- **Consensus celebration**: Particles when team reaches agreement
- **Focus indicators**: Gentle pulsing on active elements

## User Interaction Flows

### 1. Joining a Room

```
1. User enters room → Canvas loads with welcome animation
2. Avatar appears at edge → Smoothly animates to default position
3. Tutorial overlay (first-time users) → Interactive canvas introduction
4. User can immediately start exploring the space
```

### 2. Story Estimation Flow

```
1. Facilitator drags story to "Active Zone"
2. Story node expands → Shows full description
3. Players naturally cluster around the story
4. Voting cards appear near each player
5. Players drag cards onto story or click to vote
6. Real-time visual feedback as votes come in
7. Results visualization appears in place
8. Story can be dragged to "Completed Zone"
```

### 3. Navigation Patterns

- **Pan**: Click and drag on empty space
- **Zoom**: Scroll wheel or pinch gesture
- **Focus**: Double-click on element to center
- **Overview**: Toggle minimap for bird's eye view
- **Shortcuts**: Keyboard navigation (Space + drag to pan)

### 4. Collaboration Features

#### Spatial Audio Zones (Future Enhancement)

- Proximity-based audio channels
- Whisper zones for side conversations
- Broadcast mode for facilitator

#### Gesture System

- **Pointing**: Click and hold to create temporary pointer
- **Drawing**: Shift + drag for temporary annotations
- **Emoji reactions**: Right-click for quick reactions

## Implementation Phases

> **Current Status**: Phase 1 partially complete, focusing on improving existing features before proceeding
>
> **Progress Tracking**: See [canvas-room-progress.md](./canvas-room-progress.md) for detailed status

### Phase 1: Foundation (Weeks 1-2) - IN PROGRESS

- [x] Set up ReactFlow with TypeScript
- [x] Create basic node components (Player, Story, Card)
- [x] Implement canvas navigation and controls
- [x] Connect to existing GraphQL subscriptions

**Issues to Fix Before Proceeding:**

- StoryNode shows hardcoded data instead of real story
- TimerNode has no controls
- Voting cards positioned incorrectly
- ControlsNode is deprecated

### Phase 2: Core Planning Features (Weeks 3-4)

- [ ] Implement voting flow with new UI
- [ ] Create zone-based layout system
- [ ] Add results visualization nodes
- [ ] Implement state synchronization
- [ ] Add connection lines between elements

### Phase 3: Enhanced Interactions (Weeks 5-6)

- [ ] Add advanced drag & drop with constraints
- [ ] Implement layout algorithms
- [ ] Create minimap component
- [ ] Add keyboard shortcuts
- [ ] Implement undo/redo system

### Phase 4: Collaboration Features (Weeks 7-8)

- [ ] Add note nodes and annotations
- [ ] Implement group nodes and containers
- [ ] Create visual effects and animations
- [ ] Add collaborative cursors
- [ ] Implement canvas persistence

### Phase 5: Polish & Optimization (Weeks 9-10)

- [ ] Performance optimization for large sessions
- [ ] Accessibility improvements
- [ ] Mobile/tablet optimization
- [ ] User preferences and customization
- [ ] Comprehensive testing

## Technical Implementation Details

### 1. ReactFlow Configuration

```typescript
const roomFlowConfig = {
  nodeTypes: {
    player: PlayerNode,
    story: StoryNode,
    votingCard: VotingCardNode,
    note: NoteNode,
    group: GroupNode,
    timer: TimerNode,
    results: ResultsNode,
  },
  defaultViewport: { x: 0, y: 0, zoom: 1 },
  minZoom: 0.5,
  maxZoom: 2,
  snapToGrid: true,
  snapGrid: [25, 25],
  defaultEdgeOptions: {
    animated: true,
    style: { stroke: "#b1b1b7" },
  },
};
```

### 2. State Management Strategy

```typescript
// Hybrid state approach
interface RoomCanvasState {
  // ReactFlow managed
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;

  // Apollo Client managed
  room: RoomSubscription;
  players: Player[];
  stories: Story[];
  votes: Vote[];

  // Local UI state
  selectedNodeIds: string[];
  isDragging: boolean;
  activeZone: ZoneId;
}
```

### 3. Real-time Synchronization

```typescript
// Sync strategy
const syncStrategy = {
  // Optimistic updates for immediate feedback
  optimistic: ["nodePosition", "vote", "selection"],

  // Server authoritative for critical data
  authoritative: ["voteResults", "storyStatus", "playerJoin"],

  // Conflict resolution
  conflictResolution: "lastWrite",

  // Batching for performance
  batchInterval: 100, // ms
};
```

### 4. Performance Optimizations

- **Viewport culling**: Only render visible nodes
- **LOD system**: Reduce detail for zoomed-out views
- **Debounced updates**: Batch position changes
- **Web workers**: Offload layout calculations
- **Virtual scrolling**: For node lists

## Migration Strategy

### 1. Feature Parity Checklist

- [ ] Join room and create user
- [ ] Display all players
- [ ] Show voting cards
- [ ] Submit votes
- [ ] Reveal cards
- [ ] Show results
- [ ] Start new game
- [ ] Copy room link
- [ ] Canvas-specific features

### 2. Gradual Rollout

1. **Alpha**: Internal testing with feature flag
2. **Beta**: Opt-in for specific rooms
3. **A/B Test**: Random assignment for new rooms
4. **General Availability**: Full rollout with legacy fallback

### 3. Data Migration

- Existing rooms continue with current UI
- New rooms default to canvas view
- Migration tool for converting old rooms
- Export/import for canvas layouts

## Accessibility Considerations

### 1. Keyboard Navigation

- **Tab order**: Logical flow through canvas elements
- **Arrow keys**: Navigate between connected nodes
- **Shortcuts**: Full keyboard control for all actions

### 2. Screen Reader Support

- **ARIA landmarks**: Define canvas zones
- **Live regions**: Announce voting updates
- **Descriptive labels**: Context for all nodes

### 3. Visual Accessibility

- **High contrast mode**: Alternative color schemes
- **Focus indicators**: Clear visual focus states
- **Zoom support**: Beyond canvas zoom

## Performance Metrics & Goals

### Target Metrics

- **Initial load**: < 2 seconds
- **Node render**: < 16ms (60 fps)
- **Sync latency**: < 100ms
- **Max nodes**: 1000+ without degradation

### Monitoring

- Canvas FPS counter
- Network sync metrics
- Memory usage tracking
- User interaction heatmaps

## Future Enhancements

### Near Term (3-6 months)

1. **Templates**: Pre-built canvas layouts
2. **Integrations**: Jira/GitHub story import
3. **Export**: Canvas to image/PDF
4. **Mobile app**: Native mobile experience

### Long Term (6-12 months)

1. **AI assistance**: Smart story grouping
2. **Voice commands**: Hands-free voting
3. **Analytics**: Advanced session insights

## Risk Mitigation

### Technical Risks

1. **Performance degradation**
   - Mitigation: Aggressive optimization and testing
2. **Browser compatibility**
   - Mitigation: Progressive enhancement approach
3. **State synchronization conflicts**
   - Mitigation: CRDT or OT implementation

### User Experience Risks

1. **Learning curve**
   - Mitigation: Interactive tutorial and progressive disclosure
2. **Overwhelming complexity**
   - Mitigation: Start simple, add features gradually
3. **Lost functionality**
   - Mitigation: Maintain feature parity first

## Success Metrics

### Quantitative

- **Engagement**: Time spent in room +25%
- **Completion rate**: Stories estimated +15%
- **User retention**: Return users +20%

### Qualitative

- User feedback scores > 4.5/5
- Reduced friction in planning sessions
- Increased team collaboration
- Positive sentiment in user interviews

## Conclusion

This redesign represents a fundamental shift in how teams experience planning poker - from a constrained table metaphor to an expansive collaborative canvas. By leveraging ReactFlow's powerful capabilities and focusing on spatial freedom, we can create a more engaging, flexible, and productive environment for agile teams.

The phased approach ensures we maintain stability while progressively enhancing the experience. With careful attention to performance, accessibility, and user experience, this canvas-based approach will set a new standard for online planning poker tools.

## Appendix: Technical Resources

### ReactFlow Documentation

- [Official Docs](https://reactflow.dev)
- [Examples](https://reactflow.dev/examples)
- [API Reference](https://reactflow.dev/api-reference)

### Related Libraries

- [@xyflow/react](https://www.npmjs.com/package/@xyflow/react)
- [Yjs](https://yjs.dev/) - For real-time collaboration

### Performance Resources

- [React Performance](https://react.dev/learn/render-and-commit)
- [Canvas Optimization](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
