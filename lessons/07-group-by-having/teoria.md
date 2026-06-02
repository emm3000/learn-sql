# Teoria: GROUP BY y HAVING

`GROUP BY` agrupa filas que comparten un valor.
Las funciones de agregacion resumen cada grupo.
`HAVING` filtra grupos ya agregados.

## COUNT

```sql
SELECT department_id, COUNT(*) AS total_employees
FROM employees
GROUP BY department_id;
```

## SUM

```sql
SELECT department_id, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id;
```

## AVG

```sql
SELECT department_id, AVG(salary) AS average_salary
FROM employees
GROUP BY department_id;
```

## HAVING

```sql
SELECT department_id, COUNT(*) AS total_employees
FROM employees
GROUP BY department_id
HAVING COUNT(*) >= 2;
```

## Diferencia entre WHERE y HAVING

- `WHERE` filtra filas antes de agrupar
- `HAVING` filtra grupos despues de agrupar

## Idea clave

Si quieres responder preguntas como “cuantos”, “cuanto suma” o “cual grupo supera cierto limite”, esta es la herramienta base.
