# ADR-0008: CodeMirror 6 for the SQL editor

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

Learners type SQL. They need a real editor: syntax highlighting, a comfortable editing
experience, and ideally SQL-aware features. It must be lightweight (NFR-3) and embed
cleanly inside the Svelte island (ADR-0007).

## Decision

Use **CodeMirror 6** with its SQL language package, configured for the PostgreSQL
dialect.

## Alternatives considered

- **Monaco (the VS Code editor).** Extremely capable, but heavy (megabytes) and
  oriented to full IDE scenarios. Overkill for a focused SQL box and bad for load
  performance.
- **Plain `<textarea>`.** Trivial, but no syntax highlighting and a poor editing
  experience — undermines the hands-on feel.
- **Ace.** Capable but older architecture; CodeMirror 6 is more modular and modern.

## Consequences

### Positive

- Lightweight and modular; ship only the features we use.
- Framework-agnostic core, so it embeds in the Svelte island without friction.
- SQL dialect configuration and good highlighting out of the box.

### Negative / trade-offs

- Lower-level, composition-based API than Monaco; requires deliberate setup of
  extensions (highlighting, theme, keymaps).
