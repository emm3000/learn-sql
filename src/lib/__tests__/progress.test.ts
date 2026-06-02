/**
 * Progress module tests (M4.4).
 *
 * The vitest environment is Node (no DOM), so there is no global localStorage.
 * Each test group injects a minimal in-memory localStorage mock onto globalThis
 * and removes it afterward to keep tests isolated.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  markExerciseComplete,
  isExerciseComplete,
  getCompletedExercises,
} from '../progress/progress.ts';

// ── In-memory localStorage mock ───────────────────────────────────────────────

function makeLocalStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
  } as Storage;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pg-playground:progress:v1';

function injectMock(): Storage {
  const mock = makeLocalStorageMock();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).localStorage = mock;
  return mock;
}

function removeMock(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).localStorage;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('progress — mark and check', () => {
  beforeEach(() => injectMock());
  afterEach(() => removeMock());

  it('markExerciseComplete → isExerciseComplete returns true', () => {
    markExerciseComplete('01-select', 'l01-e01-select-all-customers');
    expect(isExerciseComplete('01-select', 'l01-e01-select-all-customers')).toBe(true);
  });

  it('unknown exercise → isExerciseComplete returns false', () => {
    expect(isExerciseComplete('01-select', 'does-not-exist')).toBe(false);
  });

  it('unknown lesson → isExerciseComplete returns false', () => {
    markExerciseComplete('01-select', 'l01-e01-select-all-customers');
    expect(isExerciseComplete('99-unknown', 'l01-e01-select-all-customers')).toBe(false);
  });

  it('markExerciseComplete is idempotent — second call does not overwrite passedAt', () => {
    const mock = injectMock(); // fresh mock for this check
    markExerciseComplete('01-select', 'l01-e01-select-all-customers');
    const rawAfterFirst = mock.getItem(STORAGE_KEY)!;
    const firstTimestamp = (JSON.parse(rawAfterFirst) as Record<string, Record<string, { passedAt: string }>>)[
      '01-select'
    ]['l01-e01-select-all-customers'].passedAt;

    markExerciseComplete('01-select', 'l01-e01-select-all-customers');
    const rawAfterSecond = mock.getItem(STORAGE_KEY)!;
    const secondTimestamp = (JSON.parse(rawAfterSecond) as Record<string, Record<string, { passedAt: string }>>)[
      '01-select'
    ]['l01-e01-select-all-customers'].passedAt;

    expect(secondTimestamp).toBe(firstTimestamp);
  });
});

describe('progress — getCompletedExercises', () => {
  beforeEach(() => injectMock());
  afterEach(() => removeMock());

  it('returns empty Set when no exercises completed', () => {
    const result = getCompletedExercises('01-select');
    expect(result).toBeInstanceOf(Set);
    expect(result.size).toBe(0);
  });

  it('returns Set with completed exercise ids', () => {
    markExerciseComplete('01-select', 'l01-e01-select-all-customers');
    markExerciseComplete('01-select', 'l01-e02-select-ordered');
    const result = getCompletedExercises('01-select');
    expect(result.has('l01-e01-select-all-customers')).toBe(true);
    expect(result.has('l01-e02-select-ordered')).toBe(true);
    expect(result.size).toBe(2);
  });

  it('per-lesson isolation — completing in one lesson does not affect another', () => {
    markExerciseComplete('01-select', 'l01-e01-select-all-customers');
    const selectCompleted = getCompletedExercises('01-select');
    const insertCompleted = getCompletedExercises('02-insert');
    expect(selectCompleted.size).toBe(1);
    expect(insertCompleted.size).toBe(0);
  });
});

describe('progress — corrupt JSON recovery', () => {
  beforeEach(() => injectMock());
  afterEach(() => removeMock());

  it('corrupt JSON in storage recovers to empty — does not throw', () => {
    localStorage.setItem(STORAGE_KEY, '{ not valid json !!!');
    expect(() => isExerciseComplete('01-select', 'l01-e01')).not.toThrow();
    expect(isExerciseComplete('01-select', 'l01-e01')).toBe(false);
    expect(getCompletedExercises('01-select').size).toBe(0);
  });

  it('non-object JSON (array) in storage recovers to empty', () => {
    localStorage.setItem(STORAGE_KEY, '[1, 2, 3]');
    expect(isExerciseComplete('01-select', 'l01-e01')).toBe(false);
  });

  it('after corrupt recovery, subsequent marks work correctly', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    markExerciseComplete('01-select', 'l01-e01-select-all-customers');
    expect(isExerciseComplete('01-select', 'l01-e01-select-all-customers')).toBe(true);
  });
});

describe('progress — SSR-safe (no localStorage)', () => {
  // Do NOT inject a mock here — we test the path where localStorage is absent.

  it('isExerciseComplete does not throw when localStorage is unavailable', () => {
    expect(() => isExerciseComplete('01-select', 'l01-e01')).not.toThrow();
    expect(isExerciseComplete('01-select', 'l01-e01')).toBe(false);
  });

  it('markExerciseComplete does not throw when localStorage is unavailable', () => {
    expect(() =>
      markExerciseComplete('01-select', 'l01-e01'),
    ).not.toThrow();
  });

  it('getCompletedExercises returns empty Set when localStorage is unavailable', () => {
    const result = getCompletedExercises('01-select');
    expect(result).toBeInstanceOf(Set);
    expect(result.size).toBe(0);
  });
});
