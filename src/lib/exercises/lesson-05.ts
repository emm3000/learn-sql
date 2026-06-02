import { type Exercise } from '../exercise-schema.ts';

export const lesson05Exercises: Exercise[] = [
  {
    id: 'l05-e01-order-asc',
    prompt: 'List every employee\'s first name and salary, ordered by salary from lowest to highest.',
    starterSql: 'SELECT first_name, salary\n',
    expectedSql: 'SELECT first_name, salary FROM employees ORDER BY salary ASC;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: true,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
  {
    id: 'l05-e02-order-desc',
    prompt: 'List every employee\'s first name and salary, ordered by salary from highest to lowest.',
    starterSql: 'SELECT first_name, salary\n',
    expectedSql: 'SELECT first_name, salary FROM employees ORDER BY salary DESC;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: true,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
  {
    id: 'l05-e03-order-limit',
    prompt: 'List the first name and salary of the top 3 highest-paid employees, highest first.',
    starterSql: 'SELECT first_name, salary\n',
    expectedSql: 'SELECT first_name, salary FROM employees ORDER BY salary DESC LIMIT 3;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: true,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
  {
    id: 'l05-e04-distinct-city',
    prompt: 'List the unique cities where customers live. Each city should appear only once.',
    starterSql: 'SELECT DISTINCT city\n',
    expectedSql: 'SELECT DISTINCT city FROM customers;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l05-e05-multicolumn-order',
    prompt: 'List every customer\'s first name and city, sorted by city A–Z and then by last name A–Z within each city.',
    starterSql: 'SELECT first_name, city\n',
    expectedSql: 'SELECT first_name, city FROM customers ORDER BY city ASC, last_name ASC;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: true,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
];
