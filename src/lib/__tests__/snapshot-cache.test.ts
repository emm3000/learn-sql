/**
 * Unit tests for snapshot-cache.ts (M1.6 / NFR-5).
 *
 * The vitest environment is Node, which has no IndexedDB. The IndexedDB-backed
 * functions (getSnapshot / putSnapshot) therefore degrade to no-ops/null and
 * cannot be exercised here without adding fake-indexeddb as a new dependency
 * (which is not permitted — deps are pinned and must not grow without an ADR).
 *
 * What IS covered here:
 *  - hashSeed is deterministic: same input always yields the same hash.
 *  - hashSeed is sensitive: a one-character change produces a different hash.
 *  - hashSeed handles edge cases: empty string, Unicode.
 *  - SSR degradation: getSnapshot resolves null and putSnapshot is a no-op
 *    when indexedDB is absent (which it is in Node).
 *
 * The full cache round-trip (put → get → hit) is covered by the e2e smoke
 * test that runs against the production build in a real browser (M7.3).
 */

import { describe, it, expect } from 'vitest';
import { hashSeed, getSnapshot, putSnapshot, deleteSnapshot } from '../db/snapshot-cache.ts';

describe('M1.6 — snapshot-cache', () => {
  describe('hashSeed', () => {
    it('returns an 8-character hex string', () => {
      const h = hashSeed('SELECT 1');
      expect(h).toMatch(/^[0-9a-f]{8}$/);
    });

    it('is deterministic — same input yields identical hash on repeated calls', () => {
      const sql = 'CREATE TABLE t (id SERIAL PRIMARY KEY);';
      expect(hashSeed(sql)).toBe(hashSeed(sql));
      expect(hashSeed(sql)).toBe(hashSeed(sql));
    });

    it('is sensitive — a single character change produces a different hash', () => {
      const a = hashSeed('SELECT 1');
      const b = hashSeed('SELECT 2');
      expect(a).not.toBe(b);
    });

    it('handles the empty string without throwing', () => {
      expect(() => hashSeed('')).not.toThrow();
      // Empty string should produce a fixed, deterministic result.
      expect(hashSeed('')).toBe(hashSeed(''));
    });

    it('handles Unicode characters without throwing', () => {
      expect(() => hashSeed('-- émojis 🐘 and accents')).not.toThrow();
      expect(hashSeed('-- 🐘')).toBe(hashSeed('-- 🐘'));
    });

    it('produces different hashes for distinct seed SQL strings', () => {
      const seeds = [
        'CREATE TABLE employees (id SERIAL);',
        'CREATE TABLE departments (id SERIAL);',
        'INSERT INTO employees VALUES (1);',
      ];
      const hashes = seeds.map(hashSeed);
      const unique = new Set(hashes);
      expect(unique.size).toBe(seeds.length);
    });
  });

  describe('SSR degradation (Node / no IndexedDB)', () => {
    it('getSnapshot resolves to null when indexedDB is absent', async () => {
      // In the Node/Vitest environment `indexedDB` is not defined, so
      // getSnapshot should return null without throwing.
      const result = await getSnapshot('any-key');
      expect(result).toBeNull();
    });

    it('putSnapshot resolves without throwing when indexedDB is absent', async () => {
      // Should be a no-op and not reject.
      await expect(putSnapshot('any-key', new Blob(['test']))).resolves.toBeUndefined();
    });

    it('deleteSnapshot resolves without throwing when indexedDB is absent', async () => {
      // Should be a no-op and not reject.
      await expect(deleteSnapshot('any-key')).resolves.toBeUndefined();
    });
  });
});
