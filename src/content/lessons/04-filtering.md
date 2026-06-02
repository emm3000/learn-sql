---
title: 'Filtering rows with WHERE'
description: 'Narrow query results with WHERE, comparison operators, IN, BETWEEN, and IS NULL.'
order: 4
belt: 'beginner'
draft: false
---

## What is WHERE?

Every query returns rows — but usually you do not want all of them.
`WHERE` is the clause that filters rows before they are returned.
Only rows whose condition evaluates to `TRUE` are included in the result.

```sql
SELECT column1, column2
FROM table_name
WHERE condition;
```

## Comparison operators

The most common operators in a `WHERE` clause:

| Operator | Meaning |
| -------- | ------- |
| `=` | equal to |
| `<>` or `!=` | not equal to |
| `<`, `>` | less than, greater than |
| `<=`, `>=` | less than or equal, greater than or equal |

Examples against the classic company dataset:

```sql
-- Customers from Lima only
SELECT first_name, last_name, city
FROM customers
WHERE city = 'Lima';
```

```sql
-- Employees earning more than 4500
SELECT first_name, salary
FROM employees
WHERE salary > 4500;
```

## Three-valued logic and NULL

SQL uses **three-valued logic**: a condition can be `TRUE`, `FALSE`, or `NULL` (unknown).

`NULL` means "no value" — it is not zero, not an empty string, not anything.
Because `NULL` represents absence, comparing it with `=` does not work:

```sql
-- This returns 0 rows — always.
SELECT * FROM employees WHERE manager_id = NULL;
```

The expression `manager_id = NULL` evaluates to `NULL`, not `TRUE`.
`NULL` is never equal to anything — not even another `NULL`.
The WHERE clause only keeps rows where the condition is `TRUE`, so every row is filtered out.

Use `IS NULL` (and `IS NOT NULL`) instead:

```sql
-- Employees with no manager — works correctly
SELECT first_name FROM employees WHERE manager_id IS NULL;
```

This is one of SQL's most important rules. Remember it: **`= NULL` always fails; use `IS NULL`.**

## BETWEEN for ranges

`BETWEEN low AND high` is shorthand for `column >= low AND column <= high`.
Both endpoints are **inclusive**.

```sql
-- Orders with a total between 100 and 200 (inclusive)
SELECT total_amount
FROM orders
WHERE total_amount BETWEEN 100 AND 200;
```

## IN for lists of values

`IN (val1, val2, ...)` matches any row whose column value is in the list.
It is cleaner than writing multiple `OR` conditions.

```sql
-- Customers from Lima or Santiago
SELECT first_name, last_name, city
FROM customers
WHERE city IN ('Lima', 'Santiago');
```

## Try it

Run these one at a time and observe the results:

```sql
-- How many employees earn more than 4000?
SELECT first_name, salary
FROM employees
WHERE salary > 4000;
```

```sql
-- Which employees have no manager?
SELECT first_name, manager_id
FROM employees
WHERE manager_id IS NULL;
```

```sql
-- Orders in the mid range
SELECT total_amount
FROM orders
WHERE total_amount BETWEEN 100 AND 250;
```

## Real-world note

In production, every table query benefits from a `WHERE` clause — without one, you
scan the entire table. Database indexes are designed to speed up filtered queries, not
full-table scans. Writing precise conditions from the start is both a correctness habit
and a performance one.

`IS NULL` checks appear constantly in real systems: finding incomplete records, unassigned
tickets, or rows that need follow-up. Knowing that `= NULL` silently returns nothing is
the difference between a query that works and one that looks fine but discards data.

## Summary

- `WHERE` keeps only rows where the condition evaluates to `TRUE`.
- `=`, `<>`, `<`, `>`, `<=`, `>=` are the basic comparison operators.
- SQL uses three-valued logic: conditions can be `TRUE`, `FALSE`, or `NULL`.
- `= NULL` always returns nothing — use `IS NULL` / `IS NOT NULL` instead.
- `BETWEEN low AND high` filters an inclusive range.
- `IN (v1, v2, ...)` matches any value in a list.
