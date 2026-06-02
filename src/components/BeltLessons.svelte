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
  }

  const { lessons }: Props = $props();

  // Progress map keyed by lesson slug. Populated client-side in onMount.
  // Before mount, this is undefined so we avoid a layout flash.
  let progressMap = $state<Record<string, LessonProgress> | undefined>(undefined);

  onMount(() => {
    const map: Record<string, LessonProgress> = {};
    for (const lesson of lessons) {
      map[lesson.slug] = getLessonProgress(lesson.slug, lesson.exerciseCount);
    }
    progressMap = map;
  });
</script>

<ol class="lesson-list">
  {#each lessons as lesson (lesson.slug)}
    {@const progress = progressMap?.[lesson.slug]}
    <li class="lesson-item" class:is-done={progress?.done}>
      <a href={`/lessons/${lesson.slug}`} class="lesson-link">
        <span class="lesson-order">{lesson.order}</span>
        <span class="lesson-title">{lesson.title}</span>
        {#if progress !== undefined}
          <span
            class="progress-badge"
            class:badge-done={progress.done}
            class:badge-started={!progress.done && progress.completed > 0}
          >
            {#if progress.done}
              Complete ✓
            {:else if progress.completed > 0}
              {progress.completed}/{progress.total} exercises
            {:else}
              Not started
            {/if}
          </span>
        {/if}
      </a>
    </li>
  {/each}
</ol>

<style>
  .lesson-list {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .lesson-item {
    border: 1px solid #d1fae5;
    border-radius: 8px;
    background: #f0fdf4;
    transition: border-color 0.12s;
  }

  .lesson-item:hover {
    border-color: #86efac;
  }

  .lesson-item.is-done {
    border-color: #16a34a;
    background: #dcfce7;
  }

  .lesson-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    text-decoration: none;
    color: inherit;
  }

  .lesson-order {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #16a34a;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lesson-title {
    flex: 1;
    font-size: 15px;
    font-weight: 500;
    color: #111827;
    line-height: 1.4;
  }

  .progress-badge {
    flex-shrink: 0;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    background: #e5e7eb;
    color: #374151;
    white-space: nowrap;
  }

  .progress-badge.badge-done {
    background: #bbf7d0;
    color: #166534;
    font-weight: 600;
  }

  .progress-badge.badge-started {
    background: #fef9c3;
    color: #854d0e;
  }
</style>
