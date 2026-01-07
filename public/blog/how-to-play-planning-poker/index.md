---
title: "How to Play Planning Poker: A Step-by-Step Guide for Scrum Teams"
date: "2025-01-07"
spoiler: "Learn how to run effective planning poker sessions with your team. This guide covers the rules, best practices, and tips for better sprint estimation."
tags: ["planning-poker", "estimation", "scrum", "agile"]
---

<Tldr>
Planning poker is a team estimation technique where everyone votes simultaneously using numbered cards, then discusses differences to reach consensus. Use the Fibonacci scale (1, 2, 3, 5, 8, 13...), focus on relative sizing not hours, and keep stories small enough to estimate quickly.
</Tldr>

Planning poker is a consensus-based estimation technique that helps agile teams estimate the effort required for user stories and tasks. It combines expert opinion, analogy, and decomposition into a fun, engaging process that produces accurate estimates while building team alignment.

## What is Planning Poker?

Planning poker (also called Scrum poker) is an estimation technique where team members use numbered cards to vote on how much effort a task requires. The process encourages discussion, surfaces different perspectives, and helps teams reach consensus on estimates.

The technique was first defined by James Grenning in 2002 and later popularized by Mike Cohn in his book "Agile Estimating and Planning."

## Why Use Planning Poker?

Traditional estimation methods often fall victim to anchoring bias—when the first person to speak influences everyone else's estimate. Planning poker solves this by having everyone reveal their estimates simultaneously.

**Key benefits include:**

- **Reduced anchoring bias** - Simultaneous reveals prevent groupthink
- **Better discussions** - Outliers spark valuable conversations
- **Team alignment** - Everyone understands the work being estimated
- **Improved accuracy** - Wisdom of the crowd leads to better estimates
- **Engagement** - The game format keeps estimation sessions energizing

## The Planning Poker Process

### Step 1: Prepare the Backlog

Before the session, the Product Owner should have a prioritized list of user stories ready. Each story should have:

- A clear description of what needs to be built
- Acceptance criteria defining "done"
- Any relevant context or constraints

### Step 2: Present the Story

The Product Owner reads the user story aloud and answers any clarifying questions. This is crucial—everyone must understand what they're estimating before voting.

```
As a [user type]
I want [goal]
So that [benefit]
```

### Step 3: Discuss and Ask Questions

Team members ask questions to clarify requirements, identify dependencies, and surface potential challenges. Common questions include:

- What's the scope of this work?
- Are there any technical constraints?
- Does this depend on other stories?
- What's the happy path vs edge cases?

### Step 4: Vote Simultaneously

Once discussion wraps up, each team member privately selects a card representing their estimate. When everyone is ready, all cards are revealed at once.

Most teams use the **modified Fibonacci sequence**: 0, 1, 2, 3, 5, 8, 13, 21, ?

The gaps between numbers grow larger because humans are better at distinguishing small differences than large ones. An 8-point story and a 9-point story are effectively the same complexity.

### Step 5: Discuss Outliers

If estimates vary significantly, the team discusses the differences:

- The **highest estimator** explains their concerns
- The **lowest estimator** explains their optimism
- The team considers new information

This discussion often reveals misunderstandings, hidden complexity, or opportunities to simplify.

### Step 6: Re-vote if Needed

After discussion, the team votes again. Usually 2-3 rounds are sufficient to reach consensus. If the team can't converge, consider:

- Breaking the story into smaller pieces
- Accepting the higher estimate and moving on
- Timeboxing further discussion

## Common Estimation Scales

### Fibonacci Sequence (Most Popular)

**Cards: 0, 1, 2, 3, 5, 8, 13, 21, ?**

The increasing gaps acknowledge uncertainty in larger estimates. A "13" doesn't mean exactly 13 units—it means "bigger than an 8, smaller than a 21."

### T-Shirt Sizes

**Cards: XS, S, M, L, XL, XXL**

Good for teams who struggle with numbers or want to avoid false precision. Map sizes to story points later for velocity tracking.

### Powers of 2

