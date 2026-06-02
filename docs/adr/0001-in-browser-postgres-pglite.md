# ADR-0001: In-browser PostgreSQL with PGlite (WASM)

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

The product's core principle is hands-on: _if you did not write SQL, it did not
count._ Learners must execute real SQL and see real results, ideally with zero setup
and no account.

We need a place to run their queries. The options differ enormously in cost,
fidelity, and operational burden.

## Decision

Run a real PostgreSQL engine entirely in the browser using **PGlite** (PostgreSQL
compiled to WebAssembly by ElectricSQL).

Supporting choices, part of this decision:

- PGlite runs inside a **Web Worker**, so query execution never blocks the UI thread.
- The WASM payload is **lazy-loaded** only on lesson pages, never on the landing or
  belt-map pages.
- The seeded database MAY be **cached in IndexedDB** so repeat visits skip re-seeding.
- Each learner gets their own in-memory database (a private sandbox). Resetting is
  re-running the seed.

## Alternatives considered

- **Hosted PostgreSQL backend.** Real fidelity, but introduces a server, hosting cost,
  authentication, and a shared mutable database that learners could corrupt for each
  other. Breaks the "no backend, static deploy" goal.
- **sql.js (SQLite in WASM).** Mature, but it is SQLite, not PostgreSQL. It would lie
  about dialect, types, and behavior — unacceptable for a product that teaches
  PostgreSQL specifically.
- **A hand-written JS SQL interpreter.** Full control, but it would be incorrect,
  incomplete, and a maintenance sinkhole. It would teach a fiction.

## Consequences

### Positive

- Real PostgreSQL behavior and dialect — what learners practice is true.
- No backend: free, simple static deployment; no auth; no PII.
- Per-learner sandbox: breaking the database affects no one else.
- Works offline once loaded.

### Negative / trade-offs

- The WASM payload is several megabytes; mitigated by lazy-loading, the worker, and
  IndexedDB caching, and by never loading it on non-lesson pages.
- Limited to the feature set PGlite supports; some advanced server features (e.g.
  replication, multi-connection concurrency) cannot be demonstrated client-side. These
  belong to later belts and may need a different approach when we get there.
