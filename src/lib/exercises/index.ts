import type { Exercise } from '../exercise-schema.ts';
import { lesson01Exercises } from './lesson-01.ts';
import { lesson02Exercises } from './lesson-02.ts';
import { lesson03Exercises } from './lesson-03.ts';

/**
 * Map from lesson slug to its exercises.
 * Add new lessons here as they are authored.
 */
export const exercisesByLesson: Record<string, Exercise[]> = {
  '01-select': lesson01Exercises,
  '02-insert': lesson02Exercises,
  '03-update-delete': lesson03Exercises,
};
