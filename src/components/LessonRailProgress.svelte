<script lang="ts">
  import { onMount } from 'svelte';
  import { getCompletedExercises } from '../lib/progress/progress.ts';

  interface LessonRef {
    slug: string;
    title: string;
    order: number;
    exerciseCount: number;
  }

  interface Props {
    beltName: string;
    beltColor: string;
    beltInk: string;
    lessons: LessonRef[];
    currentSlug: string;
  }

  const { beltName, beltColor, beltInk, lessons, currentSlug }: Props =
    $props();

  // undefined = not yet hydrated (avoids SSR/hydration flash)
  let doneMap = $state<Map<string, boolean> | undefined>(undefined);

  onMount(() => {
    const map = new Map<string, boolean>();
    for (const l of lessons) {
      const completed = getCompletedExercises(l.slug);
      map.set(l.slug, l.exerciseCount > 0 && completed.size >= l.exerciseCount);
    }
    doneMap = map;
  });
</script>

<div class="rail-progress" style="--c: {beltColor}; --cink: {beltInk}">
  <div class="rp-head">
    <!-- belt color dot -->
    <span class="rp-belt-dot" aria-hidden="true"></span>
    <span class="rp-name">{beltName} belt</span>
  </div>
  <ul class="rp-list">
    {#each lessons as lesson (lesson.slug)}
      {@const isCurrent = lesson.slug === currentSlug}
      {@const isDone = doneMap?.get(lesson.slug) ?? false}
      <li class={[isCurrent && 'on', isDone && 'done'].filter(Boolean).join(' ')}>
        <span class="rp-mark" aria-hidden="true">
          {#if isDone}
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.5 8.3l3 3L12.5 5"
                stroke="currentColor"
                stroke-width="2.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {:else}
            {lesson.order}
          {/if}
        </span>
        <a
          href={`/lessons/${lesson.slug}`}
          aria-current={isCurrent ? 'page' : undefined}
        >
          {lesson.title}
        </a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .rail-progress {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--r);
    padding: 14px;
    box-shadow: var(--sh-1);
  }

  .rp-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .rp-belt-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--c);
    display: inline-block;
    flex: none;
  }

  .rp-name {
    font-family: var(--f-ui);
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.01em;
  }

  .rp-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .rp-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 6px;
    border-radius: 7px;
  }

  .rp-list li.on {
    background: color-mix(in oklab, var(--c) 7%, white);
  }

  .rp-mark {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    flex: none;
    font-family: var(--f-mono);
    font-size: 11px;
    font-weight: 600;
    background: var(--bg-2);
    color: var(--ink-3);
    border: 1px solid var(--line);
  }

  .rp-list li.done .rp-mark {
    background: var(--c);
    color: #fff;
    border-color: var(--c);
  }

  .rp-list li.on .rp-mark {
    border-color: var(--c);
    color: var(--cink);
  }

  .rp-list li.on.done .rp-mark {
    color: #fff;
  }

  .rp-list a {
    background: none;
    text-align: left;
    font-family: var(--f-ui);
    font-size: 13px;
    color: var(--ink-2);
    flex: 1;
    transition: color 0.15s;
    text-decoration: none;
  }

  .rp-list li.on a {
    color: var(--ink);
    font-weight: 600;
  }

  .rp-list a:hover {
    color: var(--ink);
  }
</style>
