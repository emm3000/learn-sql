# ADR-0004: Progress persistence in localStorage

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

Learners should resume where they left off (completed exercises, completed lessons,
last position) without friction. We have no backend (see ADR-0001) and collect no PII.

## Decision

Persist learner progress in the browser's `localStorage` as a small, versioned
key-value record. No accounts, no server.

## Alternatives considered

- **Accounts + server-side database.** Enables cross-device sync, but adds sign-up
  friction, a backend, authentication, and PII handling — contradicting ADR-0001 and
  the no-friction goal.
- **IndexedDB for progress.** Overkill for a small key-value payload. (IndexedDB is
  still used, separately, to cache the seeded PGlite database — a different concern.)
- **No persistence.** Simplest, but a poor experience: progress lost on every reload.

## Consequences

### Positive

- Zero friction: no sign-up, works immediately.
- No PII, no backend, fully static.

### Negative / trade-offs

- No cross-device sync; progress is per-browser.
- Progress is lost if the learner clears site data. Accepted for the MVP; accounts are
  an explicit future item.
