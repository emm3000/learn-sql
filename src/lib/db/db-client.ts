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

export class DbClient {
  readonly #pg: PGliteWorker;
  readonly #worker: Worker;

  private constructor(pg: PGliteWorker, w: Worker) {
    this.#pg = pg;
    this.#worker = w;
  }

  /**
   * Spawn a new Worker, connect PGliteWorker, and run the initial seed.
   *
   * The `new URL('./worker.ts', import.meta.url)` expression is the
   * Vite/Rollup code-split boundary that ensures the PGlite WASM is
   * bundled into a separate chunk loaded only when this method is called.
   */
  static async create(seedSql: string): Promise<DbClient> {
    const w = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    });
    // PGliteWorker.create awaits the worker's readiness handshake before
    // resolving, so no additional waitReady call is needed here (Q2).
    const pg = await PGliteWorker.create(w);
    await pg.exec(seedSql);
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

