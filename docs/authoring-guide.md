# Authoring Guide — Lessons & Graded Exercises

How to write a lesson and an auto-graded exercise so they are consistent and the grader
works. Voice and philosophy live in `docs/mindset.md`. The decisions behind this format
are ADR-0003 (grading) and ADR-0009 (exercise format).

## Anatomy of a lesson

A lesson is prose (Markdown) plus structured exercises (TypeScript):

- **Theory** — the concept, explained for a beginner.
- **Runnable examples** — short snippets the learner can execute ("try this").
- **Exercises** — structured and auto-graded (see below).
- **Real-world notes** — the real-world lens (mindset principle 5).
- **Summary** — the key takeaways.

## The seed dataset

All exercises run against `seed/classic_company.sql`. Know its tables before writing
(customers, orders, employees, departments, products, and their relationships). Write
prompts that use this data concretely.

## The exercise contract

Each exercise is a typed TypeScript object, validated by a Zod schema at build time:

- `id` — stable, unique string.
- `prompt` — what to do, one concept, in the learner's words.
- `starterSql` — optional starting text in the editor.
- `expectedSql` — the reference solution. **Required.** This is exactly what was missing
  from the old `ejercicios.sql` files.
- `gradeMode` — `'result'` or `'state'`.
- `verificationSql` — required when `gradeMode` is `'state'`.
- `compareOptions` — `{ orderMatters, checkColumnNames, numericTolerance }`.

## Choosing the grade mode

- **`'result'`** — for reads (`SELECT`). The grader runs `expectedSql` and the learner's
  query and compares the returned rows.
- **`'state'`** — for mutations (`INSERT` / `UPDATE` / `DELETE`). The learner's statement
  runs in an isolated database; then `verificationSql` reads the resulting state, and the
  grader compares it to a reference run (where `expectedSql` is the reference mutation).

## compareOptions guidance

- `orderMatters` — `true` only when the prompt asks for a specific order (i.e. the answer
  requires `ORDER BY`). Otherwise `false`; do not punish a correct but unordered result.
- `checkColumnNames` — usually `false` for beginners (an alias difference is not wrong).
  Set `true` only when the exercise is specifically about naming or aliases.
- `numericTolerance` — PGlite returns `numeric`/`decimal`/`AVG`/division/money values
  as scaled strings (e.g. `"2.5000000000000000"`, `"2.50"`). With the default
  `numericTolerance: null` the grader uses strict `===`, so `"2.50"` and `"2.5"` are
  considered unequal — a silent false negative for a correct learner answer.
  **Any exercise whose result includes these types MUST set `numericTolerance`:**
  - Use `0` for exact-value exercises (scale-insensitive match, e.g. `COUNT`, `AVG`
    where both sides come from the same DB and only string scale differs).
  - Use a small epsilon (e.g. `0.001`) when floating-point rounding is possible.
  - `COUNT(*)`, `SUM`, plain `int`, and `bigint` come back as JS `number`, not string,
    so `null` is fine for pure integer results — but `0` is safe there too.
  **Never set `numericTolerance` on columns holding numeric-looking string codes**
  (zip codes, leading-zero IDs, phone numbers): tolerance coerces via `Number()`, so
  `"007"` and `"7"` become equal, producing a false positive.

## Writing a good prompt

- One concept per exercise. Do not stack ideas.
- Concrete and tied to the seed ("list customers from Spain"), not abstract ("use WHERE").
- State the expected shape when it matters ("ordered by salary, highest first").
- Beginner voice — see `docs/mindset.md`.

## "Lesson is done" checklist

A lesson is closed (mirrors `learning/WORKFLOW.md`'s definition of a finished topic) when:

- [ ] Theory is written for a beginner.
- [ ] Runnable examples execute cleanly against the seed.
- [ ] Every exercise has `expectedSql` and the correct `gradeMode`.
- [ ] Every `'state'` exercise has `verificationSql`.
- [ ] `compareOptions` reviewed for each exercise (order / aliases / tolerance).
- [ ] Real-world notes are present (the lens).
- [ ] Summary is present.
- [ ] Every exercise passes when graded against its own `expectedSql` (sanity check —
      the reference solution must satisfy its own grader).
