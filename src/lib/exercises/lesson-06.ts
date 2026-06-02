import { type Exercise } from '../exercise-schema.ts';

export const lesson06Exercises: Exercise[] = [
  {
    id: 'l06-e01-case-band',
    prompt:
      "Label each employee with a salary band: 'high' for salary ≥ 4500, 'mid' for salary ≥ 4000, and 'low' for anything below. Return first_name and the band column.",
    starterSql: 'SELECT first_name,\n',
    expectedSql: `SELECT first_name, CASE WHEN salary >= 4500 THEN 'high' WHEN salary >= 4000 THEN 'mid' ELSE 'low' END AS band FROM employees;`,
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l06-e02-coalesce-manager',
    prompt:
      'Return first_name and manager_id for every employee, but replace any NULL manager_id with 0.',
    starterSql: 'SELECT first_name,\n',
    expectedSql: 'SELECT first_name, COALESCE(manager_id, 0) AS manager FROM employees;',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
  {
    id: 'l06-e03-coalesce-end-date',
    prompt:
      "Return every project's name and its end date, but show 'ongoing' for projects that have no end date yet.",
    starterSql: 'SELECT name,\n',
    expectedSql: `SELECT name, COALESCE(end_date::text, 'ongoing') AS ends FROM projects;`,
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l06-e04-nullif-paid',
    prompt:
      "Return order_date and status for every order, but turn any status of 'paid' into NULL (use NULLIF). Keep all other statuses as-is.",
    starterSql: 'SELECT order_date,\n',
    expectedSql: `SELECT order_date, NULLIF(status, 'paid') AS pending FROM orders;`,
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l06-e05-coalesce-nullif-label',
    prompt:
      "Return order_date and a label column: orders with status 'paid' should show 'completed'; every other status should show as-is. Compose NULLIF and COALESCE in a single expression.",
    starterSql: 'SELECT order_date,\n',
    expectedSql: `SELECT order_date, COALESCE(NULLIF(status, 'paid'), 'completed') AS label FROM orders;`,
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
];
