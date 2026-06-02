# PRD — Postgres Playground (working title)

> Status: v0.3 — core decisions locked; only cosmetic opens remain (name, analytics,
> deploy target, numeric targets)
>
> Owner: Edgardo Munoz
>
> Last updated: 2026-06-02
>
> This document describes the product VISION and the MVP scope within it. Items
> marked `[ASSUMPTION]` are decisions made with engineering judgment that need
> product owner confirmation. Items marked `[OPEN]` are unresolved questions.

---

## 1. Overview

An interactive, browser-based journey for learning PostgreSQL by writing real SQL.
A real PostgreSQL engine runs entirely in the browser (WebAssembly), so learners
execute queries against a seeded database, get instant auto-graded feedback, and
break things safely — with no account, no server, and no setup.

The learning path is structured as a series of skill **belts**, from absolute
beginner to production-grade expert, giving learners a clear map and a strong sense
of progress. The product is also built, deliberately, as a reference example of
disciplined software engineering (documented decisions, clean architecture), since
its audience is people learning to build software.

---

## 2. Problem statement

People learning SQL today face a false choice:

- **Read-only tutorials** explain syntax but never make you write SQL. You finish
  feeling like you "get it" and then freeze in front of a real database.
- **Hosted sandboxes** require sign-up, share a fragile mutable database, or run a
  fake SQL dialect that lies about how PostgreSQL actually behaves.

On top of that, most resources are a flat pile of topics with no sense of journey —
the learner never knows how far they have come or what mastery looks like.

The result: learners memorize syntax instead of building instinct, and quit before
they feel competent. The guiding principle of this product is the opposite — _if you
did not write SQL, it did not count_ — wrapped in a path that makes progress visible.

---

## 3. Target users

### Primary persona — "The programming beginner"

Knows how to program a little (understands a variable, a loop, basic logic) but has
never written SQL or worked with databases. Wants to learn PostgreSQL from zero,
hands-on, without installing anything.

Implications:

- No need to teach general programming concepts.
- Must teach every database concept from scratch (what a table is, what a row is, how
  to think in sets).
- Needs balanced scaffolding: enough guidance to not get stuck, enough challenge to
  actually learn.

### Secondary personas

- **Absolute beginner (no code):** can still use it but may need more conceptual
  framing than the MVP provides.
- **Developer with basic SQL:** wants to go deeper (performance, advanced features).
  Served by the Advanced / Ninja / Insane belts, not the MVP.

---

## 4. Goals

- G1. Let a learner execute real PostgreSQL in the browser within seconds, no setup.
- G2. Make every exercise auto-graded with instant, specific feedback.
- G3. Present the full learning journey as a motivating belt-based progression.
- G4. Deliver the belt framework + the first 3 Beginner lessons, genuinely complete
  and polished — not many half-done lessons.
- G5. Prove the full architecture end-to-end (content -> editor -> PGlite -> grading
  -> progress -> belt progression) so adding lessons is mechanical.
- G6. Stand as a clean, well-documented engineering reference (PRD, ADRs, tasks).

---

## 5. Non-goals (for the MVP)

- NG1. No user accounts, login, or server-side persistence.
- NG2. No backend or hosted database.
- NG3. No multi-course / multi-topic platform abstraction (PostgreSQL only).
- NG4. No social features (comments, sharing progress, leaderboards).
- NG5. No "reveal solution" or hint system in v1 (anti-shortcut by design; schema
  stays open to add it later if real frustration appears).
- NG6. No multi-language UI (English only for the MVP).
- NG7. No mobile-optimized SQL editing (read-friendly on mobile is enough).
- NG8. No full content for belts beyond Beginner (shown as "coming soon").

---

## 6. Product structure — the belt system

The journey is organized into five belts. Each belt groups several lessons; each
lesson contains theory, runnable examples, and auto-graded exercises. Belts map
directly onto the master roadmap phases (see `learning/ROADMAP_POSTGRES.md`).

### 🟢 Belt 1 — Beginner — "Write SQL without fear"

- Setup and first contact with `psql`
- SQL base: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, filters, `DISTINCT`, `NULL`,
  `ORDER BY`, `LIMIT`
- Data types, text and dates

### 🔵 Belt 2 — Intermediate — "Answer questions with data"

- Relationships and joins
- Aggregation and analytics, including window functions
- Subqueries, CTEs, recursion and `LATERAL`

### 🟣 Belt 3 — Advanced — "Design and give logic to the database"

