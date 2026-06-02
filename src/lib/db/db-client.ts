/**
 * DbClient — main-thread wrapper around a PGliteWorker.
 *
 * Usage:
 *   const db = await DbClient.create(seedSql);
 *   const result = await db.runSql('SELECT * FROM employees');
 *   await db.reset(seedSql);
 *   await db.close();
 *
 * The seedSql string is passed in by the caller (lesson page or test) as:
 *   import seedSql from '../../seed/classic_company.sql?raw';
 *
 * Keeping seedSql as a runtime argument (not a static import here) is what
 * preserves the lazy-load boundary: the ?raw import and the Worker chunk both
 * live in the lesson page's dynamic-import graph, never in the landing page.
 */

import { PGliteWorker } from '@electric-sql/pglite/worker';
import type { RunSqlResult } from './types.ts';
import { normalizeError } from './normalize-error.ts';
import { hashSeed, getSnapshot, putSnapshot, deleteSnapshot } from './snapshot-cache.ts';

export class DbClient {
  readonly #pg: PGliteWorker;
  readonly #worker: Worker;

  private constructor(pg: PGliteWorker, w: Worker) {
    this.#pg = pg;
    this.#worker = w;
  }

  /**
   * Spawn a new Worker, connect PGliteWorker, and seed the database.
   *
   * On a cache HIT the worker is initialised with `loadDataDir` — PGlite
   * restores the post-seed cluster from a gzip blob instead of running
   * initdb and executing the full seed SQL (~390 ms saved on repeat visits).
   * If the restore fails (corrupt/partial blob), the consumed worker is
   * terminated, the poisoned entry is evicted from IndexedDB, and the method
   * falls through to the MISS path with a fresh worker — never bricks the
   * playground on a bad cache entry.
   *
   * On a cache MISS the normal seed path runs, and the resulting cluster is
   * captured with `dumpDataDir('gzip')` and written to IndexedDB for the
   * next visit. The capture is best-effort: if it fails, the miss is silent
   * and the next visit simply takes the slow path again.
   *
   * The `new URL('./worker.ts', import.meta.url)` expression is the
   * Vite/Rollup code-split boundary that ensures the PGlite WASM is
   * bundled into a separate chunk loaded only when this method is called.
   */
  static async create(seedSql: string): Promise<DbClient> {
    const key = hashSeed(seedSql);
    const cached = await getSnapshot(key);

    if (cached !== null) {
      // Cache HIT: restore the post-seed cluster directly. The worker's
      // init() receives `loadDataDir` and passes it to `new PGlite(...)`,
      // which skips initdb entirely. No seed SQL needed.
      //
      // If the blob is corrupt or the restore rejects for any reason, we
      // evict the poisoned entry, terminate the consumed worker, and fall
      // through to the MISS path below with a fresh worker.
      const wHit = new Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module',
      });
      try {
        // PGliteWorker.create awaits the worker's readiness handshake before
        // resolving, so no additional waitReady call is needed (Q2).
        const pg = await PGliteWorker.create(wHit, { loadDataDir: cached });
        return new DbClient(pg, wHit);
      } catch {
        // Restore failed — terminate the consumed worker and evict the entry
        // so future visits don't hit the same corrupt blob.
        wHit.terminate();
        await deleteSnapshot(key);
        // Fall through to the MISS path with a new worker below.
      }
    }

    // Cache MISS (or HIT fallback): boot normally, run the seed, then
    // capture a snapshot for the next visit.
    const w = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    });
    const pg = await PGliteWorker.create(w);
    await pg.exec(seedSql);

    // Best-effort snapshot capture. Errors are swallowed so a dump failure
    // never surfaces to the learner — the next visit will try again.
    try {
      const blob = await pg.dumpDataDir('gzip');
      await putSnapshot(key, blob);
    } catch {
      // Intentionally silent — cache write failure is non-fatal.
    }

    return new DbClient(pg, w);
  }

  /**
   * Run arbitrary SQL. Never throws — errors are returned as { ok: false }.
   */
  async runSql(sql: string): Promise<RunSqlResult> {
    try {
      const res = await this.#pg.query<Record<string, unknown>>(sql);
      return {
        ok: true,
        result: {
          rows: res.rows,
          fields: res.fields,
          affectedRows: res.affectedRows,
        },
      };
    } catch (err) {
      return { ok: false, error: normalizeError(err) };
    }
  }

  /**
   * Reset the DB to seed state by wiping the public schema and re-running
   * the seed. Reuses the existing Worker + WASM instance to avoid the cost
   * of recompiling WASM on every reset.
   *
   * If the seed defines objects outside the public schema this approach will
   * not remove them. In that case, fall back to close() + create() instead.
   */
  async reset(seedSql: string): Promise<void> {
    await this.#pg.exec('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    await this.#pg.exec(seedSql);
  }

  /** Close the PGliteWorker connection and terminate the underlying Worker. */
  async close(): Promise<void> {
    await this.#pg.close();
    this.#worker.terminate();
  }
}
