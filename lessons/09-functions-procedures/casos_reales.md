# Casos Reales: Functions y Procedures

## Caso 1: reutilizar un calculo

Si muchas consultas necesitan el nombre completo de un empleado, una function evita repetir logica.

```sql
SELECT employee_full_name(1);
```

## Caso 2: devolver listas reutilizables

Una function que retorna filas puede alimentar pantallas, reportes o procesos internos.

```sql
SELECT * FROM employees_in_department(1);
```

## Caso 3: hacer cambios controlados

Una procedure puede agrupar una operacion que cambia muchas filas, como un ajuste general.

```sql
CALL give_department_raise(1, 5);
```
