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
  /** AA-safe text variant of the accent for use on light backgrounds. */
  ink: string;
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
    ink: '#15803d',
    status: 'active',
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    subtitle: 'Answer questions with data',
    color: '#2563eb',
    ink: '#1d4ed8',
    status: 'active',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    subtitle: 'Design and give logic to the database',
    color: '#7c3aed',
    ink: '#6d28d9',
    status: 'coming-soon',
  },
  {
    id: 'ninja',
    name: 'Ninja',
    subtitle: 'Make it fly',
    color: '#dc2626',
    ink: '#b91c1c',
    status: 'coming-soon',
  },
  {
    id: 'insane',
    name: 'Insane',
    subtitle: 'Run it in production',
    color: '#111827',
    ink: '#111827',
    status: 'coming-soon',
  },
];
