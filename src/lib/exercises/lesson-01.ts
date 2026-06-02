import { type Exercise } from '../exercise-schema.ts';

export const lesson01Exercises: Exercise[] = [
  {
    id: 'l01-e01-select-all-customers',
    prompt: 'List the first name, last name, and email of all customers.',
    starterSql: 'SELECT\n',
    expectedSql: 'SELECT first_name, last_name, email FROM customers;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l01-e02-select-ordered',
    prompt:
      'List all customers ordered by last name alphabetically (A to Z). ' +
      'Return first_name and last_name only.',
    starterSql: 'SELECT\n',
    expectedSql:
      'SELECT first_name, last_name FROM customers ORDER BY last_name ASC;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: true,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
];
