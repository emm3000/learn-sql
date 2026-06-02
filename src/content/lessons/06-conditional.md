---
title: 'Conditional logic with CASE, COALESCE, and NULLIF'
description: 'Branch inside a query with CASE (searched and simple forms), fill in missing values with COALESCE, and collapse sentinel values to NULL with NULLIF — all grounded in three-valued logic.'
order: 6
belt: 'beginner'
draft: false
---

## Why conditional logic inside SQL?

SQL works on whole sets of rows at once, so branching cannot happen outside the query the way it would in a loop.
`CASE`, `COALESCE`, and `NULLIF` let you make row-level decisions _inside_ the `SELECT` list (or a `WHERE` clause) without ever leaving the query.

---

## CASE — the SQL if/else

`CASE` comes in two forms.

### Searched form (the general one)

Each `WHEN` branch evaluates a full boolean expression.
The first branch that is `TRUE` wins; if none match, the `ELSE` value is used (and if there is no `ELSE`, the result is `NULL`).

```sql
SELECT
  first_name,
  CASE
    WHEN salary >= 4500 THEN 'high'
    WHEN salary >= 4000 THEN 'mid'
    ELSE 'low'
  END AS band
FROM employees;
```

PostgreSQL evaluates branches top-to-bottom and stops at the first match.
Because `salary >= 4500` is checked first, an employee earning 5200 is correctly labelled `'high'` — it never reaches the `>= 4000` branch.

### Simple form (compare one expression against fixed values)

When every branch compares the same column against constants, the simple form is more readable:

```sql
SELECT
  status,
  CASE status
    WHEN 'paid'      THEN 'Closed'
    WHEN 'shipped'   THEN 'In transit'
    WHEN 'cancelled' THEN 'Refunded'
    ELSE 'Unknown'
  END AS display_status
FROM orders;
```

The simple form uses `=` under the hood; it cannot express `>=` or `IS NULL` checks.
For anything more complex, use the searched form.

---

## COALESCE — the first non-NULL wins

`COALESCE(a, b, c, ...)` scans its arguments left-to-right and returns the first one that is not `NULL`.
If every argument is `NULL`, the result is `NULL`.

```sql
-- Show 0 instead of NULL when an employee has no manager
SELECT first_name, COALESCE(manager_id, 0) AS manager
FROM employees;
```

This is the standard pattern for **default values**: supply a fallback as the last argument.

One important detail about types: all arguments in a `COALESCE` call must be type-compatible.
If your column is a `date` and your fallback is a text string, PostgreSQL will reject the call.
Cast the column to `text` first:

```sql
-- Show 'ongoing' when a project has no end date
SELECT name, COALESCE(end_date::text, 'ongoing') AS ends
FROM projects;
```

The `::text` cast converts the `date` value to its ISO-8601 string representation (`'2025-12-31'`), which is the same type as the fallback `'ongoing'`.

---

## NULLIF — collapse a sentinel to NULL

`NULLIF(a, b)` returns `NULL` when `a = b`, otherwise it returns `a` unchanged.

```sql
-- Treat 'paid' orders as if they had no status (NULL)
SELECT order_date, NULLIF(status, 'paid') AS pending
FROM orders;
```

The most common use is **guarding against divide-by-zero**:

```sql
-- Safe division: denominator becomes NULL instead of crashing
SELECT total / NULLIF(quantity, 0) AS unit_price
FROM ...;
```

Without `NULLIF`, dividing by zero raises an error.
`NULLIF(quantity, 0)` turns any zero into `NULL`, and `total / NULL` is simply `NULL` — no crash.

This also connects back to **three-valued logic** from Lesson 04: `NULL` in SQL is not zero and not false; it means "unknown".
`NULLIF` leverages that third state to signal "no meaningful value here" instead of carrying a misleading sentinel.

---

## Composing NULLIF and COALESCE

Because both functions return standard SQL values, they compose naturally:

```sql
-- 'paid' orders get relabelled 'completed'; everything else keeps its status
SELECT order_date,
       COALESCE(NULLIF(status, 'paid'), 'completed') AS label
FROM orders;
```

Read it inside-out: `NULLIF(status, 'paid')` turns `'paid'` into `NULL`.
Then `COALESCE(..., 'completed')` replaces any `NULL` with `'completed'`.
Net effect: `'paid'` → `'completed'`; all other statuses pass through unchanged.

---

## Try it

Run these one at a time and inspect the output:

```sql
-- Salary band for each employee
SELECT first_name,
       CASE
         WHEN salary >= 4500 THEN 'high'
         WHEN salary >= 4000 THEN 'mid'
         ELSE 'low'
       END AS band
FROM employees;
```

```sql
-- Replace NULL manager with 0
SELECT first_name, COALESCE(manager_id, 0) AS manager
FROM employees;
```

```sql
-- Projects: show end date or 'ongoing'
SELECT name, COALESCE(end_date::text, 'ongoing') AS ends
FROM projects;
```

```sql
-- Which orders are not yet paid?
SELECT order_date, NULLIF(status, 'paid') AS pending
FROM orders;
```

```sql
-- Relabel 'paid' to 'completed', keep everything else
SELECT order_date,
       COALESCE(NULLIF(status, 'paid'), 'completed') AS label
FROM orders;
```

---

## Real-world note

**Friendly labels for missing data.**
Raw `NULL` in a UI looks broken.
`COALESCE` is the lightest tool for replacing database `NULL` with display text (`'N/A'`, `'ongoing'`, `'—'`) without touching the underlying data.

**Safe division.**
Division by zero is a runtime error in PostgreSQL.
`NULLIF(denominator, 0)` is the idiomatic guard: it turns the crash into a `NULL` result, which the application can then handle gracefully with `COALESCE` or a `WHERE` filter.

**Cleaning sentinel values.**
Legacy systems sometimes store sentinel values (`-1`, `'N/A'`, `'unknown'`) to mean "no data".
`NULLIF` converts them to proper `NULL`, letting you query with standard `IS NULL` / `IS NOT NULL` predicates instead of special-case equality checks scattered across every query.

---

## Summary

- `CASE WHEN … THEN … ELSE … END` branches at the row level — searched form for boolean conditions, simple form for equality comparisons against one expression.
- Branches are evaluated top-to-bottom; the first `TRUE` branch wins.
- `COALESCE(a, b, …)` returns the first non-`NULL` argument — the standard pattern for default values and filling in missing data.
- All arguments to `COALESCE` must be type-compatible; cast date/numeric columns to `text` when the fallback is a string.
- `NULLIF(a, b)` returns `NULL` when `a = b`, otherwise returns `a` — the classic guard against divide-by-zero and a tool for collapsing sentinel values.
- `NULLIF` and `COALESCE` compose: wrap `NULLIF` inside `COALESCE` to replace a specific value with a fallback in one expression.
