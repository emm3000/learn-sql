# Design Blueprint — pgGym

> A handoff document for the visual/UX designer.
> Source of truth for product decisions: `docs/prd.md`. This file translates those
> decisions into what you need to design — brand, voice, screens, and the few visual
> tokens already locked in code. Nothing here invents requirements; it organizes them.

---

## 1. What pgGym is, in one breath

An interactive, browser-based course where people learn **PostgreSQL by writing real
SQL** — against a real PostgreSQL engine running inside the browser. No account, no
server, no setup. You open a lesson, write a query, run it, and get instant
auto-graded feedback.

The guiding promise: **"If you did not write SQL, it did not count."**

The journey is a **belt system** (like martial arts) — five belts from absolute
beginner to production expert — so the learner always sees how far they've come and
what mastery looks like.

> Current scope (MVP): the belt map + the first three Beginner lessons, fully playable.
> Later belts are visible but marked **"coming soon"**. Design must communicate the
> _full_ ambition while only three lessons are real.

---

## 2. Who it's for

**Primary user — "the programming beginner."** Knows a little code (variables, loops,
basic logic) but has never written SQL or touched a database. Wants to go from zero to
confident, hands-on, without installing anything.

What this means for design:

- Not a child, not an expert. Treat them as a capable adult learning a new craft.
- They will feel intimidated by a blank SQL editor. The UI's job is to make writing
  that first query feel **safe and inviting**, not like an exam.
