import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
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
