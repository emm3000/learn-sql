// Exercise schema — defined with standalone zod (v4), NOT astro/zod.
// This schema is used outside Astro's content pipeline (grading engine, tests,
// exercise authoring), so it does not need Astro's re-exported z.
// Both zod instances are v4 and share the same API; they just live at different
// import paths. If you ever need to use exercises inside a Content Collection,
// re-import z from 'astro/zod' in content.config.ts instead.
import { z } from 'zod';

const compareOptionsSchema = z.object({
  /** When true, row order must match exactly (i.e. the query requires ORDER BY). */
  orderMatters: z.boolean(),
  /** When true, column names/aliases must match. Usually false for beginners. */
  checkColumnNames: z.boolean(),
  /**
   * Allowed absolute difference for numeric comparisons.
   * Set a small value (e.g. 0.001) for AVG or division results.
   * Null means exact equality is required.
   */
  numericTolerance: z.number().nonnegative().nullable(),
});

export const exerciseSchema = z.object({
  /** Stable, unique identifier for this exercise across all lessons. */
  id: z.string().min(1),
  /** The task description shown to the learner — one concept, beginner voice. */
  prompt: z.string().min(1),
  /** Optional SQL pre-filled in the editor when the learner opens the exercise. */
  starterSql: z.string().optional(),
  /**
   * The reference solution SQL. Required for all exercises.
   * For gradeMode 'result': run against the DB and compare rows to the learner's output.
   * For gradeMode 'state': run as the reference mutation; verificationSql then reads
   * the resulting state, which is compared to the learner's state.
   */
  expectedSql: z.string().min(1),
  /**
   * 'result' — for reads (SELECT). Grader compares row sets.
   * 'state'  — for mutations (INSERT/UPDATE/DELETE). Grader compares DB state after.
   */
  gradeMode: z.enum(['result', 'state']),
  /**
   * SQL query that reads the relevant state after a mutation.
   * Required when gradeMode is 'state'.
   */
  verificationSql: z.string().optional(),
  compareOptions: compareOptionsSchema,
}).refine(
  (ex) => ex.gradeMode !== 'state' || ex.verificationSql !== undefined,
  { message: "verificationSql is required when gradeMode is 'state'" },
);

/** Inferred TypeScript type for a single exercise. */
export type Exercise = z.infer<typeof exerciseSchema>;
