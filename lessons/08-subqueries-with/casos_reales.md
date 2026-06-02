# Casos Reales: Subqueries y WITH

## Caso 1: comparar contra un promedio

Quieres ver solo empleados con salario superior al promedio general.

```sql
SELECT first_name, last_name, salary
FROM employees
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
);
```

## Caso 2: preparar un reporte en pasos

Primero calculas un resumen, luego lo usas en otra consulta.

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

## Caso 3: hacer mas legible una consulta grande

En una base real, dividir una consulta en partes hace que sea mas facil mantenerla y revisarla.
