import { type Exercise } from '../exercise-schema.ts';

export const lesson02Exercises: Exercise[] = [
  {
    id: 'l02-e01-insert-customer',
    prompt:
      'Add a new customer: first name "Elena", last name "Rivas", email "elena.rivas@example.com", city "Quito". Let the database assign the id and created_at.',
    starterSql: 'INSERT INTO customers\n',
    expectedSql:
      "INSERT INTO customers (first_name, last_name, email, city) VALUES ('Elena', 'Rivas', 'elena.rivas@example.com', 'Quito');",
    gradeMode: 'state',
    verificationSql:
      "SELECT first_name, last_name, email, city FROM customers WHERE email = 'elena.rivas@example.com';",
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l02-e02-insert-two-departments',
    prompt:
      'Add two new departments in one statement: "Marketing" in "Lima" and "Legal" in "Santiago".',
    starterSql: 'INSERT INTO departments\n',
    expectedSql:
      "INSERT INTO departments (name, location) VALUES ('Marketing', 'Lima'), ('Legal', 'Santiago');",
    gradeMode: 'state',
    verificationSql:
      "SELECT name, location FROM departments WHERE name IN ('Marketing', 'Legal') ORDER BY name;",
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l02-e03-insert-project',
    prompt:
      'Add a new project named "Atlas" for the Engineering department (department_id 1), with a budget of 50000.00 and a start date of 2024-03-01.',
    starterSql: 'INSERT INTO projects\n',
    expectedSql:
      "INSERT INTO projects (name, department_id, budget, start_date) VALUES ('Atlas', 1, 50000.00, '2024-03-01');",
    gradeMode: 'state',
    verificationSql:
      "SELECT name, department_id, budget, start_date FROM projects WHERE name = 'Atlas';",
    compareOptions: {
      orderMatters: false,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
];
