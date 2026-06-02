import type { QueryError } from './types.ts';

/** Normalize an unknown thrown value into a structured QueryError. */
export function normalizeError(err: unknown): QueryError {
  if (err instanceof Error) {
    const e = err as Error & {
      code?: string;
      severity?: string;
      detail?: string;
      hint?: string;
      position?: string;
    };
    return {
      message: e.message,
      code: e.code,
      severity: e.severity,
      detail: e.detail,
      hint: e.hint,
      position: e.position,
    };
  }
  return { message: String(err) };
}
