# Casos Reales: Views, Materialized Views y Triggers

## Caso 1: pantalla de lectura

Una app necesita mostrar empleados con departamento sin repetir el join en cada consulta.

```sql
SELECT * FROM employee_directory;
```

## Caso 2: reporte pesado repetido

Un dashboard quiere ver ingresos por estado muchas veces al dia.

```sql
SELECT * FROM order_revenue_by_status;
```

En ese caso, una `materialized view` puede ser mejor que recalcular todo siempre.

## Caso 3: automatizacion de auditoria

Quieres saber cuando fue modificado por ultima vez un registro.

```sql
UPDATE customers SET city = 'Lima' WHERE id = 1;
```

El trigger puede actualizar `updated_at` automaticamente.
