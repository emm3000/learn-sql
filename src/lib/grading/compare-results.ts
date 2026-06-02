/**
 * compare-results.ts — pure result-set comparison (M2.1, M2.4).
 *
 * No DB access. Depends only on the grading types and the exercise schema types.
 *
 * Key design decisions:
 * - Rows are Record<string,unknown>; values are extracted by fields[] order so
 *   that column-name differences are isolated to the checkColumnNames flag.
 * - Numeric coercion: PGlite returns COUNT/SUM/bigint/int4 as JS `number`, and
 *   numeric/decimal/AVG/division as a scaled JS `string` (e.g. "2.5000000000").
 *   Any value that is a JS number OR a string that parses as a finite number is
 *   treated as numeric for tolerance comparisons.
 *   IMPORTANT: exercises returning numeric/AVG/division MUST set numericTolerance
 *   (use 0 for exact scale-insensitive match, or a small epsilon for rounding).
 *   With numericTolerance:null the comparison falls back to strict ===, so
 *   "2.50" and "2.5" are treated as unequal strings — a silent false negative.
 * - Multiset comparison uses a stable JSON-serialized canonical string per row,
 *   then sorts both sides and compares in order — preserving duplicates.
 */

import type { QueryResult } from '../db/types.ts';
import type { GradeResult } from './types.ts';

export interface CompareOptions {
  orderMatters: boolean;
  checkColumnNames: boolean;
  numericTolerance: number | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract a row's values in the order declared by fields[].
 * Using fields order (not Object.keys) ensures positional comparison is stable
 * even when the underlying Record has a different insertion order.
 */
function rowToValueArray(
  row: Record<string, unknown>,
  fields: QueryResult['fields'],
): unknown[] {
  return fields.map((f) => row[f.name]);
}

/**
 * True when a value should be treated as numeric for tolerance comparison.
 * Covers both JS `number` (PGlite delivers COUNT/SUM/bigint/int4 as number)
 * and JS `string` that encodes a number (PGlite delivers numeric/decimal/AVG
 * as a scaled string such as "2.5000000000000000" or "2.50").
 */
function isNumeric(v: unknown): v is number | string {
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'string') return !Number.isNaN(Number(v)) && v.trim() !== '';
  return false;
}

/**
 * Compare two individual values, applying numericTolerance when both sides
 * are numeric (including numeric-string). Falls back to strict equality.
 */
function valuesEqual(
  a: unknown,
  b: unknown,
  tolerance: number | null,
): boolean {
  if (tolerance !== null && isNumeric(a) && isNumeric(b)) {
    return Math.abs(Number(a) - Number(b)) <= tolerance;
  }
  // Strict equality for everything else (including null, boolean, date strings).
  return a === b;
}

/**
 * Compare two value arrays element-by-element.
 */
function rowValuesEqual(
  a: unknown[],
  b: unknown[],
  tolerance: number | null,
): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => valuesEqual(v, b[i], tolerance));
}

/**
 * Produce a stable canonical string for a row (for multiset sorting).
 * Tolerance is NOT applied here — the sort key uses exact string form.
 * Rows that differ only within tolerance will get different canonical keys
 * and land in different sort positions; the Pass-2 fuzzy scan in
 * compareMultiset resolves those near-misses after the exact Pass-1 walk.
 */