- Modeling, normalization and integrity
- Functions and procedures
- Views, materialized views and triggers
- Transactions, MVCC and concurrency

### 🔴 Belt 4 — Ninja — "Make it fly"

- Indexes and access structures
- Performance, `EXPLAIN` and the planner
- Advanced features (JSONB, full-text search, partitioning)

### ⚫ Belt 5 — Insane — "Run it in production"

- Security, roles and RLS
- Migrations and schema evolution
- Application integration
- Operations and administration
- Real-world capstone projects

> Belt names (CONFIRMED): Beginner / Intermediate / Advanced / Ninja / Insane.
> Spanish origin from the user: Principiante / Medio / Avanzado / Ninja / Enfermo.

---

## 7. MVP scope

The MVP delivers the **belt framework** plus the **first three Beginner lessons**,
fully playable and auto-graded. The rest of the journey is visible in the UI as
"coming soon" — this communicates the full vision without requiring all content.

### Belt framework (in MVP)

- The five-belt path is rendered as the product's main map.
- Beginner is active; later belts are visible but locked / "coming soon".
- Progress is tracked and shown along the path.

### Lessons included (CONFIRMED)

Three foundational Beginner lessons chosen to (a) be the natural beginner CRUD arc
and (b) exercise BOTH auto-grading strategies, which de-risks the hardest part of the
architecture:

1. **01 — SELECT** (result-based grading: compare the rows the query returns)
2. **02 — INSERT** (state-based grading: run student SQL, then verify table state)
3. **03 — UPDATE / DELETE** (state-based grading, plus the safety lesson of `WHERE`)

Rationale: if grading works for both "did your query return the right rows" and "did
your statement leave the database in the right state," every other lesson is a content
problem, not an engineering problem.

### Per-lesson content model

Each lesson renders:

- **Theory** (prose) — the concept, explained for a beginner.
- **Runnable examples** — snippets the learner can execute.
- **Exercises** — structured: prompt + starter SQL + expected solution + grading
  config. Auto-graded.
- **Real-world notes** and **summary** (prose).

> Content gap to resolve: exercise _solutions_ do not exist yet in the repo. They must
> be authored (in English) for these 3 lessons. This is content work, tracked
> separately from engineering work.

### Features in scope

- F-IN-1. Render the belt map as the product's main navigation.
- F-IN-2. Browse and read lessons (static, fast).
- F-IN-3. SQL editor with syntax highlighting.
- F-IN-4. Execute arbitrary SQL against a per-lesson in-browser PostgreSQL.
- F-IN-5. Results table + readable error messages.
- F-IN-6. Auto-grade exercises (result-based and state-based) with specific feedback.
- F-IN-7. Reset the lesson database to its seeded state.
- F-IN-8. Persist progress (completed exercises, lessons, position) in `localStorage`.

---

## 8. Functional requirements

- FR-1. The system SHALL render the five-belt path as the main map, marking Beginner
  active and later belts as locked / "coming soon".
- FR-2. The system SHALL render each lesson's prose from structured content.
- FR-3. The system SHALL provide a SQL editor with PostgreSQL syntax highlighting.
- FR-4. The system SHALL execute the learner's SQL against an in-browser PostgreSQL
  (PGlite) and display the returned rows.
- FR-5. The system SHALL display PostgreSQL error messages in a readable form when a
  query fails, without crashing the page.
- FR-6. For result-based exercises, the system SHALL compare the learner's result set
  against the expected result set and report pass/fail with a specific reason on fail.
- FR-7. For state-based exercises, the system SHALL run the learner's statement in an
  isolated database, run a verification query, compare it to a reference run, and
  report pass/fail.
- FR-8. Result comparison SHALL support per-exercise options: whether row order
  matters, whether column names must match, and numeric tolerance.
- FR-9. The system SHALL let the learner reset the lesson database to its seeded state.
- FR-10. The system SHALL persist completed-exercise and completed-lesson state and
  last position locally, and restore it on return.
- FR-11. The system SHALL let the learner navigate between belts, lessons, and
  exercises, and SHALL reflect completion progress along the belt path.
- FR-12. Progression gating between lessons SHALL be soft (recommended order, not hard
  locked) so learners can move freely within an active belt.

---

## 9. Non-functional requirements `[engineering judgment]`

- NFR-1 (Architecture). Fully static deployment; no backend, no server-side DB.
- NFR-2 (Concurrency). PGlite SHALL run in a Web Worker so query execution never
  freezes the UI.
