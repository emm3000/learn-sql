# ADR-0002: Single-topic scope (PostgreSQL only)

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

The audience is broad ("new engineers, students, anyone who wants to learn"). That
phrasing tempts a generic, multi-course platform where PostgreSQL is just the first
subject. But today there is exactly one subject.

## Decision

Build a PostgreSQL-only product. Do not introduce a "course" or "topic" abstraction.
The data model, routing, and UI are tailored to teaching PostgreSQL.

## Alternatives considered

- **Generic multi-course platform from day one.** More flexible, but it forces
  abstraction before we understand a second subject's needs. Higher complexity, slower
  delivery, and a real risk of designing the wrong abstraction (premature
  generalization).

## Consequences

### Positive

- Simpler content model and UI, tailored to SQL (editor, grading, belts).
- Faster to build and easier to polish.

### Negative / trade-offs

- If we later add another subject, a refactor is required. We accept this: refactoring
  with real knowledge of a second subject beats guessing its shape now. (YAGNI.)