function canonicalRowKey(values: unknown[]): string {
  return JSON.stringify(values);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compare two QueryResult sets honoring the given CompareOptions.
 *
 * Returns { passed: true } when the sets are considered equal, or
 * { passed: false, message, detail } with a learner-facing explanation.
 */
export function compareResultSets(
  actual: QueryResult,
  expected: QueryResult,
  options: CompareOptions,
): GradeResult {
  const { orderMatters, checkColumnNames, numericTolerance } = options;

  // ------------------------------------------------------------------
  // 1. Column count check (always — regardless of checkColumnNames)
  // ------------------------------------------------------------------
  if (actual.fields.length !== expected.fields.length) {
    return {
      passed: false,
      message:
        `Your query returned ${actual.fields.length} column(s), ` +
        `but the expected result has ${expected.fields.length} column(s). ` +
        `Check your SELECT list.`,
      detail: {
        kind: 'column-count',
        actualCount: actual.fields.length,
        expectedCount: expected.fields.length,
      },
    };
  }

  // ------------------------------------------------------------------
  // 2. Column name check (only when requested)
  // ------------------------------------------------------------------
  if (checkColumnNames) {
    const actualNames = actual.fields.map((f) => f.name);
    const expectedNames = expected.fields.map((f) => f.name);
    const mismatch = actualNames.some((n, i) => n !== expectedNames[i]);
    if (mismatch) {
      return {
        passed: false,
        message:
          `Column names do not match. ` +
          `Got: [${actualNames.join(', ')}] — ` +
          `expected: [${expectedNames.join(', ')}]. ` +
          `Check your column aliases.`,
        detail: {
          kind: 'column-names',
          actual: actualNames,
          expected: expectedNames,
        },
      };
    }
  }

  // ------------------------------------------------------------------
  // 3. Extract value arrays (positional, by fields[] order)
  // ------------------------------------------------------------------
  const actualRows = actual.rows.map((r) => rowToValueArray(r, actual.fields));
  const expectedRows = expected.rows.map((r) =>
    rowToValueArray(r, expected.fields),
  );

  // ------------------------------------------------------------------
  // 4. Row count shortcut — always fail early on count mismatch
  // ------------------------------------------------------------------
  if (actualRows.length !== expectedRows.length) {
    return {
      passed: false,
      message:
        `Your query returned ${actualRows.length} row(s), ` +
        `but ${expectedRows.length} row(s) were expected.`,
    };
  }

  // ------------------------------------------------------------------
  // 5. Row comparison
  // ------------------------------------------------------------------
  if (orderMatters) {
    return compareOrdered(actualRows, expectedRows, numericTolerance);
  } else {
    return compareMultiset(actualRows, expectedRows, numericTolerance);
  }
}

// ---------------------------------------------------------------------------
// Ordered comparison
// ---------------------------------------------------------------------------

function compareOrdered(
  actualRows: unknown[][],
  expectedRows: unknown[][],
  tolerance: number | null,
): GradeResult {
  for (let i = 0; i < expectedRows.length; i++) {
    if (!rowValuesEqual(actualRows[i], expectedRows[i], tolerance)) {
      return {
        passed: false,
        message:
          `Row ${i + 1} does not match. ` +
          `Got [${actualRows[i].join(', ')}] — ` +
          `expected [${expectedRows[i].join(', ')}]. ` +
          `Check your ORDER BY clause or values.`,
        detail: {
          kind: 'row-order',
          index: i,
          actualRow: actualRows[i],
          expectedRow: expectedRows[i],
        },
      };
    }
  }
  return { passed: true };
}

// ---------------------------------------------------------------------------
// Multiset (unordered) comparison
// ---------------------------------------------------------------------------

/**
 * Multiset comparison that preserves duplicates.
 *
 * Strategy:
 * 1. Sort both sides by canonical key (exact string comparison).
 * 2. Walk both sorted arrays simultaneously, consuming equal pairs.
 * 3. If tolerance is set, a second fuzzy-match pass resolves near-miss rows
 *    that landed in different sort positions.
 *
 * This handles the common case (no tolerance) in O(n log n). When tolerance
 * is active we do a second O(n²) pass over remaining unmatched rows — n is
 * small for classroom exercises.
 */
function compareMultiset(
  actualRows: unknown[][],
  expectedRows: unknown[][],
  tolerance: number | null,
): GradeResult {
  // Sort by canonical string for reproducible comparison.
  const sortedActual = [...actualRows].sort((a, b) =>
    canonicalRowKey(a).localeCompare(canonicalRowKey(b)),
  );
  const sortedExpected = [...expectedRows].sort((a, b) =>
    canonicalRowKey(a).localeCompare(canonicalRowKey(b)),
  );

  // Tracks which sorted-actual rows have been matched.
  const matchedActual = new Array<boolean>(sortedActual.length).fill(false);
  // Tracks which sorted-expected rows have been matched.
  const matchedExpected = new Array<boolean>(sortedExpected.length).fill(false);

  // Pass 1: exact key match (covers zero-tolerance case fully).
  let ai = 0;
  let ei = 0;
  while (ai < sortedActual.length && ei < sortedExpected.length) {
    const cmp = canonicalRowKey(sortedActual[ai]).localeCompare(
      canonicalRowKey(sortedExpected[ei]),
    );
    if (cmp === 0) {
      matchedActual[ai] = true;
      matchedExpected[ei] = true;
      ai++;
      ei++;
    } else if (cmp < 0) {
      ai++;
    } else {
      ei++;
    }
  }

  // Pass 2 (tolerance only): fuzzy-match unmatched rows.
  // F3 assumption: greedy first-match is correct when tolerance is small and
  // non-overlapping (e.g. numericTolerance:0 or a tiny epsilon for AVG).
  // A coarse tolerance over rows with overlapping numeric ranges could
  // double-resolve — do not use wide tolerances in multiset exercises.
  if (tolerance !== null) {
    for (let e = 0; e < sortedExpected.length; e++) {
      if (matchedExpected[e]) continue;
      for (let a = 0; a < sortedActual.length; a++) {
        if (matchedActual[a]) continue;
        if (rowValuesEqual(sortedActual[a], sortedExpected[e], tolerance)) {
          matchedActual[a] = true;
          matchedExpected[e] = true;
          break;
        }
      }
    }
  }

  const missingRows = sortedExpected.filter((_, i) => !matchedExpected[i]);
  const extraRows = sortedActual.filter((_, i) => !matchedActual[i]);

  if (missingRows.length === 0 && extraRows.length === 0) {
    return { passed: true };
  }

  const parts: string[] = [];
  if (missingRows.length > 0) {
    parts.push(
      `Missing row(s) from your result: ` +
        missingRows.map((r) => `[${r.join(', ')}]`).join(', '),
    );
  }
  if (extraRows.length > 0) {
    parts.push(
      `Extra row(s) in your result that were not expected: ` +
        extraRows.map((r) => `[${r.join(', ')}]`).join(', '),
    );
  }

  return {
    passed: false,
    message: parts.join(' | '),
    detail: {
      kind: 'multiset-mismatch',
      missing: missingRows,
      extra: extraRows,
    },
  };
}
