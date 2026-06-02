# Tasks — Postgres Playground MVP

Derived from `docs/prd.md` and `docs/adr/`. Each task references the requirement (FR/NFR)
or decision (ADR) it satisfies, so work stays traceable. If a task does not trace to a
requirement, it does not belong here.

## How to read this

- Two tracks: 🔧 **Engineering** and ✍️ **Content**. They are interleaved by dependency,
  not done in two separate phases.
- Ordering is **risk-first**: build and test the hardest, highest-uncertainty pieces
  (PGlite engine, grading) before the easy chrome. Then prove the whole stack with one
  lesson end-to-end (vertical slice) before scaling.
- A milestone is done only when its **Definition of done** is met.

## Dependency flow

```text
M0 scaffold
   └─> M1 PGlite engine ──> M2 grading engine ──┐
   └─> M3 playground island (needs M1) ─────────┴─> M4 vertical slice (Lesson 01)
                                                      └─> M5 belt framework
                                                            └─> M6 lessons 02 + 03
                                                                  └─> M7 hardening + deploy
```

---

## M0 — Project scaffold & foundations 🔧

Goal: a running Astro project with the content pipeline and shared schemas in place.

- [x] M0.1 Scaffold an Astro project (TypeScript, strict) — ADR-0006
- [x] M0.2 Add the Svelte integration for islands — ADR-0007
- [x] M0.3 Configure Content Collections for lessons (prose) with a Zod schema — ADR-0006
- [x] M0.4 Define the exercise schema in Zod/TS: `id`, `prompt`, `starterSql`,
      `expectedSql`, `gradeMode` (`result` | `state`), `verificationSql`,
      `compareOptions` (`orderMatters`, `checkColumnNames`, `numericTolerance`) — ADR-0009
- [x] M0.5 Tooling: markdownlint, formatter/linter, a unit-test runner (for the grading engine)
- [x] M0.6 Make `seed/classic_company.sql` importable by the app as a string/asset

Definition of done: `npm run dev` serves a blank Astro site; a sample lesson and a sample
exercise validate against their schemas at build time.

---

## M1 — PGlite engine 🔧 (highest risk — do early)

Goal: run real PostgreSQL in the browser, off the main thread, with a clean API.

- [x] M1.1 Add `@electric-sql/pglite`; run it inside a **Web Worker** — ADR-0001, NFR-2
- [x] M1.2 Worker API: init a per-lesson database, run SQL, return rows/columns or a
      readable error — FR-4, FR-5
- [x] M1.3 Seed a lesson database from `classic_company.sql`
- [x] M1.4 Reset: re-seed the lesson database to its initial state — FR-9
- [x] M1.5 Lazy-load the WASM payload only on lesson pages, never on map/landing — NFR-3
- [ ] M1.6 (Optional, deferred) Cache the seeded database in IndexedDB for fast repeat visits — NFR-5

Definition of done: from a test harness, init + seed + run a `SELECT` and a mutation, get
correct results, and reset back to seed — all in a worker, with the UI thread free.

---

## M2 — Grading engine 🔧 (the core value)

Goal: objective auto-grading for both exercise kinds, with fair comparison. Headless,
unit-tested — no UI needed yet. ADR-0003.

- [x] M2.1 Result-set comparison: compare rows + columns honoring `compareOptions`
      (`orderMatters`, `checkColumnNames`, `numericTolerance`) — FR-8
- [x] M2.2 Result-based grading: run `expectedSql` and the learner query, compare — FR-6
- [x] M2.3 State-based grading: run the learner mutation in an **isolated** DB, run
      `verificationSql`, compare to a reference run of `expectedSql` — FR-7
- [x] M2.4 Specific failure messages (what differs: missing/extra rows, wrong column,
      wrong order) — FR-6
- [x] M2.5 Unit tests for fairness edge cases: row order, column aliases, floats, empty
      results, learner query errors

Definition of done: a suite of fixture exercises grades correctly, including deliberate
near-miss cases; no false negatives on alias/order differences when options allow them.

---

## M3 — SQL Playground island 🔧 (Svelte + CodeMirror)

Goal: the interactive widget. ADR-0007, ADR-0008.

- [x] M3.1 CodeMirror 6 editor with SQL/PostgreSQL syntax highlighting — ADR-0008
- [x] M3.2 Run button → worker (M1) → results table — FR-3, FR-4
- [x] M3.3 Readable error panel on failed queries (no page crash) — FR-5
- [x] M3.4 Reset-database button — FR-9
- [x] M3.5 Grade button wired to the grading engine (M2): pass/fail + specific reason — FR-6

