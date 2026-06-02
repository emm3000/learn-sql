---
title: 'Changing data with UPDATE and DELETE'
description: 'Modify and remove rows safely — and why WHERE is the most important word.'
order: 3
belt: 'beginner'
draft: false
---

## UPDATE and DELETE

`UPDATE` changes the values in existing rows.
`DELETE` removes rows entirely.
Both are permanent — there is no undo in SQL unless you are inside a transaction.

## UPDATE syntax

```sql
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
```

Example — mark order 2 as delivered:

```sql
UPDATE orders
SET status = 'delivered'
WHERE id = 2;
```

You can change multiple columns at once by separating assignments with commas:

```sql
UPDATE orders
SET status = 'delivered', total_amount = 95.00
WHERE id = 2;
```

## DELETE syntax

```sql
DELETE FROM table_name
WHERE condition;
```

Example — remove a cancelled order:

```sql
DELETE FROM orders
WHERE id = 4;
```

## The WHERE safety lesson

`WHERE` is the most important word in any `UPDATE` or `DELETE`.

Omitting it targets **every row in the table**:

```sql
-- DANGER: updates every order's status
UPDATE orders SET status = 'delivered';

-- DANGER: deletes every order
DELETE FROM orders;
```

These statements are valid SQL — the database will execute them without warning.
In a production database, this kind of mistake causes real data loss.

The safe pattern is always to scope your change:

```sql
-- Safe: only order 2 is touched
UPDATE orders SET status = 'delivered' WHERE id = 2;

-- Safe: only order 4 is removed
DELETE FROM orders WHERE id = 4;
```

A good habit: write the `WHERE` clause first, run a `SELECT` with it to confirm
which rows you are about to change, and only then add `UPDATE`/`DELETE`.

## Returning what changed

`RETURNING` works with `UPDATE` and `DELETE` too:

```sql
UPDATE orders
SET status = 'delivered'
WHERE id = 2
RETURNING id, status;
```

```sql
DELETE FROM orders
WHERE id = 4
RETURNING id;
```

This is useful for confirming exactly which rows were affected — especially when your
`WHERE` clause is more complex than a single `id` match.

## Foreign keys and deletes

Deleting a row that other rows reference through a foreign key may be blocked or
may cascade, depending on how the table was defined.

In this dataset, `order_items` references `orders` with `ON DELETE CASCADE` — deleting
an order automatically removes its items:

```sql
-- Deletes order 4 and all its order_items automatically
DELETE FROM orders WHERE id = 4;
```

Trying to delete a `customer` who still has `orders` is blocked, because `orders`
has no cascade rule for `customer_id`:

```sql
-- ERROR: violates foreign key constraint
DELETE FROM customers WHERE id = 1;
```

Always check the schema before deleting parent rows.

## Try it

Run this to update the status of a single order and see what changed:

```sql
UPDATE orders
SET status = 'delivered'
WHERE id = 2
RETURNING id, status;
```

Then verify with a `SELECT`:

```sql
SELECT id, status FROM orders ORDER BY id;
```

## Summary

- `UPDATE table SET col = val WHERE condition` modifies matching rows.
- `DELETE FROM table WHERE condition` removes matching rows.
- **Omitting `WHERE` affects every row** — always scope your changes.
- `RETURNING` shows the rows affected, including their new values.
- Foreign key constraints may block or cascade deletes depending on the schema.