- NFR-3 (Performance — load). The WASM/PGlite payload SHALL be lazy-loaded only on
  lesson pages, never on the landing/belt-map pages. Those SHALL be near-instant.
- NFR-4 (Performance — interactivity). Time-to-first-runnable-query on a lesson page
  SHALL target under ~3s on a typical broadband connection. `[ASSUMPTION: target]`
- NFR-5 (Caching). The seeded database MAY be persisted to IndexedDB so repeat visits
  to a lesson skip re-seeding.
- NFR-6 (Accessibility). Keyboard-navigable, sufficient color contrast, semantic HTML;
  target WCAG 2.1 AA for prose and navigation. `[ASSUMPTION: AA target]`
- NFR-7 (SEO). Lessons and the belt map SHALL be statically rendered with proper meta
  tags and be crawlable (public product).
- NFR-8 (Privacy). No PII collected. Progress lives only in the learner's browser.
- NFR-9 (Browser support). Modern evergreen browsers with WASM + Web Worker support.
  A clear unsupported-browser message otherwise. `[ASSUMPTION]`
- NFR-10 (Responsive). Desktop-first. Mobile MUST be readable; SQL editing on mobile is
  best-effort.
- NFR-11 (Analytics). Privacy-respecting, cookieless analytics for success metrics.
  `[OPEN: which tool]`

---

## 10. Success metrics

- M1 (Activation). % of lesson visitors who run at least one query.
- M2 (Core value). % of started exercises that reach a passing auto-grade.
- M3 (Engagement). % of learners who complete all exercises in a lesson.
- M4 (Progression). % of learners who complete the Beginner belt's available lessons.
- M5 (Reliability). Median query execution time; rate of unexpected runtime errors.
- M6 (Return). % of returning learners (via local progress / cookieless analytics).

> Targets to be set after a baseline. `[OPEN]`

---

## 11. Assumptions

- A1. Learners have a modern desktop browser for the hands-on parts.
- A2. Authoring 3 lessons' worth of content + exercise solutions in English is
  acceptable MVP effort (solutions must be written from scratch regardless of language).
- A3. The existing `seed/classic_company.sql` is a suitable dataset for these lessons.
- A4. Anonymous local progress is enough; no cross-device sync needed in v1.
- A5. Showing later belts as "coming soon" is acceptable (sets expectations, shows
  ambition).

---

## 12. Risks

- R1 (Content). Exercise solutions do not exist yet; the MVP is blocked on authoring
  them. Mitigation: scope to 3 lessons, treat authoring as first-class work.
- R2 (Market). English "SQL for beginners" is a crowded space. Differentiator MUST be
  real in-browser PostgreSQL + instant auto-grading + the belt journey, not "another
  tutorial."
- R3 (Grading fairness). Row/column ordering and aliases cause most false negatives.
  Mitigation: per-exercise comparison options (FR-8) and clear failure messages.
- R4 (Bundle size). PGlite WASM is several MB. Mitigation: lazy-load + worker + cache.
- R5 (Mobile). SQL editing on mobile is poor. Accepted for MVP (NFR-10).
- R6 (Scope creep). The belt vision is large and tempting. Mitigation: the MVP is the
  framework plus three Beginner lessons only; everything else is "coming soon."

---

## 13. Out of scope / future

- Full content for Intermediate, Advanced, Ninja and Insane belts.
- Remaining Beginner lessons beyond the first three.
- Hints / reveal-solution (schema stays ready for it).
- Accounts + cross-device progress sync.
- Spanish or bilingual content.
- Multi-course platform.
- Gamification beyond belts (badges, streaks, XP).

---

## 14. Open questions

- Q1. Product name. `[DEFERRED]` — placeholder "Postgres Playground" until M7.1.

### Resolved

- Q2. Analytics tool → Cloudflare Web Analytics (cookieless, free, zero-config; pairs
  with Cloudflare Pages). NFR-11.
- Q3. Deploy target → Cloudflare Pages (static, global CDN; PGlite confirmed to run
  without cross-origin isolation, so no special headers required).
- Q4. Numeric targets → time-to-first-runnable-query < ~3s on broadband + Lighthouse
  Performance ≥ 90; success-metric percentages set post-launch from a baseline.
- Belt names: Beginner / Intermediate / Advanced / Ninja / Insane.
- MVP lessons: 01-SELECT, 02-INSERT, 03-UPDATE/DELETE.
- Progression: soft gating (recommended order, free navigation).
