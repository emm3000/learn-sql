/**
 * Parse CREATE TABLE blocks from a SQL seed string to build a schema summary
 * for the rail. Reads the real seed so the rail never lies.
 *
 * Rules:
 * - One block per table, in source order.
 * - For each column line: extract identifier + first type token.
 * - Skip table-level constraint lines (PRIMARY KEY / FOREIGN KEY / UNIQUE /
 *   CHECK / CONSTRAINT at the start of a trimmed line).
 */

export interface Column {
  name: string;
  type: string;
}

export interface TableSchema {
  table: string;
  columns: Column[];
}

/** Constraint-only line prefixes to skip (case-insensitive). */
const CONSTRAINT_PREFIXES = [
  'primary key',
  'foreign key',
  'unique',
  'check',
  'constraint',
];

function isConstraintLine(line: string): boolean {
  const lower = line.trimStart().toLowerCase();
  return CONSTRAINT_PREFIXES.some((p) => lower.startsWith(p));
}

/**
 * Extract the SQL identifier from a column definition line.
 * Handles quoted identifiers ("name") and unquoted identifiers.
 */
function parseColumnLine(line: string): { name: string; type: string } | null {
  const trimmed = line.trim();
  if (!trimmed || isConstraintLine(trimmed)) return null;

  // Remove trailing comma
  const raw = trimmed.replace(/,\s*$/, '').trim();
  if (!raw) return null;

  let name: string;
  let rest: string;

  if (raw.startsWith('"')) {
    // Quoted identifier
    const closeQuote = raw.indexOf('"', 1);
    if (closeQuote === -1) return null;
    name = raw.slice(1, closeQuote);
    rest = raw.slice(closeQuote + 1).trimStart();
  } else {
    // Unquoted identifier: first token
    const spaceIdx = raw.search(/\s/);
    if (spaceIdx === -1) return null;
    name = raw.slice(0, spaceIdx);
    rest = raw.slice(spaceIdx).trimStart();
  }

  if (!name || !rest) return null;

  // Type: everything up to the first space/paren after the type token,
  // but keep parenthesised precision (e.g. numeric(10,2)).
  const typeMatch = rest.match(/^([a-zA-Z_][a-zA-Z0-9_]*(?:\([^)]*\))?)/);
  if (!typeMatch) return null;

  return { name, type: typeMatch[1].toLowerCase() };
}

export function parseSeedSchema(seedSql: string): TableSchema[] {
  const tables: TableSchema[] = [];

  // Match each CREATE TABLE block: from "CREATE TABLE name (" to the closing ");"
  const blockRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([^;]*?)\)\s*;/gis;

  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(seedSql)) !== null) {
    const tableName = match[1];
    const body = match[2];

    const columns: Column[] = [];
    for (const line of body.split('\n')) {
      const col = parseColumnLine(line);
      if (col) columns.push(col);
    }

    tables.push({ table: tableName, columns });
  }

  return tables;
}
