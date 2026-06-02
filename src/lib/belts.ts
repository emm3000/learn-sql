/**
 * Belt registry — static metadata for the five progression belts.
 * Subtitles and colors sourced from docs/prd.md §6.
 * Status: 'active' (content exists) | 'coming-soon' (future belt).
 */

export type BeltId =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'ninja'
  | 'insane';
export type BeltStatus = 'active' | 'coming-soon';

export interface Belt {
  id: BeltId;
  name: string;
  subtitle: string;
  /** Primary accent color as a hex value. */
  color: string;
  status: BeltStatus;
}

/**
 * Ordered belt registry. Index 0 is the first belt; index 4 is the last.
 * The order matches the PRD §6 belt progression.
 */
export const belts: Belt[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    subtitle: 'Write SQL without fear',
    color: '#16a34a',
    status: 'active',
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    subtitle: 'Answer questions with data',
    color: '#2563eb',
    status: 'coming-soon',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    subtitle: 'Design and give logic to the database',
    color: '#7c3aed',
    status: 'coming-soon',
  },
  {
    id: 'ninja',
    name: 'Ninja',
    subtitle: 'Make it fly',
    color: '#dc2626',
    status: 'coming-soon',
  },
  {
    id: 'insane',
    name: 'Insane',
    subtitle: 'Run it in production',
    color: '#111827',
    status: 'coming-soon',
  },
];
