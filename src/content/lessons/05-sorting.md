---
title: 'Sorting and limiting results'
description: 'Control the order and size of your result set with ORDER BY (ASC / DESC), LIMIT, and DISTINCT — and why a tie-breaker column matters for deterministic output.'
order: 5
belt: 'beginner'
draft: false
---

## Why order matters

SQL tables have no inherent row order.
When you run `SELECT * FROM employees`, the database is free to return rows in any order — and that order can change between runs, after an `UPDATE`, or after a vacuum.
Relying on that implicit order is a bug waiting to happen.
`ORDER BY` is the clause that turns "whatever the engine feels like" into a promise.

```sql
SELECT column1, column2
FROM table_name
ORDER BY sort_column ASC;   -- or DESC
```

## ASC and DESC

`ASC` (ascending) is the default — lowest value first.
`DESC` (descending) puts the highest value first.
You can order by any column in the `SELECT` list, or even a column you did not select (though it is cleaner to include it).

```sql
-- Employees by salary, cheapest first
SELECT first_name, salary
FROM employees
ORDER BY salary ASC;

-- Employees by salary, highest first
SELECT first_name, salary
FROM employees
ORDER BY salary DESC;
```

## Multi-column ORDER BY and tie-breakers

When two rows have the same value in the first sort column, their relative order is again undefined — unless you add a second column as a tie-breaker.

```sql
-- Customers by city, then by last name within each city
SELECT first_name, last_name, city
FROM customers
ORDER BY city ASC, last_name ASC;
```

Without `last_name ASC` in the example above, the two Lima customers (`Mario Diaz` and `Camila Suarez`) could appear in either order on every run.
Adding the tie-breaker makes the result deterministic — always the same output for the same data.
This is especially important in paginated APIs: if rows shift between pages, users see duplicates or gaps.

## LIMIT — take only what you need

`LIMIT n` stops the query after returning `n` rows.
Combine it with `ORDER BY` to get meaningful "top N" results; without `ORDER BY`, the `n` rows you get are arbitrary.

```sql
-- The three highest-paid employees
SELECT first_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;
```

## DISTINCT — remove duplicate values

`DISTINCT` collapses duplicate rows so each unique value (or combination of values) appears exactly once.
Use it when you care about *which values exist*, not *how many times* each appears.

```sql
-- Which cities do our customers come from?
SELECT DISTINCT city
FROM customers;
```

Without `DISTINCT` you would get one row per customer; with it, each city appears once regardless of how many customers live there.

## Try it

Run these one at a time and observe how the output changes:

```sql
-- All employees sorted by salary ascending
SELECT first_name, salary
FROM employees
ORDER BY salary ASC;
```

```sql
-- Top 3 earners
SELECT first_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;
```

```sql
-- Unique cities in the customer list
SELECT DISTINCT city
FROM customers;
```

```sql
-- Customers sorted by city, then last name (notice Lima's two rows)
SELECT first_name, last_name, city
FROM customers
ORDER BY city ASC, last_name ASC;
```

## Real-world note

Pagination in web applications is built on `ORDER BY` + `LIMIT` (and usually `OFFSET`).
A "next page" button that does not include `ORDER BY` is non-deterministic: the same row can appear on page 1 and page 2 if the engine shifts its scan plan between requests.
The cardinal rule: **never rely on implicit order in production code**.

`DISTINCT` is useful for dropdown menus and filter lists where you need the unique values of a column.
Be aware that `SELECT DISTINCT` can hide row-count bugs: if you expect duplicates and accidentally add `DISTINCT`, you will not notice that your query is returning the wrong data.

## Summary

- `ORDER BY column ASC` sorts lowest-first (default); `DESC` sorts highest-first.
- Add a second (or third) sort column as a tie-breaker to make order deterministic.
- `LIMIT n` returns at most `n` rows — always pair it with `ORDER BY` for predictable results.
- `DISTINCT` removes duplicate rows, keeping one occurrence of each unique value.
- Implicit row order is undefined. Explicit `ORDER BY` is a correctness requirement, not a style choice.
