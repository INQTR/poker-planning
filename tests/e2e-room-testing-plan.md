# E2E Testing Plan for AgileKit Room Features

## Overview

This document outlines the comprehensive end-to-end testing strategy for the poker planning room functionality. The tests will cover all user interactions, real-time collaboration features, and edge cases to ensure a robust and reliable planning poker experience.

## Test Architecture

### Directory Structure

```
tests/
├── pages/                      # Page Object Models
│   ├── room-page.ts           # Main room page interactions
│   ├── join-room-page.ts      # Join room dialog interactions
│   └── canvas-page.ts         # Canvas-specific interactions
├── utils/                      # Testing utilities
│   ├── room-helpers.ts        # Room creation and management
│   └── multi-user.ts          # Multi-user test orchestration
├── room/                       # Room feature test suites
│   ├── room-creation.spec.ts  # Room creation flows
│   ├── room-joining.spec.ts   # Joining room scenarios
│   ├── voting-flow.spec.ts    # Complete voting workflows
│   ├── canvas-interaction.spec.ts # Canvas UI interactions
│   ├── multi-user.spec.ts     # Real-time collaboration tests
│   └── error-handling.spec.ts # Error scenarios and recovery
└── fixtures/                   # Test data and constants
    └── test-data.ts           # Reusable test data
```

## Test Suites Breakdown

### 1. Room Creation Suite (`room-creation.spec.ts`)

Tests for creating and accessing poker planning rooms.

**Scenarios:**
- Create room from home page
- Create room with custom name
- Direct navigation to room URL
- Handle invalid room IDs
- Room persistence after creation

**Key Assertions:**
- Room URL is generated correctly
- Room is accessible via direct link
- Room data persists in database
- Navigation works as expected

### 2. Room Joining Suite (`room-joining.spec.ts`)

Tests for different ways users can join rooms.

**Scenarios:**
- Join as participant with valid name
- Join as spectator
- Name validation (empty, too long, special chars)
- Handle duplicate names
- Toggle between participant/spectator
- Rejoin after page refresh
- Join when room is at capacity

**Key Assertions:**
- Join dialog appears for non-members
- User preferences are saved
- Correct role is assigned
- Canvas loads after joining

### 3. Voting Flow Suite (`voting-flow.spec.ts`)

Core planning poker functionality tests.

**Scenarios:**
- Select voting card
- Change vote before reveal
- Reveal with all votes
- Reveal with partial votes
- Reset for new round
- Spectators cannot vote
- Vote persistence on refresh
- Timer integration

**Key Assertions:**
- Card selection visual feedback
- Vote count updates in real-time
- Results display correctly
- Game state resets properly

### 4. Canvas Interaction Suite (`canvas-interaction.spec.ts`)

Tests for the interactive canvas features.

**Scenarios:**
- Pan canvas by dragging
- Zoom controls (in/out/fit)
- Drag and position nodes
- Copy room URL functionality
- Fullscreen mode toggle
- Node connections display
- Canvas boundaries

**Key Assertions:**
- Smooth canvas navigation
- Node positions persist
- Controls respond correctly
- Visual feedback for interactions

### 5. Multi-User Suite (`multi-user.spec.ts`)

Real-time collaboration testing with multiple users.

**Scenarios:**
- Simultaneous user joins
- Vote synchronization
- Real-time vote count updates
- Card reveal synchronization
- User disconnect handling
- Canvas position sync
- Performance with many users

**Key Assertions:**
- Updates propagate < 1 second
- No race conditions
- Consistent state across users
- Graceful disconnection handling

### 6. Error Handling Suite (`error-handling.spec.ts`)

Tests for error scenarios and recovery.

**Scenarios:**
- Network disconnection
- API failures
- Invalid operations
- Session timeouts
- Concurrent modifications
- Browser compatibility issues

**Key Assertions:**
- Appropriate error messages
- Graceful degradation
- Recovery mechanisms work
- No data loss

## Implementation Guidelines

### Page Object Pattern

Each page object should encapsulate:
- Element selectors using data-testid
- Common actions (click, type, drag)
- Assertions specific to that page
- Wait conditions for async operations

Example structure:
```typescript
export class RoomPage {
  constructor(private page: Page) {}
  
  // Selectors
  get votingCards() { return this.page.getByTestId('voting-card'); }
  get revealButton() { return this.page.getByTestId('reveal-button'); }
  
  // Actions
  async selectCard(value: string) { ... }
  async revealCards() { ... }
  
  // Assertions
  async expectVoteCount(count: number) { ... }
}
```

### Multi-User Testing Pattern

For testing real-time features:
```typescript
const multiUser = new MultiUserSession();
const [userA, userB] = await multiUser.createUsers(browser, 2);

await userA.selectCard('5');
await userB.expectVoteIndicator(userA.name);
```

### Test Data Management

Centralize test data:
- User personas (names, roles)
- Card values
- Room configurations
- Error messages
- Timeouts and delays

## Best Practices

1. **Isolation**: Each test should be independent
2. **Deterministic**: Avoid random data where possible
3. **Descriptive**: Clear test names and assertions
4. **Fast**: Minimize waits, use test IDs
5. **Maintainable**: Reuse page objects and helpers

## Priority Implementation Order

### Phase 1: Core Functionality (Week 1)
- Room creation tests
- Basic joining flow
- Simple voting scenarios

### Phase 2: Advanced Features (Week 2)
- Canvas interactions
- Complete voting workflows
- Timer functionality

### Phase 3: Collaboration (Week 3)
- Multi-user scenarios
- Real-time synchronization
- Performance testing

### Phase 4: Edge Cases (Week 4)
- Error handling
- Recovery mechanisms
- Browser compatibility

## Success Metrics

- **Coverage**: 90%+ of user flows tested
- **Reliability**: < 1% flaky tests
- **Performance**: All tests complete in < 5 minutes
- **Maintainability**: Clear structure and documentation

## Testing Checklist

Before marking a feature as tested:
- [ ] Happy path covered
- [ ] Error cases handled
- [ ] Multi-user scenarios work
- [ ] Performance is acceptable
- [ ] Accessibility verified
- [ ] Mobile viewport tested

## Future Enhancements

- Visual regression testing
- Performance benchmarking
- Accessibility automation
- Load testing for scaling
- Cross-browser matrix testing

---

This plan serves as the foundation for implementing comprehensive e2e tests for the poker planning room functionality. Each test suite should be implemented incrementally, with continuous refinement based on discoveries during implementation.