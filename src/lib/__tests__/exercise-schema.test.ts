import { describe, it, expect } from 'vitest';
import { exerciseSchema } from '../exercise-schema.ts';
import { lesson01Exercises } from '../exercises/lesson-01.ts';

describe('exerciseSchema', () => {
  it('parses a valid result-mode exercise', () => {
    const result = exerciseSchema.safeParse({
      id: 'test-result',
      prompt: 'Select all rows.',
      expectedSql: 'SELECT * FROM customers;',
      gradeMode: 'result',
      compareOptions: {
        orderMatters: false,
        checkColumnNames: false,
        numericTolerance: null,
      },
    });
    expect(result.success).toBe(true);
  });

  it('parses a valid state-mode exercise', () => {
    const result = exerciseSchema.safeParse({
      id: 'test-state',
      prompt: 'Insert a new customer.',
      expectedSql: "INSERT INTO customers (first_name) VALUES ('Test');",
      gradeMode: 'state',
      verificationSql:
        'SELECT first_name FROM customers ORDER BY id DESC LIMIT 1;',
      compareOptions: {
        orderMatters: false,
        checkColumnNames: false,
        numericTolerance: null,
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects a state-mode exercise missing verificationSql', () => {
    const result = exerciseSchema.safeParse({
      id: 'test-bad-state',
      prompt: 'Insert without verification.',
      expectedSql: "INSERT INTO customers (first_name) VALUES ('Test');",
      gradeMode: 'state',
      compareOptions: {
        orderMatters: false,
        checkColumnNames: false,
        numericTolerance: null,
      },
    });
    expect(result.success).toBe(false);
  });

  it('validates all lesson 01 exercises', () => {
    for (const exercise of lesson01Exercises) {
      const result = exerciseSchema.safeParse(exercise);
      expect(result.success, `Exercise ${exercise.id} failed validation`).toBe(
        true,
      );
    }
  });
});
