import type { Exercise } from '../exercise-schema.ts';
import { lesson01Exercises } from './lesson-01.ts';

/**
 * Map from lesson slug to its exercises.
 * Add new lessons here as they are authored.
 */
export const exercisesByLesson: Record<string, Exercise[]> = {
  '01-select': lesson01Exercises,
};
