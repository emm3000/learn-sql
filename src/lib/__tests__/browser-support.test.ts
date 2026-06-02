/**
 * Unit tests for isPlaygroundSupported() (M7.5 / NFR-9).
 *
 * The vitest environment is Node, so WebAssembly and Worker globals may or may
 * not be present. Each test case explicitly controls both globals via
 * globalThis and restores the originals in afterEach to keep tests isolated.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { isPlaygroundSupported } from '../db/browser-support.ts';

// Saved originals restored after each test.
const originalWebAssembly = (globalThis as Record<string, unknown>).WebAssembly;
const originalWorker = (globalThis as Record<string, unknown>).Worker;

afterEach(() => {
  if (originalWebAssembly === undefined) {
    delete (globalThis as Record<string, unknown>).WebAssembly;
  } else {
    (globalThis as Record<string, unknown>).WebAssembly = originalWebAssembly;
  }

  if (originalWorker === undefined) {
    delete (globalThis as Record<string, unknown>).Worker;
  } else {
    (globalThis as Record<string, unknown>).Worker = originalWorker;
  }
});

/** Minimal stub that satisfies the typeof checks in isPlaygroundSupported. */
const wasmStub = { instantiate: () => Promise.resolve() };
/** Minimal Worker stub — just needs to be a function. */
function WorkerStub() {}

describe('M7.5 — isPlaygroundSupported', () => {
  it('returns true when both WebAssembly and Worker are present', () => {
    (globalThis as Record<string, unknown>).WebAssembly = wasmStub;
    (globalThis as Record<string, unknown>).Worker = WorkerStub;

    expect(isPlaygroundSupported()).toBe(true);
  });

  it('returns false when WebAssembly is absent', () => {
    delete (globalThis as Record<string, unknown>).WebAssembly;
    (globalThis as Record<string, unknown>).Worker = WorkerStub;

    expect(isPlaygroundSupported()).toBe(false);
  });

  it('returns false when WebAssembly is present but not an object', () => {
    (globalThis as Record<string, unknown>).WebAssembly = 'not-an-object';
    (globalThis as Record<string, unknown>).Worker = WorkerStub;

    expect(isPlaygroundSupported()).toBe(false);
  });

  it('returns false when WebAssembly.instantiate is not a function', () => {
    (globalThis as Record<string, unknown>).WebAssembly = { instantiate: null };
    (globalThis as Record<string, unknown>).Worker = WorkerStub;

    expect(isPlaygroundSupported()).toBe(false);
  });

  it('returns false when Worker is absent', () => {
    (globalThis as Record<string, unknown>).WebAssembly = wasmStub;
    delete (globalThis as Record<string, unknown>).Worker;

    expect(isPlaygroundSupported()).toBe(false);
  });

  it('returns false when Worker is not a function', () => {
    (globalThis as Record<string, unknown>).WebAssembly = wasmStub;
    (globalThis as Record<string, unknown>).Worker = {};

    expect(isPlaygroundSupported()).toBe(false);
  });

  it('returns false when both WebAssembly and Worker are absent', () => {
    delete (globalThis as Record<string, unknown>).WebAssembly;
    delete (globalThis as Record<string, unknown>).Worker;

    expect(isPlaygroundSupported()).toBe(false);
  });
});
