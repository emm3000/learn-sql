/**
 * Grading result — discriminated union.
 *
 * Consumers check `passed` first, then access `message` only on failure.
 * `detail` is optional structured context for rendering richer feedback in
 * the future without breaking the current discriminant.
 */
export type GradeResult =
  | { passed: true }
  | { passed: false; message: string; detail?: GradeDetail };

/** Optional structured detail attached to a failed GradeResult. */
export type GradeDetail =
  | { kind: 'column-count'; actualCount: number; expectedCount: number }
  | { kind: 'column-names'; actual: string[]; expected: string[] }
  | {
      kind: 'row-order';
      index: number;
      actualRow: unknown[];
      expectedRow: unknown[];
    }
  | { kind: 'multiset-mismatch'; missing: unknown[][]; extra: unknown[][] }
  | { kind: 'query-error'; errorMessage: string }
  | { kind: 'missing-verification-sql' };
