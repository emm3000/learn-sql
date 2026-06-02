import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  // Live Cloudflare Pages domain (ADR-0010). Will change if a custom domain is
  // added later (PRD Q1). Used for canonical + Open Graph absolute URLs.
  site: 'https://learn-sql-amg.pages.dev',
  integrations: [svelte()],
  vite: {
    optimizeDeps: {
      // PGlite ships its own WASM loader; Vite's dep optimizer would break it.
      exclude: ['@electric-sql/pglite'],
    },
    worker: {
      // Workers must be ES modules so PGliteWorker's postMessage protocol works.
      format: 'es',
    },
  },
});
