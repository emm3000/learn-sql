# ADR-0005: Belt-based progression with soft gating

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

Most SQL resources are a flat pile of topics; the learner never sees how far they have
come or what mastery looks like, which kills motivation. We want a clear map and a
strong sense of progress.

## Decision

Organize the whole journey into five **belts** — Beginner, Intermediate, Advanced,
Ninja, Insane — that map directly onto the master roadmap phases
(`learning/ROADMAP_POSTGRES.md`). Each belt groups several lessons.

Gating between lessons is **soft**: a recommended order is shown and completion is
tracked, but learners can navigate freely within an active belt. In the MVP, belts
beyond Beginner are visible but marked "coming soon."

## Alternatives considered

- **Flat lesson list.** Simplest, but provides no journey, no milestones, no motivation.
- **Hard gating (lock each lesson until the previous one is passed).** Stronger
  game-like progression, but frustrates learners who get stuck and insults those who
  already know a topic. Rejected for an audience that includes people with some prior
  knowledge.

## Consequences

### Positive

- Clear map and motivating sense of progress (milestones = belts).
- Showing later belts as "coming soon" communicates ambition and sets expectations.
- Respects learners with prior knowledge (free navigation).

### Negative / trade-offs

- More information architecture and UI work (belt map, progress along a path).
- "Coming soon" states must be handled gracefully so they do not feel broken.
