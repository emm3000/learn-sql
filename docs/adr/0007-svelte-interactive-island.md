# ADR-0007: Svelte for the interactive island

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

There is essentially one rich interactive component: the SQL Playground (editor, run
button, results table, grading feedback). NFR-3 requires shipping as little JavaScript
as possible. Astro supports multiple UI frameworks for islands, so we can pick the best
fit for this single widget.

## Decision

Build the interactive island with **Svelte**.

## Alternatives considered

- **React.** Largest ecosystem and likely familiar, but larger runtime/bundle. Heavier
  than necessary for one island, working against NFR-3.
- **Solid.** Excellent fine-grained reactivity and small bundle, but a smaller
  community and fewer learning resources.
- **Vanilla / Web Components.** Zero framework dependency and full control, but
  significantly more manual work to manage editor and result state.

## Consequences

### Positive

- Minimal bundle for a rich island; strong fit with NFR-3.
- Simple, readable reactivity; first-class Astro integration.

### Negative / trade-offs

- Smaller ecosystem than React.
- Contributor familiarity may be lower than React; accepted, as the surface area is one
  well-contained component.
