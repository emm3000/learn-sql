<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { DbClient } from '../lib/db/db-client.ts';
  import { isPlaygroundSupported } from '../lib/db/browser-support.ts';
  import { gradeExercise } from '../lib/grading/grade.ts';
  import type { Exercise } from '../lib/exercise-schema.ts';
  import type { QueryResult, QueryError } from '../lib/db/types.ts';
  import type { GradeResult } from '../lib/grading/types.ts';
  import SqlEditor from './SqlEditor.svelte';

  interface Props {
    seedSql: string;
    exercise: Exercise;
    onComplete?: (passed: boolean) => void;
  }

  const { seedSql, exercise, onComplete }: Props = $props();

  // ── State ─────────────────────────────────────────────────────────────────

  let db: DbClient | undefined = $state();
  let dbReady = $state(false);
  let dbError: string | undefined = $state();
  let dbUnsupported = $state(false);

  // Seed the editor once from the exercise. We intentionally capture only the
  // initial value (untrack) — the editor content is learner-owned after mount.
  let sql = $state(untrack(() => exercise.starterSql ?? ''));

  let queryResult: QueryResult | undefined = $state();
  let queryError: QueryError | undefined = $state();
  let queryRunning = $state(false);

  let gradeResult: GradeResult | undefined = $state();
  let grading = $state(false);

  let resetMessage: string | undefined = $state();
  let resetting = $state(false);

  // ── Derived ───────────────────────────────────────────────────────────────

  const busy = $derived(queryRunning || grading || resetting);

  // Derive current output state for the pg-out panel
  type OutState = 'empty' | 'running' | 'result' | 'error' | 'reset' | 'graded';
  const outState = $derived.by((): OutState => {
    if (queryRunning || grading || resetting) return 'running';
    if (queryError) return 'error';
    if (resetMessage) return 'reset';
    if (queryResult !== undefined) return 'result';
    if (gradeResult !== undefined) return 'graded';
    return 'empty';
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  onMount(() => {
    let alive = true;

    if (!isPlaygroundSupported()) {
      dbUnsupported = true;
      return () => {
        alive = false;
      };
    }

    DbClient.create(seedSql)
      .then((client) => {
        if (!alive) {
          client.close().catch(() => {});
          return;
        }
        db = client;
        dbReady = true;
      })
      .catch((err: unknown) => {
        if (!alive) return;
        dbError = err instanceof Error ? err.message : String(err);
      });

    return () => {
      alive = false;
      db?.close().catch(() => {});
    };
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  function clearResults() {
    queryResult = undefined;
    queryError = undefined;
    gradeResult = undefined;
    resetMessage = undefined;
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async function runQuery() {
    if (!db || !dbReady || busy) return;
    clearResults();
    queryRunning = true;
    try {
      const res = await db.runSql(sql);
      if (res.ok) {
        queryResult = res.result;
      } else {
        queryError = res.error;
      }
    } finally {
      queryRunning = false;
    }
  }

  async function resetDb() {
    if (!db || !dbReady || busy) return;
    clearResults();
    resetting = true;
    try {
      await db.reset(seedSql);
      resetMessage = 'Database reset to initial state.';
    } catch (err: unknown) {
      queryError = {
        message: err instanceof Error ? err.message : String(err),
      };
    } finally {
      resetting = false;
    }
  }

  async function grade() {
    if (!db || !dbReady || busy) return;
    clearResults();
    grading = true;
    try {
      gradeResult = await gradeExercise(db, exercise, sql, seedSql);
      onComplete?.(gradeResult.passed);
    } catch (err: unknown) {
      queryError = {
        message: err instanceof Error ? err.message : String(err),
      };
    } finally {
      grading = false;
    }
  }

</script>

<!-- Unsupported browser — outside the .pg card so it's always visible -->
{#if dbUnsupported}
  <div class="pg pg-exercise" role="alert">
    <div class="pg-bar">
      <div class="pg-tabs">
        <span class="pg-tab">query.sql</span>
        <span class="pg-conn"><span class="conn-dot"></span>postgres · unavailable</span>
      </div>
    </div>
    <div class="pg-lifecycle pg-unsupported">
      This interactive SQL playground needs a modern browser with WebAssembly and Web
      Worker support. Please switch to a recent version of Chrome, Edge, Firefox, or
      Safari to run queries here.
    </div>
  </div>
{:else}
  <div class="pg pg-exercise">
    <!-- Top bar -->
    <div class="pg-bar">
      <div class="pg-tabs">
        <span class="pg-tab">query.sql</span>
        <span class="pg-conn">
          <span class="conn-dot" aria-hidden="true"></span>
          postgres · {exercise.id}
        </span>
      </div>
      <div class="pg-actions">
        <button
          type="button"
          class="pg-btn-reset"
          onclick={resetDb}
          disabled={busy || !dbReady}
          title="Restore the database to its initial state"
          aria-label="Reset database"
        >
          <!-- Reset icon -->
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M13 8a5 5 0 1 1-1.5-3.6M13 3v2.2h-2.2"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {resetting ? 'Resetting…' : 'Reset'}
        </button>
        <button
          type="button"
          class="pg-btn-grade"
          onclick={grade}
          disabled={busy || !dbReady}
          aria-label="Grade your query"
        >
          {#if grading}
            <svg
              class="spin"
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.3)" stroke-width="2" />
              <path
                d="M14 8a6 6 0 0 0-6-6"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Grading…
          {:else}
            Grade
          {/if}
        </button>
        <button
          type="button"
          class="pg-btn-run"
          onclick={runQuery}
          disabled={busy || !dbReady}
          aria-label="Run query"
        >
          {#if queryRunning}
            <svg
              class="spin"
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.3)" stroke-width="2" />
              <path
                d="M14 8a6 6 0 0 0-6-6"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Running
          {:else}
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1.5 1.3l9 5.2-9 5.2V1.3z" fill="#fff" />
            </svg>
            Run
            <span class="run-kbd" aria-hidden="true">⌘↵</span>
          {/if}
        </button>
      </div>
    </div>

    <!-- DB loading state (inside the card, above the editor) -->
    {#if !dbReady && !dbError}
      <div class="pg-lifecycle loading" role="status" aria-live="polite">
        <svg
          class="spin"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6" stroke="var(--ed-line-2)" stroke-width="2" />
          <path
            d="M14 8a6 6 0 0 0-6-6"
            stroke="var(--beginner)"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        Loading database…
      </div>
    {/if}

    {#if dbError}
      <div class="pg-lifecycle pg-error" role="alert">
        Failed to start the database: {dbError}
      </div>
    {/if}

    <!-- CodeMirror editor -->
    <SqlEditor
      bind:value={sql}
      disabled={busy || !dbReady}
      onRun={() => { if (!busy && dbReady) runQuery(); }}
    />

    <!-- Output panel — 7 states -->
    <div class="pg-out">
      {#if outState === 'empty'}
        <!-- State 1: empty -->
        <div class="pg-empty">
          <span class="pg-empty-i" aria-hidden="true">
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 8h11M9.5 4l4 4-4 4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          Write your query, then Run it. Your result is graded automatically.
        </div>
      {:else if outState === 'running'}
        <!-- State 2: running -->
        <div class="pg-empty running" role="status" aria-live="polite">
          <span class="pg-empty-i" aria-hidden="true">
            <svg
              class="spin"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6" stroke="var(--ed-line-2)" stroke-width="2" />
              <path
                d="M14 8a6 6 0 0 0-6-6"
                stroke="var(--beginner)"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
          Executing query…
        </div>
      {:else if outState === 'result' && queryResult !== undefined}
        <!-- State 3: result -->
        {@const { fields, rows, affectedRows } = queryResult}
        {#if fields.length === 0}
          <!-- Statement with no result set (INSERT/UPDATE/DELETE without RETURNING) -->
          <div class="res-wrap fade-in">
            <div class="res-meta">
              <span class="res-dot ok" aria-hidden="true"></span>
              Query OK.{affectedRows !== undefined ? ` ${affectedRows} row(s) affected.` : ''}
            </div>
          </div>
        {:else if rows.length === 0}
          <div class="res-wrap fade-in">
            <div class="res-meta">
              <span class="res-dot ok" aria-hidden="true"></span>
              0 rows returned.
            </div>
          </div>
        {:else}
          <div class="res-wrap fade-in" role="region" aria-label="Query results">
            <div class="res-meta">
              <span class="res-dot ok" aria-hidden="true"></span>
              {rows.length}
              {rows.length === 1 ? 'row' : 'rows'} returned
            </div>
            <div class="res-scroll ed-scroll">
              <table class="res-table">
                <thead>
                  <tr>
                    <th class="rn" scope="col" aria-label="Row number">#</th>
                    {#each fields as field (field.name)}
                      <th scope="col">
                        <span class="th-name">{field.name}</span>
                      </th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each rows as row, i (i)}
                    <tr>
                      <td class="rn">{i + 1}</td>
                      {#each fields as field (field.name)}
                        {@const cell = row[field.name]}
                        {@const isNum = typeof cell === 'number'}
                        {@const isNull = cell === null || cell === undefined}
                        <td
                          class:num={isNum}
                          class:null-cell={isNull}
                        >
                          {#if isNull}
                            NULL
                          {:else if isNum}
                            {(cell as number).toLocaleString('en-US')}
                          {:else}
                            {String(cell)}
                          {/if}
                        </td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}
      {:else if outState === 'error' && queryError !== undefined}
        <!-- State 4: error. PGlite's worker RPC forwards only the error
             message across the Worker boundary (it serializes `{ message }`
             and drops position/detail/hint/code), so only the badge + message
             are shown. The richer Postgres-style caret/HINT/DETAIL UI was
             removed as dead code; revisit if PGlite starts forwarding those
             fields. -->
        <div class="err-wrap fade-in" role="alert">
          <div class="err-head">
            <span class="err-badge">ERROR</span>
            <span class="err-msg">{queryError.message}</span>
          </div>
        </div>
      {:else if outState === 'reset'}
        <!-- Lifecycle: reset confirmation -->
        <div class="pg-reset-msg" role="status" aria-live="polite">
          {resetMessage}
        </div>
      {/if}
      <!-- State 'graded': pg-out is empty; the grade panel below takes over -->
    </div>

    <!-- Grade panels (pass / fail) — shown below the output area -->
    {#if gradeResult !== undefined && !busy}
      <div class="pg-grade fade-up">
        {#if gradeResult.passed}
          <!-- State 5: passed -->
          <div class="grade pass" role="status" aria-live="polite">
            <div class="grade-top">
              <span class="grade-check" aria-hidden="true">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5l3.2 3.2L13 4.8"
                    stroke="#fff"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span class="grade-title">Correct!</span>
              <span class="grade-pill">+1 toward your green belt</span>
            </div>
            <p class="grade-body">Well done. Your query returned the expected result.</p>
          </div>
        {:else}
          <!-- State 6: failed -->
          <div class="grade fail" role="alert">
            <div class="grade-top">
              <span class="grade-x" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="#9a6b1e"
                    stroke-width="2.1"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              <span class="grade-title">Not quite.</span>
            </div>
            <p class="grade-body">{gradeResult.message}</p>
            <div class="grade-foot">
              Keep going — no solution to peek at, and that's on purpose. Revise
              your query and run it again.
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  /* All surface/state styles live in src/styles/playground.css,
     imported where this component is used. Scoped here: only
     the .spin keyframe (already in global.css via .spin class,
     but we reference it on SVGs inside this component) and
     the editor container wrapper. */

  /* Editor container: no additional scoped wrapper needed —
     SqlEditor.svelte manages its own container div. */
</style>
