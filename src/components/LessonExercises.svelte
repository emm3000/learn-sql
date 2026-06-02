<script lang="ts">
  import { onMount } from 'svelte';
  import type { Exercise } from '../lib/exercise-schema.ts';
  import { markExerciseComplete, getCompletedExercises } from '../lib/progress/progress.ts';
  import Playground from './Playground.svelte';

  interface Props {
    lessonSlug: string;
    exercises: Exercise[];
    seedSql: string;
  }

  const { lessonSlug, exercises, seedSql }: Props = $props();

  // ── State ──────────────────────────────────────────────────────────────────

  // Completed exercise ids — populated from localStorage on mount.
  let completed = $state(new Set<string>());

  // Index of the currently open exercise, or -1 if none.
  let openIndex = $state(exercises.length > 0 ? 0 : -1);

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onMount(() => {
    completed = getCompletedExercises(lessonSlug);
  });

  // ── Actions ───────────────────────────────────────────────────────────────

  function toggle(index: number): void {
    openIndex = openIndex === index ? -1 : index;
  }

  function handleComplete(exerciseId: string, passed: boolean): void {
    if (!passed) return;
    markExerciseComplete(lessonSlug, exerciseId);
    // Rebuild the set so Svelte reactivity picks up the change.
    completed = new Set([...completed, exerciseId]);
  }
</script>

<div class="lesson-exercises">
  <h2 class="section-heading">Exercises</h2>

  {#if exercises.length === 0}
    <p class="no-exercises">No exercises available for this lesson yet.</p>
  {:else}
    <ol class="exercise-list">
      {#each exercises as exercise, i (exercise.id)}
        {@const isOpen = openIndex === i}
        {@const isDone = completed.has(exercise.id)}
        <li class="exercise-item" class:is-open={isOpen} class:is-done={isDone}>
          <button
            type="button"
            class="exercise-header"
            aria-expanded={isOpen}
            onclick={() => toggle(i)}
          >
            <span class="exercise-number">{i + 1}</span>
            <span class="exercise-prompt">{exercise.prompt}</span>
            {#if isDone}
              <span class="check-badge" aria-label="Completed">&#10003;</span>
            {/if}
            <span class="chevron" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
          </button>

          {#if isOpen}
            <div class="exercise-body">
              <Playground
                {seedSql}
                {exercise}
                onComplete={(passed) => handleComplete(exercise.id, passed)}
              />
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  {/if}
</div>

<style>
  .lesson-exercises {
    margin-top: 32px;
    font-family: system-ui, sans-serif;
  }

  .section-heading {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 16px;
  }

  .no-exercises {
    color: #6b7280;
    font-size: 15px;
  }

  .exercise-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .exercise-item {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }

  .exercise-item.is-done {
    border-color: #86efac;
  }

  .exercise-item.is-open {
    border-color: #3b82f6;
  }

  .exercise-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 15px;
    color: #111827;
    transition: background 0.12s;
  }

  .exercise-header:hover {
    background: #f9fafb;
  }

  .exercise-item.is-open .exercise-header {
    background: #eff6ff;
  }

  .exercise-number {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #e5e7eb;
    color: #374151;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .exercise-item.is-done .exercise-number {
    background: #bbf7d0;
    color: #166534;
  }

  .exercise-prompt {
    flex: 1;
    line-height: 1.4;
  }

  .check-badge {
    flex-shrink: 0;
    color: #16a34a;
    font-size: 16px;
    font-weight: 700;
  }

  .chevron {
    flex-shrink: 0;
    color: #6b7280;
    font-size: 11px;
  }

  .exercise-header:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
  }

  .exercise-body {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
  }
</style>
