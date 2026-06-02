# ADR-0010: Deploy to Cloudflare Pages with Cloudflare Web Analytics

- Status: Accepted
- Date: 2026-06-02
- Deciders: Edgardo Munoz

## Context

The product is a static Astro site with no backend (ADR-0001, ADR-0006). The only
runtime is in the browser: PGlite (PostgreSQL in WASM) running inside a Web Worker.
Shipping it as a public product (M7) requires choosing a static host (PRD Q3) and a
privacy-respecting analytics tool (PRD Q2, NFR-11).

A manual browser smoke test confirmed PGlite 0.4.6 boots in a headless browser
**without** cross-origin isolation — no `Cross-Origin-Opener-Policy` /
`Cross-Origin-Embedder-Policy` headers are required. This removes a constraint that
would otherwise favour hosts with custom-header control.

## Decision

Deploy to **Cloudflare Pages** and instrument with **Cloudflare Web Analytics**
(cookieless, free, zero-config). Analytics is a direct consequence of the host choice:
Cloudflare bundles a privacy-respecting analytics product that satisfies NFR-11 with no
extra dependency.

## Alternatives considered

- **Netlify.** Solid static host with a native Astro build, but its first-party
  analytics is paid; we would add Plausible or Umami for Q2. Loses the free
  analytics combo without a compensating benefit for a static site.
- **Vercel.** Excellent DX, but built around SSR / serverless functions we do not use,
  and its analytics is paid. Overkill for a 100% static site.
- **GitHub Pages.** Simplest and free if already on GitHub, but no control over headers
  or redirects and no built-in analytics — least flexible for future needs.

## Consequences

### Positive

- Free global CDN with a native Astro build; fast load (NFR-3) and good
  time-to-first-query.
- Cloudflare Web Analytics resolves NFR-11 cookieless, with no added dependency.
- PGlite's no-COOP/COEP behaviour means we do not depend on host-specific header
  configuration, keeping deploy portable if we ever migrate.

### Negative / trade-offs

- Couples hosting and analytics to a single vendor; migrating later means replacing
  both at once.
- Cloudflare Web Analytics is less feature-rich than dedicated tools (e.g. Plausible
  funnels), but adequate for the MVP success metrics.
