# Casos Reales: JOIN

## Caso 1: pantalla de empleados

Quieres mostrar una tabla con empleado y departamento en una sola vista.

```sql
SELECT e.first_name, e.last_name, d.name AS department_name
FROM employees e
INNER JOIN departments d ON d.id = e.department_id;
```

## Caso 2: reporte de pedidos por cliente

Necesitas ver quien hizo cada pedido y cuanto gasto.

```sql
SELECT c.first_name, c.last_name, o.id, o.total_amount
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;
```

## Caso 3: revisar datos incompletos

Con `LEFT JOIN` puedes detectar registros que no tienen relacion completa.

```sql
SELECT e.first_name, e.last_name, d.name
FROM employees e
LEFT JOIN departments d ON d.id = e.department_id;
```
