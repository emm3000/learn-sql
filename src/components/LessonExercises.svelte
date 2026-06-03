<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import type { Exercise } from '../lib/exercise-schema.ts';
  import { markExerciseComplete, getCompletedExercises } from '../lib/progress/progress.ts';
  import Playground from './Playground.svelte';

  interface Props {
    lessonSlug: string;
    exercises: Exercise[];
    seedSql: string;
    beltColor?: string;
    beltInk?: string;
  }

  const {
    lessonSlug,
    exercises,
    seedSql,
    beltColor = '#16a34a',
    beltInk = '#15803d',
  }: Props = $props();

  // ── State ──────────────────────────────────────────────────────────────────

  // Completed exercise ids — populated from localStorage on mount.
  let completed = $state(new Set<string>());

  // Index of the currently open exercise, or -1 if none. `exercises` is static
  // per lesson, so we read its initial length without creating a dependency.
  let openIndex = $state(untrack(() => (exercises.length > 0 ? 0 : -1)));

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

<div class="lesson-exercises" style="--c: {beltColor}; --cink: {beltInk}">
  {#if exercises.length === 0}
    <p class="no-exercises">No exercises available for this lesson yet.</p>
  {:else}
    <ol class="exercise-list">
      {#each exercises as exercise, i (exercise.id)}
        {@const isOpen = openIndex === i}
        {@const isDone = completed.has(exercise.id)}
        <li class="exercise" class:is-open={isOpen} class:is-done={isDone}>
          <button
            type="button"
            class="ex-header"
            aria-expanded={isOpen}
            onclick={() => toggle(i)}
          >
            <div class="ex-head">
              <span class="ex-badge">Exercise {i + 1}</span>
              <span class="ex-rule" aria-hidden="true"></span>
              <span class="ex-note">
                {#if isDone}
                  <span class="ex-check" aria-label="Completed">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M3.5 8.3l3 3L12.5 5"
                        stroke="currentColor"
                        stroke-width="2.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    done
                  </span>
                {:else}
                  graded · no solution to reveal
                {/if}
              </span>
              <span class="ex-chevron" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  style="transform: rotate({isOpen ? 180 : 0}deg); transition: transform .2s"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
            <p class="ex-prompt">{exercise.prompt}</p>
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
    margin-top: 0;
  }

  .no-exercises {
    font-family: var(--f-serif);
    color: var(--ink-3);
    font-size: 16px;
  }

  .exercise-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Card frame — port of .exercise in screens.css */
  .exercise {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--line-2);
    border-radius: var(--r-lg);
    box-shadow: var(--sh-2);
    overflow: hidden;
  }

  /* Left accent stripe in belt color */
  .exercise::before {
    content: '';
    position: absolute;
    left: 0;
    top: 26px;
    bottom: 26px;
    width: 3px;
    border-radius: 3px;
    background: var(--c);
  }

  .exercise.is-done {
    border-color: color-mix(in oklab, var(--c) 35%, var(--line-2));
  }

  /* The whole header+prompt area is the toggle button */
  .ex-header {
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    padding: 28px 28px 0;
    display: block;
  }

  /* .ex-head row: badge / rule / note / chevron */
  .ex-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }

  .ex-badge {
    font-family: var(--f-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--cink);
    flex: none;
  }

  .ex-rule {
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  .ex-note {
    font-family: var(--f-mono);
    font-size: 11px;
    color: var(--ink-4);
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .ex-check {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--cink);
  }

  .ex-chevron {
    flex: none;
    color: var(--ink-4);
    display: flex;
    align-items: center;
  }

  .ex-prompt {
    font-family: var(--f-ui);
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--ink);
    margin: 0 0 24px;
    letter-spacing: -0.01em;
  }

  .exercise-body {
    padding: 0 28px 28px;
    border-top: 1px solid var(--line);
    padding-top: 20px;
  }

  @media (max-width: 620px) {
    .ex-header {
      padding: 20px 18px 0;
    }
    .exercise-body {
      padding: 16px 18px 20px;
    }
    .exercise::before {
      top: 20px;
      bottom: 20px;
    }
  }
</style>
