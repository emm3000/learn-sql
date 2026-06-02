/**
 * PGlite engine tests (M1).
 *
 * Tests run against PGlite directly (no Worker) because Web Workers are not
 * available in the Node/Vitest environment. The Worker + PGliteWorker combo
 * is exercised in the browser only.
 *
 * What is covered:
 *  - SELECT returns seeded rows with the correct field shape
 *  - A mutation (INSERT) takes effect and is queryable
 *  - An invalid query yields a structured error (via normalizeError)
 *  - Reset: DROP SCHEMA + reseed restores state after a destructive mutation
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import seedSql from '../../../seed/classic_company.sql?raw';
import { normalizeError } from '../db/normalize-error.ts';

let db: PGlite;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(seedSql);
});

afterAll(async () => {
  await db.close();
});

describe('M1 — PGlite engine', () => {
  describe('SELECT (M1.2, M1.3)', () => {
    it('returns seeded rows from the departments table', async () => {
      const res = await db.query<{ name: string; location: string }>(
        'SELECT name, location FROM departments ORDER BY id',
      );

      expect(res.rows).toHaveLength(4);
      expect(res.rows[0]).toEqual({ name: 'Engineering', location: 'Lima' });
      expect(res.rows[1]).toEqual({ name: 'Sales', location: 'Bogota' });
    });

    it('returns correct field descriptors', async () => {
      const res = await db.query('SELECT name, location FROM departments LIMIT 1');

      expect(res.fields).toHaveLength(2);
      expect(res.fields[0]).toMatchObject({ name: 'name' });
      expect(res.fields[1]).toMatchObject({ name: 'location' });
      // dataTypeID is a number (OID from Postgres catalog)
      expect(typeof res.fields[0].dataTypeID).toBe('number');
    });

    it('returns seeded employees with correct column shape', async () => {
      const res = await db.query<{ first_name: string; last_name: string; job_title: string }>(
        'SELECT first_name, last_name, job_title FROM employees ORDER BY id LIMIT 1',
      );

      expect(res.rows[0]).toEqual({
        first_name: 'Ana',
        last_name: 'Torres',
        job_title: 'Engineering Manager',
      });
    });
  });

  describe('Mutation (M1.2)', () => {
    it('INSERT is reflected in a subsequent SELECT', async () => {
      await db.exec(`
        INSERT INTO customers (first_name, last_name, email, city)
        VALUES ('Test', 'User', 'test.user@example.com', 'TestCity')
      `);

      const res = await db.query<{ first_name: string }>(
        "SELECT first_name FROM customers WHERE email = 'test.user@example.com'",
      );

      expect(res.rows).toHaveLength(1);
      expect(res.rows[0].first_name).toBe('Test');
    });
  });

  describe('Error handling (M1.2)', () => {
    it('normalizes a DatabaseError into a structured QueryError', async () => {
      let caught: unknown;
      try {
        await db.query('SELECT * FROM nonexistent_table_xyz');
      } catch (err) {
        caught = err;
      }

      expect(caught).toBeDefined();
      const normalized = normalizeError(caught);
      expect(normalized.message).toMatch(/nonexistent_table_xyz/i);
      expect(typeof normalized.message).toBe('string');
    });

    it('normalizes a syntax error', async () => {
      let caught: unknown;
      try {
        await db.query('THIS IS NOT SQL');
      } catch (err) {
        caught = err;
      }

      const normalized = normalizeError(caught);
      expect(normalized.message.length).toBeGreaterThan(0);
    });
  });

  describe('Reset (M1.4)', () => {
    it('DROP SCHEMA + reseed restores the original row count', async () => {
      // Confirm pre-reset state: customers has 4 seeded rows + 1 inserted above
      const before = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM customers');
      expect(Number(before.rows[0].count)).toBe(5);

      // Simulate DbClient.reset
      await db.exec('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
      await db.exec(seedSql);

      // After reset: back to the 4 seeded rows
      const after = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM customers');
      expect(Number(after.rows[0].count)).toBe(4);
    });

    it('reset restores the employees table to its seeded state', async () => {
      const res = await db.query<{ first_name: string }>(
        'SELECT first_name FROM employees ORDER BY id LIMIT 1',
      );
      expect(res.rows[0].first_name).toBe('Ana');
    });
  });
});
