# ADR-0009: Typed TS + Zod exercise definitions

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

Today the repo's `ejercicios.sql` files are just comments with prompts — no solutions,
no structure. Auto-grading (ADR-0003) needs structured data per exercise: a prompt,
starter SQL, the expected solution, the grading mode, and comparison options. The prose
parts of a lesson remain Markdown, but exercises are data, not prose.

## Decision

Define exercises as **typed TypeScript modules** validated against a **Zod schema**,
co-located with each lesson and shared with the Astro Content Collections layer
(ADR-0006). The schema encodes: `id`, `prompt`, `starterSql`, `expectedSql`,
`gradeMode` (result | state), an optional `verificationSql` for state-based exercises,
and `compareOptions` (row order, column names, numeric tolerance).

## Alternatives considered

- **Annotated `.sql` files.** Keep plain SQL with special comment markers. Brittle
  custom parsing, no type safety, easy to get subtly wrong.
- **JSON.** Data-friendly but no type safety, no comments, and awkward for multi-line
  SQL.
- **MDX.** Mixes prose and data; harder to validate the grading config and to keep
  exercise data clean and separate from narrative.

## Consequences

### Positive

- Type safety and IDE autocomplete when authoring exercises.
- Build-time validation: a malformed exercise fails the build, not the learner.
- Multi-line SQL via template literals; grading config lives next to the SQL.

### Negative / trade-offs

- Authors write TypeScript, not plain `.sql` files. Acceptable: authoring is controlled
  by us, and the structure is simple and well-documented.
- A defined leap from the current plain-`.sql` lesson format; existing prompts must be
  migrated into the new shape (part of content authoring).
