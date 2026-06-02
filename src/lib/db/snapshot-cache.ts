/**
 * snapshot-cache.ts — IndexedDB-backed snapshot store for PGlite clusters.
 *
 * Stores a gzip-compressed PGlite data-dir blob keyed by a hash of the seed
 * SQL. A cache hit lets DbClient skip the full initdb + seed sequence on
 * repeat visits (~495 ms → ~108 ms, measured on PGlite 0.4.6).
 *
 * Design constraints:
 *  - No external dependencies. Raw IndexedDB API only (idb-keyval etc. are
 *    not in the pinned dependency set — see docs/adr/ for the rationale).
 *  - SSR-safe: guards on `typeof indexedDB !== 'undefined'` so the module
 *    can be imported in Astro's Node build step without throwing.
 *  - All errors are swallowed. A cache failure always falls back to the
 *    normal seed path; it must never break the playground.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DB_NAME = 'pg-playground';
const STORE_NAME = 'snapshots';
const DB_VERSION = 1;

// ---------------------------------------------------------------------------
// Seed hash
// ---------------------------------------------------------------------------

/**
 * FNV-1a 32-bit hash of a string, returned as a hex string.
 *
 * Properties that matter here:
 *  - Deterministic across calls in the same runtime (we only use it as a
 *    stable key; cross-browser bit-equivalence is not required).
 *  - Changes meaningfully when the input changes — any seed SQL edit
 *    produces a different key, which busts the cached snapshot.
 *  - Tiny implementation, no allocations beyond the string traversal.
 *
 * Reference: http://isthe.com/chongo/tech/comp/fnv/#FNV-1a
 */
export function hashSeed(seedSql: string): string {
  // FNV-1a 32-bit constants.
  const FNV_PRIME = 0x01000193;
  const FNV_OFFSET_BASIS = 0x811c9dc5;

  let hash = FNV_OFFSET_BASIS;

  for (let i = 0; i < seedSql.length; i++) {
    // XOR with the lower byte of the char code, then multiply.
    // Bitwise ops in JS work on signed 32-bit ints; `>>> 0` keeps unsigned.
    hash = (hash ^ seedSql.charCodeAt(i)) >>> 0;
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }

  return hash.toString(16).padStart(8, '0');
}

// ---------------------------------------------------------------------------
// IndexedDB helpers
// ---------------------------------------------------------------------------

/**
 * Open (or create) the snapshot IndexedDB database.
 * Returns a rejected promise if IndexedDB is not available or is blocked.
 */
function openDb(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    req.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    req.onerror = () => {
      reject(req.error);
    };

    // A blocked open means another tab holds the DB open at an older version.
    // Reject so callers' try/catch degrade to null/no-op.
    req.onblocked = () => {
      reject(req.error ?? new Error('indexeddb blocked'));
    };
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Retrieve a cached snapshot blob by key.
 *
 * @param key  - The cache key, typically `hashSeed(seedSql)`.
 * @returns    The stored Blob, or `null` on a miss or any error.
 */
export async function getSnapshot(key: string): Promise<Blob | null> {
  if (typeof indexedDB === 'undefined') return null;

  try {
    const db = await openDb();
    return await new Promise<Blob | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result as Blob | undefined;
        resolve(result ?? null);
      };

      req.onerror = () => {
        db.close();
        resolve(null);
      };

      tx.oncomplete = () => {
        db.close();
      };

      // Guard against a transaction abort that fires without req.onerror —
      // would otherwise leave the promise pending forever.
      tx.onerror = () => {
        db.close();
        resolve(null);
      };

      tx.onabort = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    // IndexedDB unavailable or blocked — fall back gracefully.
    return null;
  }
}

/**
 * Persist a snapshot blob under the given key.
 *
 * Errors are silently swallowed: a write failure is non-fatal because the
 * next visit will simply take the slow path again.
 *
 * @param key  - The cache key, typically `hashSeed(seedSql)`.
 * @param blob - The gzip-compressed data-dir Blob from `pg.dumpDataDir('gzip')`.
 */
export async function putSnapshot(key: string, blob: Blob): Promise<void> {
  if (typeof indexedDB === 'undefined') return;

  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(blob, key);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        resolve(); // swallow — non-fatal
      };

      tx.onabort = () => {
        db.close();
        resolve(); // swallow — non-fatal
      };
    });
  } catch {
    // Swallow — cache write failure must not propagate.
  }
}

/**
 * Evict a snapshot entry by key.
 *
 * Used by DbClient to purge a corrupt or unrestorable entry after a failed
 * cache-hit restore. Errors are silently swallowed: the eviction is
 * best-effort. If it fails the entry remains stale, but the next visit will
 * just degrade to the MISS path again via the HIT try/catch.
 *
 * @param key - The cache key to delete, typically `hashSeed(seedSql)`.
 */
export async function deleteSnapshot(key: string): Promise<void> {
  if (typeof indexedDB === 'undefined') return;

  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        resolve(); // swallow — non-fatal
      };

      tx.onabort = () => {
        db.close();
        resolve(); // swallow — non-fatal
      };
    });
  } catch {
    // Swallow — eviction failure must not propagate.
  }
}
