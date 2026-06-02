# Teoria: Subqueries y WITH

Una subquery es una consulta dentro de otra consulta.
Un CTE con `WITH` te permite nombrar un resultado intermedio para leerlo mejor.

## Subquery en WHERE

```sql
SELECT *
FROM employees
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
);
```

## Subquery en FROM

```sql
SELECT department_id, total_employees
FROM (
  SELECT department_id, COUNT(*) AS total_employees
  FROM employees
  GROUP BY department_id
) dept_counts;
```

## WITH / CTE

```sql
WITH dept_counts AS (
  SELECT department_id, COUNT(*) AS total_employees
  FROM employees
  GROUP BY department_id
)
SELECT *
FROM dept_counts
WHERE total_employees >= 2;
```

## Idea clave

Si una consulta grande empieza a parecer una torre dificil de leer, `WITH` te ayuda a partirla en pasos con nombre.

## Nota sobre el alias

En PostgreSQL moderno, una subquery en `FROM` puede ejecutarse sin alias en algunos casos, pero sigue siendo recomendable ponerlo porque mejora la lectura y evita confusiones. En SQL estandar y en muchos motores, el alias sigue siendo obligatorio.
