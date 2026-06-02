# Mindset — Teaching & Product Principles

The philosophy behind every lesson and product decision. When a choice is unclear,
decide in favor of these principles. This is the _why_ that keeps the product coherent
as it grows.

## 1. If you did not write SQL, it did not count

Hands-on first, always. Reading explains; writing teaches. Every concept ends with the
learner running real queries and seeing real results. Passive tutorials are exactly
what we are reacting against.

## 2. Real PostgreSQL, no lies

We run a real PostgreSQL engine (PGlite), never a simplified or fake SQL dialect. What
the learner practices is true to production. We never trade fidelity for convenience.

## 3. Concepts before syntax

We teach the mental model first — what a table is, how to think in sets, why a query
returns what it returns. Syntax memorized without understanding is fragile and forgotten.

## 4. Struggle is part of learning (anti-shortcut)

There is no "reveal solution" in v1. Productive struggle is how instinct forms. But our
learners are beginners: feedback must be specific and the path must be clear, so the
struggle stays _productive_, never blind. (The door stays open to add hints if real
frustration shows up in the data — see PRD NG5.)

## 5. Always the real-world lens

Every lesson answers more than syntax (this mirrors `learning/WORKFLOW.md`'s required focus):

- Is this used in real projects? When a lot, when not so much?
- What does it cost in performance?
- What breaks on a table with millions of rows, or with dirty data?
- What would you actually decide if this were a real app?

This is the difference between writing a tutorial and training an engineer.

## 6. Progress must be visible

The belt journey (Beginner -> Intermediate -> Advanced -> Ninja -> Insane) gives the
learner a map and momentum. Knowing how far you have come, and what mastery looks like,
is what keeps people going. Motivation is a feature, not decoration.

## 7. Honesty about tradeoffs

We teach that every decision sacrifices something — and we model it in our own ADRs,
which always state the negative consequences, not just the positive. No silver bullets,
no "best practice" without context.

## Voice

- **Audience:** a beginner who already programs a little. Do not teach what a variable
  or a loop is; do teach every database concept from zero.
- **Tone:** warm, direct, mentor energy. Explain the _why_. Never condescending.
- **Shape:** short and clear first; depth available on demand, not forced up front.