Definition of done: a standalone page mounts the island, runs arbitrary SQL against the
seed, shows results/errors, resets, and grades a hard-coded exercise.

---

## M4 — Vertical slice: Lesson 01 SELECT 🔧✍️ (prove the whole stack)

Goal: one Beginner lesson fully working end-to-end. This validates the entire
architecture (PRD G4, G5) before we build anything else.

- [x] M4.1 ✍️ Author Lesson 01 prose: theory, runnable examples, real-world notes, summary
      — `docs/authoring-guide.md`, `docs/mindset.md`
- [x] M4.2 ✍️ Author Lesson 01 exercises with `expectedSql` (result-based) — authoring-guide
- [x] M4.3 🔧 Lesson page (Astro) rendering prose + embedded playground + exercise list
- [x] M4.4 🔧 Per-lesson, per-exercise progress in `localStorage`; restore on return — FR-10
- [x] M4.5 ✍️🔧 Verify every exercise passes when graded against its own `expectedSql`
      (authoring checklist sanity check)

Definition of done: a learner opens Lesson 01, reads, runs SQL, solves auto-graded
exercises, and returns later to find progress restored.

---

## M5 — Belt framework & navigation 🔧

Goal: the journey UI around the lessons. ADR-0005.

- [x] M5.1 Belt map as the main navigation: 5 belts, Beginner active, others "coming soon"
      — FR-1, NG8
- [x] M5.2 Navigation between belts, lessons, and exercises — FR-11
- [x] M5.3 Progress shown along the belt path — FR-11
- [x] M5.4 Soft gating: recommended order, free navigation within the active belt — FR-12

Definition of done: from the belt map, a learner reaches Lesson 01, sees progress on the
path, and later belts read clearly as "coming soon".

---

## M6 — Complete the Beginner lessons 🔧✍️ (scale content)

Goal: the remaining two MVP lessons, which also exercise state-based grading at scale.

- [x] M6.1 ✍️ Author Lesson 02 INSERT: prose + exercises (`gradeMode: state`,
      with `verificationSql`) — authoring-guide
- [x] M6.2 ✍️ Author Lesson 03 UPDATE/DELETE: prose + exercises (state-based; emphasize the
      `WHERE` safety lesson) — authoring-guide
- [x] M6.3 🔧 Confirm state-based grading (M2.3) holds up across all authored exercises
- [x] M6.4 ✍️🔧 Run the authoring "done" checklist for lessons 02 and 03

Definition of done: all three Beginner lessons are complete, auto-graded, and pass their
own reference solutions.

---

## M7 — Public-product hardening & deploy 🔧

Goal: ship it as a real public product. NFRs.

- [ ] M7.1 SEO: static rendering + meta tags for belt map and lessons — NFR-7
- [ ] M7.2 Accessibility pass: keyboard nav, contrast, semantic HTML (target WCAG 2.1 AA)
      — NFR-6
- [ ] M7.3 Performance: confirm lazy-load and time-to-first-query target — NFR-3, NFR-4
- [ ] M7.4 Responsive: readable on mobile; editor best-effort — NFR-10
- [ ] M7.5 Unsupported-browser message (no WASM / no Web Worker) — NFR-9
- [ ] M7.6 Cookieless analytics for the success metrics — NFR-11
- [ ] M7.7 Deploy to the chosen static host
- [ ] M7.8 End-to-end smoke test (Playwright): in a real browser, load Lesson 01, run a
      query against PGlite, and assert results render — the safety net proving the M1–M6
      pieces work together. Gates deploy (M7.7).

Definition of done: the MVP is live, crawlable, accessible, fast, and reporting the
PRD success metrics; the e2e smoke test passes in CI before deploy.

---

## Open decisions (unblock as needed)

These are PRD open questions. They block specific tasks; resolve before that task runs.

- [ ] Product name — blocks branding/meta (M7.1). PRD Q1
- [ ] Analytics tool — blocks M7.6. PRD Q2
- [ ] Deploy target (Vercel / Netlify / Cloudflare Pages / GitHub Pages) — blocks M7.7. PRD Q3
- [ ] Numeric targets for NFR-4 and the success metrics — blocks M7.3 acceptance. PRD Q4
