/** Field descriptor returned alongside query rows. */
export interface QueryField {
  name: string;
  dataTypeID: number;
}

/** Successful query result. */
export interface QueryResult {
  rows: Record<string, unknown>[];
  fields: QueryField[];
  affectedRows?: number;
}

/** Structured error returned when a query fails (never thrown). */
export interface QueryError {
  message: string;
  code?: string;
  severity?: string;
  detail?: string;
  hint?: string;
  position?: string;
}

/**
 * Discriminated union returned by DbClient.runSql.
 * Always check `ok` before accessing `result` or `error`.
 */
export type RunSqlResult =
  | { ok: true; result: QueryResult }
  | { ok: false; error: QueryError };
