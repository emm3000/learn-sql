# ADR-0003: Auto-grading by result-set comparison

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

Exercises need instant, objective feedback. Because PGlite runs a real PostgreSQL in
the browser, we can execute both the learner's query and a reference solution and
compare outcomes — no backend, no human, no guesswork.

There are two fundamentally different kinds of exercise: those that *read* data and
those that *change* it.

## Decision

Grade exercises by comparing outcomes, in two modes:

- **Result-based** (for `SELECT`): run the learner's query and the expected query;
  compare the returned result sets.
- **State-based** (for `INSERT` / `UPDATE` / `DELETE`): run the learner's statement in
  an isolated database, then run a verification query, and compare it to a reference
  run on a clean seeded database.

Comparison supports per-exercise options (see FR-8): whether row order matters, whether
column names must match, and numeric tolerance.

## Alternatives considered

- **String-matching the SQL text.** Brittle and wrong: many different correct queries
  return the same result. Punishes valid creativity.
- **Manual self-check (reveal solution, compare by eye).** No real feedback; relies on
  the learner grading themselves. Betrays the "instant feedback" goal.
- **LLM-based grading.** Requires a backend/API, costs money per submission, and is
  non-deterministic — unacceptable for objective, offline grading.

## Consequences

### Positive

- Objective, instant, dialect-correct feedback.
- Teaches by outcome (did you get the right answer) rather than by syntax conformity.
- Fully client-side; no backend.

### Negative / trade-offs

- Every exercise needs an authored expected solution (content work; tracked separately).
- Grading fairness requires care: row/column ordering and aliases cause most false
  negatives. Mitigated by per-exercise comparison options and clear failure messages.
- State-based grading requires an isolated database per grade run to avoid one exercise
  contaminating another.
