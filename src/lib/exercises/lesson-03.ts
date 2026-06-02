import { type Exercise } from '../exercise-schema.ts';

export const lesson03Exercises: Exercise[] = [
  {
    id: 'l03-e01-update-order-status',
    prompt:
      "Order 2 has just been delivered. Update only that order: set its status to 'delivered'. Do not touch any other order.",
    starterSql: 'UPDATE orders\n',
    expectedSql: "UPDATE orders SET status = 'delivered' WHERE id = 2;",
    gradeMode: 'state',
    verificationSql: 'SELECT id, status FROM orders ORDER BY id;',
    compareOptions: {
      orderMatters: true,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l03-e02-delete-cancelled-order',
    prompt:
      'Order 4 was cancelled and should be removed. Delete only that order. Leave every other order in place.',
    starterSql: 'DELETE FROM orders\n',
    expectedSql: 'DELETE FROM orders WHERE id = 4;',
    gradeMode: 'state',
    verificationSql: 'SELECT id FROM orders ORDER BY id;',
    compareOptions: {
      orderMatters: true,
      checkColumnNames: false,
      numericTolerance: null,
    },
  },
  {
    id: 'l03-e03-update-order-total',
    prompt:
      "Order 1's total was recalculated to 1500.00. Update only that order's total_amount. Leave all other orders unchanged.",
    starterSql: 'UPDATE orders\n',
    expectedSql: 'UPDATE orders SET total_amount = 1500.00 WHERE id = 1;',
    gradeMode: 'state',
    verificationSql: 'SELECT id, total_amount FROM orders ORDER BY id;',
    compareOptions: {
      orderMatters: true,
      checkColumnNames: false,
      numericTolerance: 0,
    },
  },
];
