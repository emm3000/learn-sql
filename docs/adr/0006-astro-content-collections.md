# ADR-0006: Astro + Content Collections

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

The product is content-heavy and mostly static (theory, examples, summaries) with one
island of rich interactivity (the SQL Playground). We need excellent SEO and load
performance (public product, NFR-3, NFR-7) and a typed, validated content pipeline for
lessons and exercises.

## Decision

Use **Astro** as the framework, with **Content Collections** (Zod-validated schemas)
for lessons and exercises. Interactivity is delivered through Astro **islands**.

## Alternatives considered

- **Next.js (React).** Powerful and popular, but React-centric and ships more
  JavaScript by default. Heavier for a site that is 90% static content with one
  interactive widget.
- **Plain Vite SPA.** No static generation or SEO out of the box; ships the whole app
  as JS, hurting load performance and crawlability.
- **A docs generator (e.g. Docusaurus).** Great for pure docs, but less control over a
  custom interactive island and a bespoke belt-based UI.

## Consequences

### Positive

- Near-zero JavaScript by default; excellent SEO and load performance.
- Type-safe, build-time-validated content via Content Collections + Zod (shared schema
  with the exercise definitions, ADR-0009).
- The island model fits our single interactive widget perfectly: ship JS only where
  it is needed.

### Negative / trade-offs

- Smaller ecosystem than Next.js.
- The islands hydration model and partial-hydration directives have a small learning
  curve.
