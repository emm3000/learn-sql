---
title: 'Combining tables with INNER JOIN'
description: 'Bring related tables together with INNER JOIN: the ON clause and join keys, table aliases, chaining multiple tables, and why INNER JOIN drops rows that have no match on both sides — setting the stage for LEFT JOIN.'
order: 1
belt: 'intermediate'
draft: false
---

## Why joins exist

A well-designed relational database splits data across multiple tables to avoid repetition.
`employees` stores the employee, `departments` stores department details — but the employee row only holds a `department_id`, not the full department name.
Whenever you need data from two (or more) related tables in the same result, you need a **JOIN**.

The core idea is simple: find every pair of rows where a value in one table matches a value in the other — the **join key** — and stitch them together into one wider row.

---

## INNER JOIN syntax

```sql
SELECT e.first_name, d.name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

Breaking it down:

- `FROM employees e` — the left table, aliased `e`.
- `JOIN departments d` — the right table, aliased `d`. (`INNER JOIN` and `JOIN` are identical; PostgreSQL treats `JOIN` as inner by default.)
- `ON e.department_id = d.id` — the **join condition**: for each employee row, find the department row whose `id` matches `department_id`.
  This is a **foreign key → primary key** relationship: `employees.department_id` is a FK that references `departments.id`.

The result has one row per matching pair — here, one row per employee, enriched with the department name.

---

## Table aliases

Aliases (`e`, `d`) are not just cosmetic.
When both tables have a column with the same name (very common: both could have an `id` column), the alias makes each reference unambiguous.

Good habits:

- Assign an alias to every table in any query involving more than one table.
- Keep aliases short but meaningful: first letter of the table name, or an abbreviation (`ord` for `orders`, `oi` for `order_items`).
- Once you assign an alias, use it consistently — mixing the full table name and the alias in the same query is confusing.

---

## Filtering across joined tables

A `WHERE` clause works exactly the same after a JOIN — it just has access to columns from all joined tables:

```sql
SELECT e.first_name, d.location
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE d.name = 'Sales';
```

The join runs first, producing the combined rows; then `WHERE` filters them.
Here only employees in the Sales department survive — Sofia and Diego.

---

## Chaining three or more tables

Each additional `JOIN` extends the result with another table.
The pattern repeats: add `JOIN <table> ON <key> = <key>` for each new table.

```sql
SELECT c.first_name, oi.product_name
FROM customers c
JOIN orders o    ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id;
```

Read it as a chain: customers → their orders → the items in those orders.
Each `ON` clause connects the new table back to something already in the result.

---

## The key property: INNER JOIN drops unmatched rows

**INNER JOIN keeps only rows that have a match on BOTH sides.**
Any row that has no counterpart in the other table is silently dropped from the result.

This matters most with nullable foreign keys.
In the `employees` table, `manager_id` can be `NULL` — employees who are not managed by anyone (top-level managers).

```sql
-- Self-join: pair each employee with their manager
SELECT e.first_name, m.first_name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```

`ON e.manager_id = m.id` compares `manager_id` against the employee's `id`.
When `manager_id` is `NULL`, the condition is never true — `NULL = <anything>` is always `NULL` in SQL, not `TRUE`.
So Ana, Sofia, Paula, and Javier (all with `manager_id IS NULL`) **do not appear in the result at all**.
Only Luis, Marta, and Diego survive because they each point to a valid manager.

This is by design — INNER JOIN reflects only the rows where the relationship is complete.
The next lesson will cover `LEFT JOIN`, which keeps all rows from the left table and fills in `NULL` for missing right-side data.

---

## Try it

Run these against the seed and observe the output:

```sql
-- All employees with their department name
SELECT e.first_name, d.name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

```sql
-- Employees in the Sales department only
SELECT e.first_name, d.location
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE d.name = 'Sales';
```

```sql
-- Orders with customer names and totals
SELECT c.first_name, o.total_amount
FROM orders o
JOIN customers c ON o.customer_id = c.id;
```

```sql
-- Three-table chain: customers → orders → order items
SELECT c.first_name, oi.product_name
FROM customers c
JOIN orders o    ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id;
```

```sql
-- Self-join: each employee paired with their manager (NULL manager_id rows are dropped)
SELECT e.first_name, m.first_name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```

---

## Real-world note

**Joins are the everyday reality of relational data.**
Almost every useful query in a production application crosses at least two tables.
Knowing which join type to use — and understanding exactly which rows survive — is one of the most consequential skills in SQL.

**Alias discipline pays off early.**
In queries with three or more tables, unqualified column references become ambiguous and hard to debug.
Make it a habit: alias every table, prefix every column.

**INNER JOIN as a data quality check.**
When an INNER JOIN returns fewer rows than you expect, it often reveals missing foreign-key data — employees without a department, orders without a customer.
That surprise is valuable diagnostic information, not just a query result.

---

## Summary

- `JOIN` (or `INNER JOIN`) combines rows from two tables wherever the `ON` condition is true — typically a foreign key matching a primary key.
- Assign aliases to all tables in multi-table queries to keep column references unambiguous.
- `WHERE` filters the already-joined rows; it has access to columns from every joined table.
- Chain additional `JOIN … ON …` clauses to bring in a third, fourth, or more tables.
- **INNER JOIN drops any row that has no match on the other side** — including rows where the join key is `NULL`.
- The next lesson introduces `LEFT JOIN`, which keeps all left-table rows even when there is no matching right-table row.
