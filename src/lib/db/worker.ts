/**
 * PGlite Web Worker entry point.
 *
 * This file runs INSIDE a Web Worker. It should never be imported directly
 * by the main thread — the main thread uses DbClient (db-client.ts) which
 * spawns this file as a worker via a dynamic import boundary:
 *
 *   new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
 *
 * That new URL() call is what Vite/Rollup uses to split this (+ PGlite WASM)
 * into a separate chunk, so the ~7 MB WASM is only loaded on lesson pages
 * that instantiate a DbClient — never on the landing/map page (M1.5).
 *
 * Q2: PGliteWorker.create() on the main-thread side awaits the worker's
 * readiness handshake before resolving, so `waitReady` is redundant after
 * `create()`. The `worker()` helper here handles the other side of that
 * handshake automatically.
 */

import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';
import type { PGliteWorkerOptions } from '@electric-sql/pglite/worker';

// PGlite's bundled Emscripten glue probes Node globals (process.versions.node,
// process.platform, process.argv) to detect its runtime. In a browser Web
// Worker `process` is absent, so these unguarded reads throw
// "process is not defined" — but ONLY in the production build: Vite's dev
// server injects a `process` shim, which is why `pnpm dev` (and the dev-server
// e2e test) never surfaced this. Define a minimal browser-shaped shim. Leaving
// `versions.node` undefined keeps Emscripten on its browser code path; the
// empty `platform`/`argv` fields stop the unguarded reads from throwing.
const globalScope = globalThis as typeof globalThis & { process?: unknown };
globalScope.process ??= { env: {}, platform: '', argv: [] };

worker({
  async init(options: Exclude<PGliteWorkerOptions, 'extensions'>) {
    // When a cached snapshot blob is supplied via `loadDataDir`, PGlite
    // restores the data directory from that blob instead of running initdb.
    // This saves ~390 ms on repeat visits (M1.6 / NFR-5).
    if (options.loadDataDir) {
      return new PGlite({ loadDataDir: options.loadDataDir });
    }
    return new PGlite();
  },
});
