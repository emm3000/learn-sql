# Orchestration — How we build with agents

How this project is built using multiple agents. The orchestrator (the main Claude
session) delegates scoped work to sub-agents and verifies their output before
integrating it. This document is the convention any session must follow when doing
implementation work.

## Roles

- **Orchestrator / architect** (the main session). Holds a thin conversation thread.
  Reads `docs/prd.md`, `docs/adr/`, `docs/tasks.md`. Decides what to delegate, scopes
  each task, writes the sub-agent prompt, assigns the model, reviews results, and
  integrates/commits. Does NOT do heavy implementation inline.
- **Writer agents.** Fresh-context sub-agents that implement one scoped task (code or
  content) and return a summary of what changed.
- **Reviewer agents.** Fresh-context sub-agents that independently double-check a
  writer's output before it is accepted. Never the same agent that wrote it.

## The delegation loop (per task)

1. **Scope** — the orchestrator picks a task from `docs/tasks.md`, gathers the context
   the writer needs (relevant ADRs, the Zod schema, file paths), and writes a precise
   prompt. Assigns the model.
2. **Write** — a writer agent implements and returns: what changed, files touched,
   decisions made, open questions.
3. **Review** — a fresh reviewer agent double-checks: correctness, adherence to the
   ADRs and `docs/mindset.md`, edge cases, lint/tests.
4. **Integrate** — the orchestrator synthesizes, decides accept or fix, integrates, and
   commits. A rejected review loops back to step 2.

## When to delegate vs do inline

- **Inline** (orchestrator does it): reading 1–3 files to decide or verify, atomic
  single-file mechanical edits, git/state commands.
- **Delegate**: understanding that needs 4+ files, writes touching 2+ non-trivial
  files, anything that reads-then-writes, running tests/builds.

Rule of thumb: *does this inflate my context without need?* If yes, delegate.

## Parallelism & worktrees

- **Default is sequential.** Most of `docs/tasks.md` (M0→M1→M2→M4→M5) is a dependency
  chain — one writer at a time, then review.
- **Parallel agents** are used only when tasks are independent AND touch **different
  files** (e.g. authoring lessons 02 and 03 in M6). Different files means no conflict,
  so plain parallel agents work — **no worktree needed**.
- **Worktree isolation** (`isolation: "worktree"`) is the EXCEPTION, not the default.
  It is expensive (disk + setup per agent) and is justified ONLY when parallel agents
  must mutate the **same files** and would otherwise conflict.
- When parallel writers would touch a shared file (e.g. the Content Collections config
  or the grading engine), prefer to **serialize that edit** rather than spin up
  worktrees.

## Review & double-check policy

- Every delegated code or content change gets a **fresh-context review** before it is
  integrated.
- **High-risk work gets adversarial dual review** (two independent reviewers, e.g. the
  `judgment-day` protocol) before acceptance. In this project the grading engine (M2)
  is the prime example — it is the core value and the easiest place to be subtly wrong.
- The reviewer is always independent context, never the writer.
- Trivial docs/text edits may skip formal review.

## Model assignment

- Architectural / high-risk design decisions → **Opus**.
- Writers (implementation, content authoring) → **Sonnet**.
- Reviewers → **Sonnet**; **Opus** for the riskiest reviews (e.g. grading correctness).

(Mirrors the model table in the global agent configuration. Every Agent call states its
model.)

## Mapping to the MVP (docs/tasks.md)

- **M0–M5** — sequential: single writer + one fresh review per task.
- **M2 (grading engine)** — paranoia mode: adversarial dual review, with unit tests for
  fairness edge cases (row order, aliases, floats).
- **M6 (content)** — parallel writers for lessons 02 and 03 (different folders, no
  worktree).
- **M7 (hardening)** — one delegation per NFR (SEO, a11y, perf), each reviewed.

## Context handoff

- Sub-agents start fresh with NO memory. The orchestrator passes all needed context in
  the prompt (ADR references, the exercise schema, file paths) — never assumes the
  agent can recall prior sessions.
- Writers return a structured summary (what changed, files, decisions, open questions).
- Significant discoveries, decisions, or fixes are saved to persistent memory by the
  orchestrator after integration.

## Definition of "accepted"

A delegated task is accepted only when: the review passed, the work traces to its
`docs/tasks.md` item and the requirement behind it, and lint/tests are clean.
