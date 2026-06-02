# Teoria: JOIN

`JOIN` sirve para combinar filas de dos o mas tablas relacionadas.

## INNER JOIN

Devuelve solo las filas que tienen coincidencia en ambas tablas.

```sql
SELECT e.first_name, e.last_name, d.name AS department_name
FROM employees e
INNER JOIN departments d ON d.id = e.department_id;
```

## LEFT JOIN

Devuelve todas las filas de la tabla izquierda y las coincidencias de la derecha.

```sql
SELECT e.first_name, e.last_name, d.name AS department_name
FROM employees e
LEFT JOIN departments d ON d.id = e.department_id;
```

## Idea clave

La condicion del `ON` define como se conectan las tablas.
Si unes por la columna incorrecta, el resultado puede ser engañoso aunque la query no falle.
