import { type Exercise } from '../exercise-schema.ts';

export const lesson07Exercises: Exercise[] = [
  {
    id: 'l07-e01-join-dept',
    prompt:
      'Return first_name and department name for every employee. Use a JOIN between employees and departments.',
    starterSql: 'SELECT e.first_name, d.name\n',
    expectedSql:
      'SELECT e.first_name, d.name FROM employees e JOIN departments d ON e.department_id = d.id',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l07-e02-join-where-sales',
    prompt:
      "Return first_name and the department location for employees who belong to the 'Sales' department.",
    starterSql: 'SELECT e.first_name, d.location\n',
    expectedSql:
      "SELECT e.first_name, d.location FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.name = 'Sales'",
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l07-e03-join-orders-customers',
    prompt:
      'Return the customer first_name and order total_amount for every order. Join orders to customers.',
    starterSql: 'SELECT c.first_name, o.total_amount\n',
    expectedSql:
      'SELECT c.first_name, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.id',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
  {
    id: 'l07-e04-join-three-tables',
    prompt:
      'Return each customer first_name and the product_name of every item they ordered. Chain three tables: customers → orders → order_items.',
    starterSql: 'SELECT c.first_name, oi.product_name\n',
    expectedSql:
      'SELECT c.first_name, oi.product_name FROM customers c JOIN orders o ON o.customer_id = c.id JOIN order_items oi ON oi.order_id = o.id',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l07-e05-self-join-manager',
    prompt:
      'Return each employee first_name alongside their manager first_name (aliased as "manager"). Use a self-join on the employees table. Employees with no manager should not appear in the result — that is INNER JOIN working as expected.',
    starterSql: 'SELECT e.first_name, m.first_name AS manager\n',
    expectedSql:
      'SELECT e.first_name, m.first_name AS manager FROM employees e JOIN employees m ON e.manager_id = m.id',
    gradeMode: 'result',
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
];
