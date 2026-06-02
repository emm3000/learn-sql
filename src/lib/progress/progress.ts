/**
 * Progress persistence — ADR-0004.
 *
 * Stores learner exercise completions in localStorage under a single versioned
 * key. All reads return empty / false in SSR/Node environments where localStorage
 * is not available; all writes are no-ops there.
 *
 * Storage shape (JSON):
 *   {
 *     "<lessonSlug>": {
 *       "<exerciseId>": { passedAt: "<ISO string>" }
 *     }
 *   }
 */

const STORAGE_KEY = 'pg-playground:progress:v1';

type ExerciseEntry = { passedAt: string };
type ProgressStore = Record<string, Record<string, ExerciseEntry>>;

// ── localStorage helpers (SSR-safe) ───────────────────────────────────────────

function isLocalStorageAvailable(): boolean {
  return typeof localStorage !== 'undefined';
}

function readStore(): ProgressStore {
  if (!isLocalStorageAvailable()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }
    return parsed as ProgressStore;
  } catch {
    // Corrupt JSON — treat as empty (recover silently).
    return {};
  }
}

function writeStore(store: ProgressStore): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota exceeded or sandboxed — ignore silently.
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Mark an exercise as completed for a given lesson.
 * Idempotent — calling it again does not reset the original timestamp.
 */
export function markExerciseComplete(
  lessonSlug: string,
  exerciseId: string,
): void {
  const store = readStore();
  const lesson = store[lessonSlug] ?? {};
  if (!lesson[exerciseId]) {
    lesson[exerciseId] = { passedAt: new Date().toISOString() };
  }
  store[lessonSlug] = lesson;
  writeStore(store);
}

/**
 * Returns true if the exercise has been marked complete.
 */
export function isExerciseComplete(
  lessonSlug: string,
  exerciseId: string,
): boolean {
  const store = readStore();
  return Boolean(store[lessonSlug]?.[exerciseId]);
}

/**
 * Returns the set of completed exercise IDs for a lesson.
 * Returns an empty Set when there are no completions or in SSR.
 */
export function getCompletedExercises(lessonSlug: string): Set<string> {
  const store = readStore();
  const lesson = store[lessonSlug];
  if (!lesson) return new Set<string>();
  return new Set(Object.keys(lesson));
}

/**
 * Returns a progress summary for a lesson.
 * Safe in SSR — returns { completed: 0, total, done: false } when localStorage is unavailable.
 *
 * @param lessonSlug - The lesson identifier (e.g. "01-select").
 * @param totalExercises - The total number of exercises in the lesson.
 */
export function getLessonProgress(
  lessonSlug: string,
  totalExercises: number,
): { completed: number; total: number; done: boolean } {
  const completedSet = getCompletedExercises(lessonSlug);
  const completed = completedSet.size;
  const total = totalExercises;
  const done = total > 0 && completed >= total;
  return { completed, total, done };
}