- Desktop-first (that's where people write SQL). Mobile must be **readable**, but SQL
  editing on mobile is best-effort, not a priority.

---

## 3. Voice & personality (the feeling to design for)

The product's tone is **warm, direct, mentor energy** — never condescending, never
cutesy. A senior engineer who genuinely wants you to get it, explains the _why_, and
respects your time.

Five feelings the visual design should carry:

| Principle                  | What it means visually                                                                |
| -------------------------- | ------------------------------------------------------------------------------------- |
| **Hands-on first**         | The editor and "Run" action are the hero, not an afterthought.                        |
| **Real, no lies**          | Feels like a real, credible dev tool — not a gamified toy.                            |
| **Concepts before syntax** | Theory reads cleanly; generous typography, calm layout.                               |
| **Productive struggle**    | No "reveal solution." Failure feedback is supportive and _specific_, never punishing. |
| **Progress is visible**    | The belt journey is motivating and always within reach.                               |

Avoid: childish gamification (confetti everywhere, cartoon mascots), generic
"bootcamp" gradients, anything that reads as a fake/simplified sandbox. This should
feel like a serious tool that happens to be welcoming.

---

## 4. The belt system (core brand motif)

Five belts, in order. The belt is the central navigation metaphor **and** the
progress system. Belt names and accent colors are **already locked in code**
(`src/lib/belts.ts`) — please design _with_ these, not around them.

| #   | Belt            | Tagline                                 | Accent (hex) | Status in MVP      |
| --- | --------------- | --------------------------------------- | ------------ | ------------------ |
| 1   | 🟢 Beginner     | "Write SQL without fear"                | `#16a34a`    | **Active**         |
| 2   | 🔵 Intermediate | "Answer questions with data"            | `#2563eb`    | Active (framework) |
| 3   | 🟣 Advanced     | "Design and give logic to the database" | `#7c3aed`    | Coming soon        |
| 4   | 🔴 Ninja        | "Make it fly"                           | `#dc2626`    | Coming soon        |
| 5   | ⚫ Insane       | "Run it in production"                  | `#111827`    | Coming soon        |

Design opportunities here:

- How does a belt **look** as a unit on the map? How do "active," "in progress,"
  "completed," and "locked / coming soon" read at a glance?
- How does completion progress show _along the path_ (a learner's position, % done)?
- The belt colors can drive a per-belt accent theme as the learner moves through.

---

## 5. Screens to design

There are three core screen types. Everything else is a variation.

### 5.1 Landing / Belt Map (the home)

The product's main map and primary navigation. Must:

- Render the five-belt path as a clear, motivating journey.
- Show Beginner as active, later belts as locked / "coming soon."
- Reflect the learner's progress along the path.
- Be **near-instant** to load (no heavy assets here — see §7).

This is the first impression and the "wow, look how far this goes" moment. It carries
the brand.

### 5.2 Lesson page

A single lesson. Structure (content model is fixed by the product):

- **Theory** — prose explaining the concept for a beginner.
- **Runnable examples** — SQL snippets the learner can execute inline.
- **Exercises** — the graded heart of the lesson (see the Playground below).
- **Real-world notes** and **summary** — prose.

Design challenge: this page mixes **reading** (calm, long-form, comfortable) with
**doing** (the interactive editor). The layout has to serve both without one drowning
the other. Think about reading rhythm, where the editor lives, and how the learner
moves between "learn" and "try."

### 5.3 The SQL Playground (the hero component)

This is the most important interactive surface. It contains:

- A **SQL editor** with syntax highlighting (PostgreSQL).
- A **Run** action.
- A **results table** (the rows the query returned).
- **Readable error messages** when a query fails (must never feel like a crash).
- A **Reset** action — restore the lesson database to its seeded state.
- For exercises: an **auto-grade result** — pass/fail with a _specific_ reason on fail.

States to design explicitly (this is where the experience lives or dies):

1. **Empty / starter** — before the first run. Should invite, not intimidate.
2. **Running** — query executing (it runs in the background; brief wait possible).
3. **Success — results** — a clean, readable data table.
4. **Error** — PostgreSQL's real error message, made human and calm.
5. **Exercise passed** — earned, satisfying, but not childish.
6. **Exercise failed** — supportive, specific, "here's why," never punishing.

> There is intentionally **no "reveal solution"** and **no hint system** in v1. The
> failure state must do the motivational work instead. Design it with care.

---

## 6. Current visual state (your starting point)

The app is **functionally built but visually unstyled** — deliberately. Today it uses:

- `system-ui` sans-serif, default sizes.
- Background `#f9fafb`, text `#111827`.
- A single blue focus/accent `#2563eb`.
- Plain HTML structure, accessible (skip-link, focus rings, semantic markup).

In other words: a clean, accessible skeleton with **no brand layer yet**. That layer —
type system, color system, spacing, components, the belt visual language — is the
design work. You're not fighting an existing look; you're giving it one.

---

## 7. Constraints worth knowing (so designs stay buildable)

These come from the product's architecture. None of them limit creativity much, but
respecting them keeps the design realistic.

- **Static site, no backend.** Everything runs in the browser. No server-rendered
  personalization, no login, no profile screens.
- **No accounts.** Progress is anonymous, stored locally in the browser. Design no
  sign-up, sign-in, or account UI.
- **Performance budget on lessons.** The real PostgreSQL engine is a multi-MB download,
  loaded _only_ on lesson pages (never on the landing/belt map). Target: a learner can
  run their first query in **under ~3 seconds**. The belt map must stay near-instant —
  keep its assets light. Lighthouse Performance target ≥ 90.
- **Accessibility is a requirement, not a nice-to-have.** Target **WCAG 2.1 AA**:
  keyboard-navigable, sufficient color contrast, semantic structure. The belt accent
  colors must pass contrast where used for text/UI meaning.
- **English only** for the MVP UI.
- **Desktop-first, mobile readable.** The belt map and prose must work well on mobile;
  the SQL editor only needs to be usable, not optimized, on phones.

---

## 8. What's explicitly NOT in scope (don't design these yet)

So you don't spend effort on things the product is intentionally leaving out:

- No social features (comments, sharing, leaderboards).
- No badges / streaks / XP / gamification beyond the belt progression itself.
- No "reveal solution" or hints (v1).
- No accounts, profiles, or settings screens.
- No multi-language UI.
- No content for belts beyond Beginner (they're "coming soon" placeholders).

---

## 9. The one-line brief

> Design a **welcoming, credible dev-tool** that turns a blank SQL editor into a place
> a nervous beginner _wants_ to type — wrapped in a **belt journey** that makes every
> step of progress feel earned and visible.

---

### Reference (for deeper context, optional)

- `docs/prd.md` — full product requirements (the why and the what).
- `docs/mindset.md` — teaching & product philosophy (the voice).
- `src/lib/belts.ts` — the locked belt names, taglines, and accent colors.
