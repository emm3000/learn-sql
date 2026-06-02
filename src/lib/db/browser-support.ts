/**
 * Browser capability detection for the SQL Playground.
 *
 * PGlite runs inside a Web Worker and is compiled to WebAssembly — both are
 * hard requirements with no fallback. NFR-9 requires a clear message when
 * either capability is absent so learners are not left with a broken, silent UI.
 *
 * This module is intentionally side-effect-free and SSR-safe: the `typeof`
 * guards handle missing globals without referencing `window` or any browser-
 * only API at import time.
 */

/**
 * Returns `true` only when both WebAssembly and Web Workers are available
 * in the current runtime. Returns `false` in any other case, including SSR
 * (Node/Deno) where neither global is present.
 */
export function isPlaygroundSupported(): boolean {
  const hasWasm =
    typeof WebAssembly === 'object' &&
    typeof WebAssembly.instantiate === 'function';

  const hasWorker = typeof Worker === 'function';

  return hasWasm && hasWorker;
}
