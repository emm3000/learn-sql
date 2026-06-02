<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { DbClient } from '../lib/db/db-client.ts';
  import { gradeExercise } from '../lib/grading/grade.ts';
  import type { Exercise } from '../lib/exercise-schema.ts';
  import type { QueryResult, QueryError } from '../lib/db/types.ts';
  import type { GradeResult } from '../lib/grading/types.ts';
  import SqlEditor from './SqlEditor.svelte';

  interface Props {
    seedSql: string;
    exercise: Exercise;
  }

  const { seedSql, exercise }: Props = $props();

  // ── State ─────────────────────────────────────────────────────────────────

  let db: DbClient | undefined = $state();
  let dbReady = $state(false);
  let dbError: string | undefined = $state();

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

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  onMount(() => {
    let alive = true;

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
    } catch (err: unknown) {
      queryError = {
        message: err instanceof Error ? err.message : String(err),
      };
    } finally {
      grading = false;
    }
  }
</script>

<div class="playground">
  <!-- Exercise prompt -->
  <div class="prompt">
    <p>{exercise.prompt}</p>
  </div>

  <!-- Loading / error state for the DB -->
  {#if !dbReady && !dbError}
    <div class="db-status loading" role="status" aria-live="polite">
      Loading database&hellip;
    </div>
  {/if}

  {#if dbError}
    <div class="db-status db-error" role="alert">
      Failed to start the database: {dbError}
    </div>
  {/if}

  <!-- Editor -->
  <div class="editor-wrapper">
    <SqlEditor bind:value={sql} disabled={busy || !dbReady} />
  </div>

  <!-- Toolbar -->
  <div class="toolbar">
    <button
      type="button"
      onclick={runQuery}
      disabled={busy || !dbReady}
      class="btn btn-primary"
    >
      {queryRunning ? 'Running…' : 'Run'}
    </button>
    <button
      type="button"
      onclick={grade}
      disabled={busy || !dbReady}
      class="btn btn-grade"
    >
      {grading ? 'Grading…' : 'Grade'}
    </button>
    <button
      type="button"
      onclick={resetDb}
      disabled={busy || !dbReady}
      class="btn btn-reset"
    >
      {resetting ? 'Resetting…' : 'Reset DB'}
    </button>
  </div>

  <!-- Reset confirmation -->
  {#if resetMessage}
    <div class="reset-message" role="status" aria-live="polite">
      {resetMessage}
    </div>
  {/if}

  <!-- Error panel -->
  {#if queryError}
    <div class="error-panel" role="alert">
      <strong>Error:</strong> {queryError.message}
      {#if queryError.detail}
        <div class="error-detail">Detail: {queryError.detail}</div>
      {/if}
      {#if queryError.hint}
        <div class="error-hint">Hint: {queryError.hint}</div>
      {/if}
    </div>
  {/if}

  <!-- Grade result -->
  {#if gradeResult !== undefined}
    {#if gradeResult.passed}
      <div class="grade-pass" role="status" aria-live="polite">
        Correct! Well done.
      </div>
    {:else}
      <div class="grade-fail" role="alert">
        <strong>Not quite.</strong> {gradeResult.message}
      </div>
    {/if}
  {/if}

  <!-- Query result table -->
  {#if queryResult !== undefined}
    {@const { fields, rows, affectedRows } = queryResult}
    {#if fields.length === 0}
      <!-- Statement with no result set (INSERT/UPDATE/DELETE without RETURNING) -->
      <div class="result-meta">
        Query OK.{affectedRows !== undefined ? ` ${affectedRows} row(s) affected.` : ''}
      </div>
    {:else if rows.length === 0}
      <div class="result-meta">0 rows returned.</div>
    {:else}
      <div class="result-table-wrapper" role="region" aria-label="Query results">
        <table class="result-table">
          <thead>
            <tr>
              {#each fields as field (field.name)}
                <th>{field.name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each rows as row, i (i)}
              <tr>
                {#each fields as field (field.name)}
                  {@const cell = row[field.name]}
                  <td class:null-cell={cell === null || cell === undefined}>
                    {cell === null || cell === undefined ? 'NULL' : String(cell)}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="result-footer">{rows.length} row{rows.length !== 1 ? 's' : ''}</div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .playground {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-family: system-ui, sans-serif;
    max-width: 900px;
  }

  .prompt {
    background: #f0f9ff;
    border-left: 4px solid #3b82f6;
    padding: 10px 14px;
    border-radius: 0 6px 6px 0;
  }

  .prompt p {
    margin: 0;
    color: #1e3a5f;
    font-size: 15px;
    line-height: 1.5;
  }

  .db-status {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
  }

  .db-status.loading {
    background: #fefce8;
    color: #854d0e;
    border: 1px solid #fde047;
  }

  .db-status.db-error {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  .editor-wrapper {
    min-height: 120px;
  }

  .toolbar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 6px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #3b82f6;
    color: #fff;
  }

  .btn-primary:not(:disabled):hover {
    background: #2563eb;
  }

  .btn-grade {
    background: #10b981;
    color: #fff;
  }

  .btn-grade:not(:disabled):hover {
    background: #059669;
  }

  .btn-reset {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .btn-reset:not(:disabled):hover {
    background: #e5e7eb;
  }

  .reset-message {
    font-size: 13px;
    color: #374151;
    padding: 6px 10px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
  }

  .error-panel {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 6px;
    padding: 10px 14px;
    color: #991b1b;
    font-size: 14px;
    line-height: 1.5;
  }

  .error-detail,
  .error-hint {
    margin-top: 4px;
    font-size: 13px;
    color: #b91c1c;
  }

  .grade-pass {
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 6px;
    padding: 10px 14px;
    color: #166534;
    font-size: 14px;
    font-weight: 500;
  }

  .grade-fail {
    background: #fff7ed;
    border: 1px solid #fdba74;
    border-radius: 6px;
    padding: 10px 14px;
    color: #9a3412;
    font-size: 14px;
  }

  .result-table-wrapper {
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
  }

  .result-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    font-family: ui-monospace, monospace;
  }

  .result-table th {
    background: #f9fafb;
    padding: 6px 12px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
  }

  .result-table td {
    padding: 5px 12px;
    border-bottom: 1px solid #f3f4f6;
    color: #111827;
    white-space: nowrap;
  }

  .result-table tr:last-child td {
    border-bottom: none;
  }

  .result-table td.null-cell {
    color: #9ca3af;
    font-style: italic;
  }

  .result-meta {
    font-size: 13px;
    color: #6b7280;
    padding: 6px 2px;
  }

  .result-footer {
    padding: 4px 12px;
    font-size: 12px;
    color: #9ca3af;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }
</style>
