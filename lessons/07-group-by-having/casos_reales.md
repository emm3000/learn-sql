# Casos Reales: GROUP BY y HAVING

## Caso 1: reporte de personal

Quieres saber cuantas personas hay por area y cuanto cuesta cada area en salarios.

```sql
SELECT department_id, COUNT(*) AS total_employees, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id;
```

## Caso 2: resumen comercial

Quieres ver cuantas ordenes hay por estado y cuanto ingreso representa cada estado.

```sql
SELECT status, COUNT(*) AS total_orders, SUM(total_amount) AS revenue
FROM orders
GROUP BY status;
```

## Caso 3: detectar grupos relevantes

Quieres filtrar solo departamentos que ya tengan suficiente volumen.

```sql
SELECT department_id, COUNT(*) AS total_employees
FROM employees
GROUP BY department_id
HAVING COUNT(*) >= 2;
```
