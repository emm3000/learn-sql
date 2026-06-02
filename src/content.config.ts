// Astro 6 Content Layer API: collections are defined here with glob loaders.
// z is imported from 'astro/zod' — Astro 6 re-exports its own Zod 4 instance,
// so content-collection schemas must use this import, NOT standalone zod.
// The standalone 'zod' package (also v4) is used only for the exercise schema
// in src/lib/exercise-schema.ts, where Astro's content pipeline is not involved.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().positive(),
    belt: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'master']),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { lessons };
