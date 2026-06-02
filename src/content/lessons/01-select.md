---
title: "Introduction to SELECT"
description: "Learn how to read data from a PostgreSQL table using SELECT."
order: 1
belt: "beginner"
draft: false
---

## What is SELECT?

`SELECT` is the SQL statement you use to read data from a database.
Every query that returns rows starts with `SELECT`.

## Basic syntax

```sql
SELECT column1, column2
FROM table_name;
```

To return all columns, use `*`:

```sql
SELECT *
FROM customers;
```

## Try it

Run this against the classic company dataset:

```sql
SELECT first_name, last_name, email
FROM customers
LIMIT 5;
```

## Real-world note

In production, avoid `SELECT *` — always name the columns you need.
It keeps queries readable and protects you when someone adds or reorders columns.

## Summary

- `SELECT` reads data; it never changes it.
- Name your columns explicitly.
- `LIMIT` keeps exploratory queries fast.
