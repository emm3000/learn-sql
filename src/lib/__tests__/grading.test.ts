/**
 * Grading engine tests (M2).
 *
 * Two layers:
 * A) Pure unit tests of compareResultSets — hand-built QueryResult fixtures,
 *    no DB required.
 * B) Integration tests using PGlite directly (no Worker — same pattern as
 *    db-engine.test.ts) for gradeExercise in both result and state modes.
 *
 * Coverage goals (M2.5):
 *  - Result-based: lesson-01 exercises pass against their own expectedSql
 *  - Row order: orderMatters:false passes on different order; true fails
 *  - Column aliases: checkColumnNames:false passes on name mismatch; true fails
 *  - Numeric tolerance: near-miss passes within tolerance; fails outside; null exact
 *  - Empty result sets compare equal
 *  - Duplicate rows: multiset semantics (two identical ≠ one)
 *  - Learner query ERROR → FAIL with message, no throw
 *  - State-based: correct mutation passes, wrong/absent mutation fails
 *  - State isolation: a failing run does not leak into the next
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import seedSql from '../../../seed/classic_company.sql?raw';
import { normalizeError } from '../db/normalize-error.ts';
import { compareResultSets } from '../grading/compare-results.ts';
import { gradeExercise } from '../grading/grade.ts';
import type { SqlRunner } from '../grading/grade.ts';
import type { QueryResult } from '../db/types.ts';
import type { Exercise } from '../exercise-schema.ts';

// ---------------------------------------------------------------------------
// Test adapter: wraps a raw PGlite as a SqlRunner (no Worker needed in Vitest)
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
// Helpers — build minimal QueryResult fixtures
// ---------------------------------------------------------------------------

function makeResult(names: string[], rows: unknown[][]): QueryResult {
  const fields = names.map((name) => ({ name, dataTypeID: 0 }));
  const resultRows = rows.map((vals) => {
    const row: Record<string, unknown> = {};
    names.forEach((n, i) => {
      row[n] = vals[i];
    });
    return row;
  });
  return { fields, rows: resultRows };
}

// ---------------------------------------------------------------------------
// A. Pure unit tests — compareResultSets
// ---------------------------------------------------------------------------

describe('compareResultSets — pure unit', () => {
  const baseOptions = {
    orderMatters: false,
    checkColumnNames: false,
    numericTolerance: null,
  };

  // ---- Empty result sets ------------------------------------------------

  it('two empty result sets pass', () => {
    const r = makeResult(['id'], []);
    expect(compareResultSets(r, r, baseOptions)).toEqual({ passed: true });
  });

  // ---- Column count mismatch -------------------------------------------

  it('fails when actual has more columns than expected', () => {
    const actual = makeResult(['a', 'b'], [[1, 2]]);
    const expected = makeResult(['a'], [[1]]);
    const result = compareResultSets(actual, expected, baseOptions);
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.message).toMatch(/2 column/);
      expect(result.detail?.kind).toBe('column-count');
    }
  });

  it('fails when actual has fewer columns than expected', () => {
    const actual = makeResult(['a'], [[1]]);
    const expected = makeResult(['a', 'b'], [[1, 2]]);
    const result = compareResultSets(actual, expected, baseOptions);
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.detail?.kind).toBe('column-count');
    }
  });

  // ---- Column name check -----------------------------------------------

  it('checkColumnNames:false ignores name mismatch', () => {
    const actual = makeResult(['alias_a'], [[1]]);
    const expected = makeResult(['real_a'], [[1]]);
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        checkColumnNames: false,
      }),
    ).toEqual({ passed: true });
  });

  it('checkColumnNames:true fails on name mismatch', () => {
    const actual = makeResult(['alias_a'], [[1]]);
    const expected = makeResult(['real_a'], [[1]]);
    const result = compareResultSets(actual, expected, {
      ...baseOptions,
      checkColumnNames: true,
    });
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.message).toMatch(/alias_a/);
      expect(result.detail?.kind).toBe('column-names');
    }
  });

  it('checkColumnNames:true passes when names match', () => {
    const actual = makeResult(['name'], [['Alice']]);
    const expected = makeResult(['name'], [['Alice']]);
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        checkColumnNames: true,
      }),
    ).toEqual({ passed: true });
  });

  // ---- Row count mismatch ----------------------------------------------

  it('fails when row counts differ', () => {
    const actual = makeResult(['id'], [[1], [2]]);
    const expected = makeResult(['id'], [[1]]);
    const result = compareResultSets(actual, expected, baseOptions);
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.message).toMatch(/2 row/);
    }
  });

  // ---- orderMatters:false (multiset) -----------------------------------

  it('orderMatters:false passes when rows match in different order', () => {
    const actual = makeResult(['id'], [[2], [1], [3]]);
    const expected = makeResult(['id'], [[1], [2], [3]]);
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        orderMatters: false,
      }),
    ).toEqual({ passed: true });
  });

  it('orderMatters:false passes with multiple columns in different order', () => {
    const actual = makeResult(
      ['a', 'b'],
      [
        [2, 'x'],
        [1, 'y'],
      ],
    );
    const expected = makeResult(
      ['a', 'b'],
      [
        [1, 'y'],
        [2, 'x'],
      ],
    );
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        orderMatters: false,
      }),
    ).toEqual({ passed: true });
  });

  it('orderMatters:false detects missing rows (multiset)', () => {
    const actual = makeResult(['id'], [[1], [2]]);
    const expected = makeResult(['id'], [[1], [3]]);
    const result = compareResultSets(actual, expected, {
      ...baseOptions,
      orderMatters: false,
    });
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.detail?.kind).toBe('multiset-mismatch');
    }
  });

  // ---- Duplicate row semantics (multiset) ------------------------------

  it('two identical rows ≠ one row (multiset preserves duplicates)', () => {
    const actual = makeResult(['id'], [[1]]);
    const expected = makeResult(['id'], [[1], [1]]);
    const result = compareResultSets(actual, expected, {
      ...baseOptions,
      orderMatters: false,
    });
    expect(result.passed).toBe(false);
  });

  it('duplicate rows pass when both sides have the same duplicates', () => {
    const actual = makeResult(['id'], [[5], [5], [3]]);
    const expected = makeResult(['id'], [[5], [5], [3]]);
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        orderMatters: false,
      }),
    ).toEqual({ passed: true });
  });

  // ---- orderMatters:true (ordered) -------------------------------------

  it('orderMatters:true fails when row sequence differs', () => {
    const actual = makeResult(['id'], [[2], [1]]);
    const expected = makeResult(['id'], [[1], [2]]);
    const result = compareResultSets(actual, expected, {
      ...baseOptions,
      orderMatters: true,
    });
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.detail?.kind).toBe('row-order');
    }
  });

  it('orderMatters:true passes when rows match in correct order', () => {
    const actual = makeResult(['id'], [[1], [2], [3]]);
    const expected = makeResult(['id'], [[1], [2], [3]]);
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        orderMatters: true,
      }),
    ).toEqual({ passed: true });
  });

  // ---- Numeric tolerance -----------------------------------------------

  it('numericTolerance:0.001 passes near-miss numeric values', () => {
    // Simulates AVG returning a slightly different float.
    const actual = makeResult(['avg'], [['3.3333']]);
    const expected = makeResult(['avg'], [['3.334']]);
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        numericTolerance: 0.001,
      }),
    ).toEqual({ passed: true });
  });

  it('numericTolerance:0.001 fails when difference exceeds tolerance', () => {
    const actual = makeResult(['avg'], [['3.0']]);
    const expected = makeResult(['avg'], [['3.5']]);
    const result = compareResultSets(actual, expected, {
      ...baseOptions,
      numericTolerance: 0.001,
    });
    expect(result.passed).toBe(false);
  });

  it('numericTolerance:null requires exact equality (fails near-miss)', () => {
    const actual = makeResult(['avg'], [['3.3333']]);
    const expected = makeResult(['avg'], [['3.334']]);
    const result = compareResultSets(actual, expected, {
      ...baseOptions,
      numericTolerance: null,
    });
    expect(result.passed).toBe(false);
  });

  it('numericTolerance:null passes exact match of numeric-string values', () => {
    const actual = makeResult(['count'], [['4']]);
    const expected = makeResult(['count'], [['4']]);
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        numericTolerance: null,
      }),
    ).toEqual({ passed: true });
  });

  it('tolerance applies to real numbers as well as numeric strings', () => {
    const actual = makeResult(['val'], [[3.3333]]);
    const expected = makeResult(['val'], [[3.334]]);
    expect(
      compareResultSets(actual, expected, {
        ...baseOptions,
        numericTolerance: 0.001,
      }),
    ).toEqual({ passed: true });
  });

  it('non-numeric values always compare strictly (tolerance ignored)', () => {
    const actual = makeResult(['name'], [['Alice']]);
    const expected = makeResult(['name'], [['alice']]);
    const result = compareResultSets(actual, expected, {
      ...baseOptions,
      numericTolerance: 100,
    });
    // Strings are compared strictly regardless of tolerance.
    expect(result.passed).toBe(false);
  });

  // ---- F1: numeric scale — strict null rejects, tolerance:0 accepts ------
  // Guards PGlite's real encoding: numeric/AVG come back as scaled strings
  // ("2.50", "2.5000000000000000"). With numericTolerance:null the comparison
  // falls back to strict === and rejects a correct learner answer.

  it('numeric strings of different scale: strict null rejects, tolerance:0 accepts', () => {
    // Simulates PGlite returning AVG/numeric as a scaled string.
    const actual = makeResult(['avg'], [['2.50']]);
    const expected = makeResult(['avg'], [['2.5']]);

    // With null tolerance "2.50" !== "2.5" → false negative (documents the trap).
    const strictResult = compareResultSets(actual, expected, {
      ...baseOptions,
      numericTolerance: null,
    });
    expect(strictResult.passed).toBe(false);

    // With tolerance:0 both coerce to Number() → 2.5 === 2.5 → pass (documents the fix).
    const tolerantResult = compareResultSets(actual, expected, {
      ...baseOptions,
      numericTolerance: 0,
    });
    expect(tolerantResult.passed).toBe(true);
  });

  // ---- F2: tolerance coerces numeric-looking string codes -----------------
  // Guards against setting numericTolerance on columns that hold IDs, zip
  // codes, or any leading-zero string that looks numeric but must stay exact.

  it('tolerance coerces numeric-looking string codes — do not set tolerance on code columns', () => {
    // "007" and "7" differ as strings but are equal after Number() coercion.
    const actual = makeResult(['code'], [['007']]);
    const expected = makeResult(['code'], [['7']]);

    // tolerance:0 causes "007" and "7" to match — a false positive for code columns.
    const result = compareResultSets(actual, expected, {
      ...baseOptions,
      numericTolerance: 0,
    });
    expect(result.passed).toBe(true); // documents the coercion footgun
  });

  it('multiset comparison with tolerance matches near-miss unordered rows', () => {
    // Two rows whose canonical string keys differ but are within tolerance.
    const actual = makeResult(['avg'], [['2.667'], ['4.334']]);
    const expected = makeResult(['avg'], [['4.333'], ['2.666']]);
    expect(
      compareResultSets(actual, expected, {
        orderMatters: false,
        checkColumnNames: false,
        numericTolerance: 0.002,
      }),
    ).toEqual({ passed: true });
  });
});

// ---------------------------------------------------------------------------
// B. Integration tests — gradeExercise with PGlite
// ---------------------------------------------------------------------------

describe('gradeExercise — integration (PGlite)', () => {
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

  // ---- Lesson-01 sanity: result-based exercises pass against their own expectedSql ----

  it('lesson-01 exercise 1: expectedSql grades as PASS against itself', async () => {
    const exercise: Exercise = {
      id: 'l01-e01',
      prompt: 'List all customers.',
      expectedSql: 'SELECT first_name, last_name, email FROM customers;',
      gradeMode: 'result',
      compareOptions: {
        orderMatters: false,
        checkColumnNames: false,
        numericTolerance: null,
      },
    };
    const result = await gradeExercise(
      runner,
      exercise,
      exercise.expectedSql,
      seedSql,
    );
    expect(result.passed).toBe(true);
  });

  it('lesson-01 exercise 2 (ordered): expectedSql grades as PASS against itself', async () => {
    const exercise: Exercise = {
      id: 'l01-e02',
      prompt: 'List customers ordered by last name.',
      expectedSql:
        'SELECT first_name, last_name FROM customers ORDER BY last_name ASC;',
      gradeMode: 'result',
      compareOptions: {
        orderMatters: true,
        checkColumnNames: false,
        numericTolerance: null,
      },
    };
    const result = await gradeExercise(
      runner,
      exercise,
      exercise.expectedSql,
      seedSql,
    );
    expect(result.passed).toBe(true);
  });

  // ---- Learner query error → FAIL, no throw ---------------------------

  it('learner syntax error → FAIL with error message, does not throw', async () => {
    const exercise: Exercise = {
      id: 'err-test',
      prompt: 'Test error handling.',
      expectedSql: 'SELECT * FROM customers;',
      gradeMode: 'result',
      compareOptions: {
        orderMatters: false,
        checkColumnNames: false,
        numericTolerance: null,
      },
    };
    const result = await gradeExercise(
      runner,
      exercise,
      'NOT VALID SQL !!!',
      seedSql,
    );
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(typeof result.message).toBe('string');
      expect(result.message.length).toBeGreaterThan(0);
      expect(result.detail?.kind).toBe('query-error');
    }
  });

  it('learner references nonexistent table → FAIL with error message', async () => {
    const exercise: Exercise = {
      id: 'err-table',
      prompt: 'Test missing table.',
      expectedSql: 'SELECT * FROM customers LIMIT 1;',
      gradeMode: 'result',
      compareOptions: {
        orderMatters: false,
        checkColumnNames: false,
        numericTolerance: null,
      },
    };
    const result = await gradeExercise(
      runner,
      exercise,
      'SELECT * FROM no_such_table;',
      seedSql,
    );
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.message).toMatch(/error/i);
    }
  });

  // ---- Column alias flexibility ----------------------------------------

  it('different column alias passes when checkColumnNames:false', async () => {
    const exercise: Exercise = {
      id: 'alias-test',
      prompt: 'Select first names.',
      expectedSql: 'SELECT first_name FROM customers ORDER BY id;',
      gradeMode: 'result',
      compareOptions: {
        orderMatters: true,
        checkColumnNames: false,
        numericTolerance: null,
      },
    };
    // Learner uses an alias — same values, different column name.
    const learnerSql =
      'SELECT first_name AS nombre FROM customers ORDER BY id;';
    const result = await gradeExercise(runner, exercise, learnerSql, seedSql);
    expect(result.passed).toBe(true);
  });

  it('different column alias fails when checkColumnNames:true', async () => {
    const exercise: Exercise = {
      id: 'alias-strict',
      prompt: 'Select first names (strict names).',
      expectedSql: 'SELECT first_name FROM customers ORDER BY id;',
      gradeMode: 'result',
      compareOptions: {
        orderMatters: true,
        checkColumnNames: true,
        numericTolerance: null,
      },
    };
    const learnerSql =
      'SELECT first_name AS nombre FROM customers ORDER BY id;';
    const result = await gradeExercise(runner, exercise, learnerSql, seedSql);
    expect(result.passed).toBe(false);
    if (!result.passed) {
      expect(result.detail?.kind).toBe('column-names');
    }
  });

  // ---- Numeric tolerance with real DB data (COUNT = string from PGlite) ----

  it('COUNT(*) as string passes with numericTolerance:0', async () => {
    const exercise: Exercise = {
      id: 'count-test',
      prompt: 'Count customers.',
      expectedSql: 'SELECT COUNT(*) AS total FROM customers;',
      gradeMode: 'result',
      compareOptions: {
        orderMatters: false,
        checkColumnNames: false,
        numericTolerance: 0,
      },
    };
    const result = await gradeExercise(
      runner,
      exercise,
      exercise.expectedSql,
      seedSql,
    );
    expect(result.passed).toBe(true);
  });

  // ---- State-based grading (M2.3) -------------------------------------

  const stateExercise: Exercise = {
    id: 'state-insert-test',
    prompt: 'Insert a new customer.',
    expectedSql: `INSERT INTO customers (first_name, last_name, email, city)
      VALUES ('Test', 'Runner', 'test.runner@example.com', 'TestCity');`,
    gradeMode: 'state',
    verificationSql: `SELECT first_name, last_name, email, city
      FROM customers
      WHERE email = 'test.runner@example.com'
      ORDER BY id;`,
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  };

  it('state-based: correct INSERT passes', async () => {
    const result = await gradeExercise(
      runner,
      stateExercise,
      stateExercise.expectedSql,
      seedSql,
    );
    expect(result.passed).toBe(true);
  });

  it('state-based: wrong INSERT (different email) fails', async () => {
    const learnerSql = `INSERT INTO customers (first_name, last_name, email, city)
      VALUES ('Test', 'Runner', 'wrong.email@example.com', 'TestCity');`;
    const result = await gradeExercise(
      runner,
      stateExercise,
      learnerSql,
      seedSql,
    );
    expect(result.passed).toBe(false);
  });

  it('state-based: no mutation fails (verification returns 0 rows)', async () => {
    // Learner runs a SELECT instead of INSERT — verification finds nothing.
    const learnerSql = 'SELECT 1;';
    const result = await gradeExercise(
      runner,
      stateExercise,
      learnerSql,
      seedSql,
    );
    expect(result.passed).toBe(false);
  });

  it('state-based: isolation — failing run does not leak into next grade', async () => {
    // First: a wrong mutation that leaves dirty data in one reset cycle.
    const dirty = `INSERT INTO customers (first_name, last_name, email, city)
      VALUES ('Dirty', 'Data', 'dirty.data@example.com', 'Nowhere');`;
    await gradeExercise(runner, stateExercise, dirty, seedSql);

    // Second: correct mutation. Must pass — the previous run's data is gone.
    const result = await gradeExercise(
      runner,
      stateExercise,
      stateExercise.expectedSql,
      seedSql,
    );
    expect(result.passed).toBe(true);
  });

  // UPDATE-based state exercise for additional state-mode coverage
  const updateExercise: Exercise = {
    id: 'state-update-test',
    prompt: 'Update Engineering location to Medellin.',
    expectedSql: `UPDATE departments SET location = 'Medellin' WHERE name = 'Engineering';`,
    gradeMode: 'state',
    verificationSql: `SELECT name, location FROM departments WHERE name = 'Engineering';`,
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  };

  it('state-based: correct UPDATE passes', async () => {
    const result = await gradeExercise(
      runner,
      updateExercise,
      updateExercise.expectedSql,
      seedSql,
    );
    expect(result.passed).toBe(true);
  });

  it('state-based: wrong UPDATE (different value) fails', async () => {
    const learnerSql = `UPDATE departments SET location = 'Caracas' WHERE name = 'Engineering';`;
    const result = await gradeExercise(
      runner,
      updateExercise,
      learnerSql,
      seedSql,
    );
    expect(result.passed).toBe(false);
  });

  it('state-based: isolation for UPDATE — correct run after dirty run passes', async () => {
    // Dirty run: set wrong value.
    const dirty = `UPDATE departments SET location = 'Mars' WHERE name = 'Engineering';`;
    await gradeExercise(runner, updateExercise, dirty, seedSql);

    // After isolation: correct run should pass from clean seed.
    const result = await gradeExercise(
      runner,
      updateExercise,
      updateExercise.expectedSql,
      seedSql,
    );
    expect(result.passed).toBe(true);
  });
});
