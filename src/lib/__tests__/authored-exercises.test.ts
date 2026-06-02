/**
 * Authored exercises sanity test (M4.5).
 *
 * For every lesson in the registry and every exercise in it, grades the
 * exercise's own expectedSql against itself and asserts it passes.
 * This catches authoring regressions (bad SQL, wrong compareOptions, etc.)
 * and scales automatically as new lessons/exercises are added.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import seedSql from '../../../seed/classic_company.sql?raw';
import { normalizeError } from '../db/normalize-error.ts';
import { gradeExercise } from '../grading/grade.ts';
import type { SqlRunner } from '../grading/grade.ts';
import { exercisesByLesson } from '../exercises/index.ts';

// ---------------------------------------------------------------------------
// Test adapter: wraps a raw PGlite as a SqlRunner (mirrors grading.test.ts)
// ---------------------------------------------------------------------------

function makePGliteRunner(db: PGlite): SqlRunner {
  return {
    async runSql(sql: string) {
      try {
        const res = await db.query<Record<string, unknown>>(sql);
        return {
          ok: true as const,
          result: {
            rows: res.rows,
            fields: res.fields,
            affectedRows: res.affectedRows,
          },
        };
      } catch (err) {
        return { ok: false as const, error: normalizeError(err) };
      }
    },
    async reset(seed: string) {
      await db.exec('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
      await db.exec(seed);
    },
  };
}

// ---------------------------------------------------------------------------
// One PGlite instance shared across all dynamic tests
// ---------------------------------------------------------------------------

let db: PGlite;
let runner: SqlRunner;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(seedSql);
  runner = makePGliteRunner(db);
});

afterAll(async () => {
  await db.close();
});

// ---------------------------------------------------------------------------
// Dynamic tests — one per exercise, across all lessons in the registry
// ---------------------------------------------------------------------------

describe('authored exercises — expectedSql grades as PASS against itself', () => {
  for (const [slug, exercises] of Object.entries(exercisesByLesson)) {
    for (const exercise of exercises) {
      it(`${slug} / ${exercise.id}: expectedSql grades as PASS against itself`, async () => {
        // Reset to seed before each exercise so runs are fully isolated.
        await runner.reset(seedSql);

        const result = await gradeExercise(
          runner,
          exercise,
          exercise.expectedSql,
          seedSql,
        );

        expect(
          result.passed,
          `[${slug} / ${exercise.id}] ${result.passed ? '' : (result as { passed: false; message: string }).message}`,
        ).toBe(true);
      });
    }
  }
});
