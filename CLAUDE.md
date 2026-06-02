# CLAUDE.md — Postgres Playground

<!-- Last reviewed: 2026-06-02. Keep "Project state" current as milestones land. -->

Working guide for this repository. Read this first.

## What this is

An interactive, browser-based PostgreSQL course where learners write real SQL against
a PostgreSQL engine running in their browser. Full product spec: `docs/prd.md`.

Two tracks live in this repo:

- **The product being built** (English): the Astro app and its docs in `docs/`.
- **The original learning content** (Spanish): `learning/ROADMAP_POSTGRES.md`,
  `learning/WORKFLOW.md`, `lessons/`, `seed/`. Source material the app's lessons are based on.

IMPORTANT: Product code, UI strings, comments, commit messages and everything under
`docs/` are in **English**. The original learning content (`lessons/`, `seed/`,
`learning/ROADMAP_POSTGRES.md`, `learning/WORKFLOW.md`) is in **Spanish** — do NOT translate it unless
migrating that content into the app.

The Astro app is scaffolded (M0 done). It lives at the repo root: `package.json`,
`astro.config.mjs`, `src/`. Package manager is **pnpm** and dependency versions are
**pinned exactly** (no ranges) on purpose — see `docs/adr/` and keep it that way.

## Commands

App (pnpm, from `postgres/`):

```bash
pnpm install        # install pinned deps
pnpm dev            # serve the Astro site locally
pnpm build          # astro check && astro build (type + content-schema validation)
pnpm test           # vitest (grading engine and schema tests)
pnpm check          # astro check only
pnpm lint:md        # markdownlint-cli2
pnpm format         # prettier (+ prettier-plugin-astro)
```

Practice PostgreSQL locally against the seed (independent of the app):

```bash
docker compose up -d
docker compose exec -T db psql -U postgres -d aprendizaje < seed/classic_company.sql
```

## Read before you build (doc-first)

This project is built doc-first, on purpose. Read in this order:

1. `docs/prd.md` — what we are building and why (the MVP).
2. `docs/adr/` — architectural decisions and their rationale (start at the README).
3. `docs/tasks.md` — the work breakdown (milestones M0–M7, traceable to PRD/ADRs).
4. `docs/mindset.md` — teaching and product philosophy (the voice).
5. `docs/authoring-guide.md` — how to write lessons and graded exercises.
6. `docs/orchestration.md` — how to delegate to agents and verify their work.

IMPORTANT: Do not change architecture without reading the relevant ADR. A new
significant decision means a new ADR — see `docs/adr/README.md` for the format.

## How to work here

- **Simplicity first.** This is an MVP (`docs/prd.md`). Build only what the current
  task needs — no speculative abstractions, no later belts. "Coming soon" stays coming
  soon until explicitly asked. Scope creep is our top documented risk (PRD R6).
- **Surgical changes.** Touch only what the task requires and match the existing style.
  Do not reformat, refactor, or "improve" adjacent code or the Spanish source content
  while doing something else.

## Project state (context)

- Phase: implementation. M0 (scaffold + content pipeline + schemas) is done; M1 (PGlite
  engine) is next — see `docs/tasks.md`.
- MVP scope: the belt framework plus three Beginner lessons (SELECT, INSERT,
  UPDATE/DELETE), fully auto-graded. Later belts are "coming soon".
- Known blocker: exercise solutions do not exist yet and must be authored
  (see `docs/authoring-guide.md`). Content work, tracked separately from code.

## Stack (see ADRs for the why)

- Astro + Content Collections, static, no backend — ADR-0001, ADR-0006
- Svelte island for the SQL Playground — ADR-0007
- PGlite (PostgreSQL in WASM) in a Web Worker — ADR-0001
- CodeMirror 6 editor — ADR-0008
- Exercises as typed TypeScript + Zod — ADR-0009
- Progress in `localStorage` — ADR-0004

## Conventions

- Commits: Conventional Commits. No AI attribution / `Co-Authored-By`.
- Markdown: blank lines around headings and lists (keep markdownlint clean).
- As the app grows, move file-specific rules (testing, components) into
  `.claude/rules/` with `paths:` frontmatter, not into this file.