**Cards: 1, 2, 4, 8, 16, 32**

Some teams prefer this scale as the doubling makes relative sizing more intuitive.

## Best Practices for Effective Sessions

### Keep Stories Small

Stories that get estimated at 13+ points should usually be split. Large estimates carry more uncertainty and are harder to complete within a sprint.

### Use a Reference Story

Establish a "reference story" that everyone agrees is a certain size (often a 3 or 5). Compare new stories against this baseline to calibrate estimates.

### Timebox Discussions

Set a time limit (2-3 minutes) for each story's discussion. If you can't estimate it quickly, it probably needs refinement.

### Include the Whole Team

Everyone who does the work should estimate. Developers, testers, designers—their perspectives catch different types of complexity.

### Focus on Relative Sizing

Story points measure effort relative to other stories, not absolute time. A 5-point story is roughly 2-3x the effort of a 2-point story.

### Don't Anchor on Individuals

Avoid phrases like "How long would this take you, Sarah?" Instead, ask "How much effort is this for the team?"

## Special Cards Explained

| Card | Meaning |
|------|---------|
| **0** | Already done or trivial (< 15 min) |
| **?** | "I have no idea" - need more information |
| **☕** | "I need a break" - pause the session |
| **∞** | Too big to estimate - must be split |

## Running Planning Poker with AgileKit

AgileKit makes planning poker simple for remote and hybrid teams:

1. **Create a room** - Get a shareable link in one click
2. **Invite your team** - No accounts or downloads required
3. **Select your deck** - Fibonacci, T-shirt, or custom scales
4. **Vote together** - Real-time synchronization across all devices
5. **Reveal results** - See the spread and discuss outliers

<Cta>
Start your next sprint planning with a free planning poker session.
</Cta>

## Common Mistakes to Avoid

### Mistake 1: Estimating in Hours

Story points measure complexity, not time. A 5-point story might take 2 hours for an expert or 2 days for a beginner. Track velocity, not hours.

### Mistake 2: Skipping Discussion

The conversation is more valuable than the number. Rushing through stories defeats the purpose of collaborative estimation.

### Mistake 3: Averaging Estimates

If votes split between 3 and 8, don't just call it a 5. The disagreement signals misalignment that needs resolution.

### Mistake 4: Re-estimating Done Work

Once a story is complete, its estimate becomes historical data. Don't change it retroactively—your velocity tracking depends on honest numbers.

## Measuring Success

Track these metrics to improve your estimation:

- **Velocity consistency** - Should stabilize after 3-4 sprints
- **Estimation accuracy** - Compare estimates to actual completion
- **Story completion rate** - Are you finishing what you commit to?
- **Discussion quality** - Are outliers sparking useful conversations?

## Frequently Asked Questions

<Faq>
<FaqItem question="How long should a planning poker session last?">
A typical session runs 1-2 hours, covering 10-20 user stories. Timebox each story to 2-3 minutes of discussion. If you can't estimate quickly, the story likely needs refinement.
</FaqItem>

<FaqItem question="What's the difference between story points and hours?">
Story points measure relative complexity, not time. A 5-point story is roughly 2-3x the effort of a 2-point story, regardless of who works on it. Hours vary by person; points are team-consistent.
</FaqItem>

<FaqItem question="Can planning poker work for remote teams?">
Yes! Online tools like AgileKit enable real-time voting across time zones. Remote planning poker often produces better estimates because simultaneous reveals prevent in-person social pressure.
</FaqItem>

<FaqItem question="Should QA and designers participate in planning poker?">
Absolutely. Anyone who contributes to completing a story should estimate. Testers catch complexity developers miss, and designers ensure UI effort is accounted for.
</FaqItem>
</Faq>

## Conclusion

Planning poker transforms estimation from a tedious chore into a collaborative exercise that builds team understanding. The technique works because it:

1. Prevents anchoring bias
2. Surfaces hidden complexity
3. Builds shared understanding
4. Creates accurate relative estimates

<Cta label="Start Free Planning Poker Session">
Ready to try planning poker with your team? No signup required.
</Cta>
