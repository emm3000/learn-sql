import { type Exercise } from '../exercise-schema.ts';

export const lesson04Exercises: Exercise[] = [
  {
    id: 'l04-e01-filter-by-city',
    prompt: "List all customers from Lima. Return all columns.",
    starterSql: 'SELECT *\n',
    expectedSql: "SELECT * FROM customers WHERE city = 'Lima';",
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l04-e02-filter-salary-gt',
    prompt: 'List the salary of every employee who earns more than 4500. Return the salary column only.',
    starterSql: 'SELECT salary\n',
    expectedSql: 'SELECT salary FROM employees WHERE salary > 4500;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
  {
    id: 'l04-e03-filter-between',
    prompt: 'List the total_amount of orders where the total is between 100 and 200 (inclusive). Return the total_amount column only.',
    starterSql: 'SELECT total_amount\n',
    expectedSql: 'SELECT total_amount FROM orders WHERE total_amount BETWEEN 100 AND 200;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
  {
    id: 'l04-e04-filter-in',
    prompt: "List all customers from Lima or Santiago. Return all columns.",
    starterSql: 'SELECT *\n',
    expectedSql: "SELECT * FROM customers WHERE city IN ('Lima', 'Santiago');",
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l04-e05-filter-is-null',
    prompt: 'Find every employee who has no manager (the manager_id column is empty). Return all columns.',
    starterSql: 'SELECT *\n',
    expectedSql: 'SELECT * FROM employees WHERE manager_id IS NULL;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
];
