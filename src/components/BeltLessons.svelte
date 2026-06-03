<script lang="ts">
  import { onMount } from 'svelte';
  import { getLessonProgress } from '../lib/progress/progress.ts';

  interface LessonMeta {
    slug: string;
    title: string;
    order: number;
    exerciseCount: number;
  }

  interface LessonProgress {
    completed: number;
    total: number;
    done: boolean;
  }

  interface Props {
    lessons: LessonMeta[];
    beltColor?: string;
    beltInk?: string;
  }

  const {
    lessons,
    beltColor = '#16a34a',
    beltInk = '#15803d',
  }: Props = $props();

  // Progress map keyed by lesson slug. Populated client-side in onMount.
  // Before mount, this is undefined so we avoid a layout flash.
  let progressMap = $state<Record<string, LessonProgress> | undefined>(
    undefined,
  );

  onMount(() => {
    const map: Record<string, LessonProgress> = {};
    for (const lesson of lessons) {
      map[lesson.slug] = getLessonProgress(lesson.slug, lesson.exerciseCount);
    }
    progressMap = map;
  });

  // First lesson not yet done — the "current" one.
  const currentSlug = $derived(
    progressMap !== undefined
      ? (lessons.find((l) => !progressMap![l.slug]?.done)?.slug ?? null)
      : null,
  );

  const doneCount = $derived(
    progressMap !== undefined
      ? lessons.filter((l) => progressMap![l.slug]?.done).length
      : 0,
  );
</script>

<div class="belt-lessons-root" style="--c: {beltColor}; --cink: {beltInk}">
  {#if progressMap !== undefined}
    <div class="belt-progress-bar">
      <span class="bp-count"
        >{doneCount}<span class="bp-of">/{lessons.length}</span></span
      >
      <span class="bp-label">lessons</span>
    </div>
  {/if}

  <ul class="lessons">
    {#each lessons as lesson (lesson.slug)}
      {@const progress = progressMap?.[lesson.slug]}
      {@const isDone = progress?.done ?? false}
      {@const isCurrent =
        progressMap !== undefined && lesson.slug === currentSlug}
      <li>
        <a
          href={`/lessons/${lesson.slug}`}
          class="lesson-row"
          class:current={isCurrent}
          class:done={isDone}
        >
          <span class="lr-state">
            {#if isDone}
              <span class="lr-check">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8.3l3 3L12.5 5"
                    stroke="#fff"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            {:else}
              <span class="lr-num" class:on={isCurrent}>{lesson.order}</span>
            {/if}
          </span>

          <span class="lr-main">
            <span class="lr-title">{lesson.title}</span>
            <span class="lr-dek"
              >{lesson.exerciseCount === 1
                ? '1 exercise'
                : `${lesson.exerciseCount} exercises`}</span
            >
          </span>

          <span class="lr-meta">
            {#if progressMap !== undefined}
              {#if isDone}
                <span class="lr-go review">Complete</span>
              {:else if isCurrent}
                <span class="lr-go">
                  Start
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              {:else if progress && progress.completed > 0}
                <span class="lr-min"
                  >{progress.completed}/{progress.total}</span
                >
              {/if}
            {/if}
          </span>
        </a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .belt-lessons-root {
    margin-top: 4px;
  }

  /* Belt-level progress count — top-right, shown only post-mount */
  .belt-progress-bar {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 4px;
  }
  .bp-count {
    font-family: var(--f-ui);
    font-weight: 700;
    font-size: 22px;
    color: var(--cink);
    letter-spacing: -0.02em;
  }
  .bp-of {
    color: var(--ink-4);
    font-weight: 500;
  }
  .bp-label {
    font-family: var(--f-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-top: 1px;
  }

  /* Lesson list */
  .lessons {
    list-style: none;
    margin: 20px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .lesson-row {
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 15px 16px;
    border-radius: var(--r);
    border: 1px solid var(--line);
    background: var(--surface);
    box-shadow: var(--sh-1);
    transition:
      border-color 0.16s,
      box-shadow 0.16s,
      transform 0.08s,
      background 0.16s;
    text-decoration: none;
    color: inherit;
  }
  .lesson-row:hover {
    border-color: color-mix(in oklab, var(--c) 40%, var(--line));
    box-shadow: var(--sh-2);
    transform: translateY(-1px);
  }
  .lesson-row.current {
    border-color: color-mix(in oklab, var(--c) 45%, white);
    background: color-mix(in oklab, var(--c) 4%, white);
  }

  .lr-state {
    flex: none;
  }
  .lr-num {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    font-family: var(--f-mono);
    font-size: 13px;
    font-weight: 600;
    background: var(--bg-2);
    color: var(--ink-3);
    border: 1px solid var(--line);
  }
  .lr-num.on {
    background: var(--c);
    color: #fff;
    border-color: var(--c);
  }
  .lr-check {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    background: var(--c);
    color: #fff;
  }

  .lr-main {
    flex: 1;
    min-width: 0;
  }
  .lr-title {
    display: block;
    font-family: var(--f-ui);
    font-weight: 600;
    font-size: 15.5px;
    color: var(--ink);
    letter-spacing: -0.01em;
  }
  .lr-dek {
    display: block;
    font-family: var(--f-serif);
    font-size: 14px;
    color: var(--ink-3);
    margin-top: 2px;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    /* stylelint-disable-next-line */
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .lr-meta {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }
  .lr-min {
    font-family: var(--f-mono);
    font-size: 11px;
    color: var(--ink-4);
  }
  .lr-go {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--f-ui);
    font-size: 12.5px;
    font-weight: 600;
    color: var(--cink);
  }
  .lr-go.review {
    color: var(--ink-3);
    font-weight: 500;
  }

  @media (max-width: 620px) {
    .lr-dek {
      display: none;
    }
  }
</style>
