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

worker({
  async init() {
    return new PGlite();
  },
});
