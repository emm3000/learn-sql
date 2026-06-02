# Architecture Decision Records (ADR)

This folder records the significant architectural decisions for the Postgres
Playground project. Each ADR captures one decision: its context, the decision
itself, the alternatives considered, and the consequences (both good and bad).

## Why ADRs

A decision without its reasoning is just an opinion waiting to be questioned again.
ADRs preserve the _why_, so future contributors (including future us) understand the
trade-offs instead of re-litigating them.

## Format

Each record follows a lightweight MADR / Nygard structure:

- **Status** — Proposed | Accepted | Superseded | Deprecated
- **Context** — the forces at play, the problem to solve
- **Decision** — what we chose
- **Alternatives considered** — what we rejected and why
- **Consequences** — the results, including the trade-offs we accept

## Index

| ADR                                            | Title                                    | Status   |
| ---------------------------------------------- | ---------------------------------------- | -------- |
| [0001](0001-in-browser-postgres-pglite.md)     | In-browser PostgreSQL with PGlite (WASM) | Accepted |
| [0002](0002-single-topic-scope.md)             | Single-topic scope (PostgreSQL only)     | Accepted |
| [0003](0003-auto-grading-result-comparison.md) | Auto-grading by result-set comparison    | Accepted |
| [0004](0004-progress-in-localstorage.md)       | Progress persistence in localStorage     | Accepted |
| [0005](0005-belt-based-progression.md)         | Belt-based progression with soft gating  | Accepted |
| [0006](0006-astro-content-collections.md)      | Astro + Content Collections              | Accepted |
| [0007](0007-svelte-interactive-island.md)      | Svelte for the interactive island        | Accepted |
| [0008](0008-codemirror-sql-editor.md)          | CodeMirror 6 for the SQL editor          | Accepted |
| [0009](0009-typed-exercise-definitions.md)     | Typed TS + Zod exercise definitions      | Accepted |
