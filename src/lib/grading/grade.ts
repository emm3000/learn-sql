/**
 * grade.ts — grading orchestration (M2.2 result-based, M2.3 state-based).
 *
 * The grader is decoupled from the concrete DbClient via a minimal SqlRunner
 * interface. DbClient already satisfies this shape structurally. In tests,
 * a thin adapter wraps a raw PGlite instance (no Worker needed in Vitest).
 */

import type { Exercise } from '../exercise-schema.ts';
import type { RunSqlResult } from '../db/types.ts';
import type { GradeResult } from './types.ts';
import { compareResultSets } from './compare-results.ts';

// ---------------------------------------------------------------------------
// SqlRunner interface
// ---------------------------------------------------------------------------

/**
 * Minimal structural interface that the grader requires from any DB backend.
 *
 * DbClient satisfies this without modification. In tests, wrap PGlite directly:
 *
 *   const runner: SqlRunner = {
 *     async runSql(sql) { ... },
 *     async reset(seedSql) { ... },
 *   };
 */
export interface SqlRunner {
  /** Run arbitrary SQL. Returns { ok: true, result } or { ok: false, error }. */
  runSql(sql: string): Promise<RunSqlResult>;
  /** Wipe the public schema and re-run seedSql from scratch. */
  reset(seedSql: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Grade a learner's SQL against a given exercise.
 *
 * @param runner   - A SqlRunner (DbClient or test adapter).
 * @param exercise - The exercise definition (schema-validated).
 * @param learnerSql - The SQL the learner submitted.
 * @param seedSql  - The seed SQL used to reset the DB for state-based grading.
 *                   Ignored for result-based exercises.
 * @returns        GradeResult — never throws.
 */
export async function gradeExercise(
  runner: SqlRunner,
  exercise: Exercise,
  learnerSql: string,
  seedSql: string,
): Promise<GradeResult> {
  if (exercise.gradeMode === 'result') {
    return gradeResult(runner, exercise, learnerSql);
  }
  return gradeState(runner, exercise, learnerSql, seedSql);
}

// ---------------------------------------------------------------------------
// Result-based grading (M2.2)
// ---------------------------------------------------------------------------

async function gradeResult(
  runner: SqlRunner,
  exercise: Exercise,
  learnerSql: string,
): Promise<GradeResult> {
  // Run the learner's query first so a learner error produces the clearest message.
  const learnerResult = await runner.runSql(learnerSql);
  if (!learnerResult.ok) {
    return {
      passed: false,
      message: `Your query produced an error: ${learnerResult.error.message}`,
      detail: {
        kind: 'query-error',
        errorMessage: learnerResult.error.message,
      },
    };
  }

  const expectedResult = await runner.runSql(exercise.expectedSql);
  if (!expectedResult.ok) {
    // Reference solution errored — this is an authoring bug, but we still
    // surface it gracefully rather than crashing.
    return {
      passed: false,
      message: `The reference solution produced an error: ${expectedResult.error.message}`,
      detail: {
        kind: 'query-error',
        errorMessage: expectedResult.error.message,
      },
    };
  }

  return compareResultSets(
    learnerResult.result,
    expectedResult.result,
    exercise.compareOptions,
  );
}

// ---------------------------------------------------------------------------
// State-based grading (M2.3)
// ---------------------------------------------------------------------------

/**
 * Isolation strategy (per ADR-0003):
 *
 *   reset(seedSql) → run learnerSql  → run verificationSql → learnerState
 *   reset(seedSql) → run expectedSql → run verificationSql → referenceState
 *   compareResultSets(learnerState, referenceState, options)
 *
 * Each run starts from a clean reseed, so no contamination between runs.
 */
async function gradeState(
  runner: SqlRunner,
  exercise: Exercise,
  learnerSql: string,
  seedSql: string,
): Promise<GradeResult> {
  // verificationSql is guaranteed present for state mode by the schema refine,
  // but we guard defensively to keep TypeScript narrowing clean.
  if (!exercise.verificationSql) {
    return {
      passed: false,
      message:
        'This exercise is missing a verification query (authoring error).',
      detail: { kind: 'missing-verification-sql' },
    };
  }
  const verificationSql = exercise.verificationSql;

  // --- Learner run ---
  await runner.reset(seedSql);
  const learnerMutation = await runner.runSql(learnerSql);
  if (!learnerMutation.ok) {
    return {
      passed: false,
      message: `Your query produced an error: ${learnerMutation.error.message}`,
      detail: {
        kind: 'query-error',
        errorMessage: learnerMutation.error.message,
      },
    };
  }
  const learnerVerification = await runner.runSql(verificationSql);
  if (!learnerVerification.ok) {
    return {
      passed: false,
      message: `The verification query failed after your statement: ${learnerVerification.error.message}`,
      detail: {
        kind: 'query-error',
        errorMessage: learnerVerification.error.message,
      },
    };
  }

  // --- Reference run ---
  await runner.reset(seedSql);
  const refMutation = await runner.runSql(exercise.expectedSql);
  if (!refMutation.ok) {
    return {
      passed: false,
      message: `The reference solution produced an error: ${refMutation.error.message}`,
      detail: { kind: 'query-error', errorMessage: refMutation.error.message },
    };
  }
  const refVerification = await runner.runSql(verificationSql);
  if (!refVerification.ok) {
    return {
      passed: false,
      message: `The verification query failed after the reference solution: ${refVerification.error.message}`,
      detail: {
        kind: 'query-error',
        errorMessage: refVerification.error.message,
      },
    };
  }

  return compareResultSets(
    learnerVerification.result,
    refVerification.result,
    exercise.compareOptions,
  );
}
