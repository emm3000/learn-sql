# Teoria: Filtros, DISTINCT y NULL

Esta leccion junta tres ideas que en bases reales se usan todo el tiempo:

- filtrar filas con `WHERE`
- evitar duplicados con `DISTINCT`
- trabajar con valores faltantes usando `NULL`

## WHERE

```sql
SELECT *
FROM saludos
WHERE id = 1;
```

## Comparaciones comunes

```sql
WHERE id = 1
WHERE id <> 1
WHERE id > 10
WHERE id >= 10
WHERE id < 10
WHERE id <= 10
```

## Nota sobre tipos

Los operadores `<`, `>`, `<=` y `>=` se usan muy seguido con numeros, pero tambien pueden aplicar a tipos con orden, como fechas y timestamps.

Ejemplos:

```sql
WHERE precio > 100
WHERE created_at >= '2026-06-01'
WHERE nombre < 'M'
```

En bases reales, esto importa porque no todo filtro de “mayor o menor” es numerico.

## Operadores logicos

```sql
WHERE condicion1 AND condicion2
WHERE condicion1 OR condicion2
WHERE NOT condicion
```

## Listas y rangos

```sql
WHERE id IN (1, 2, 3)
WHERE id BETWEEN 1 AND 10
```

## Texto

```sql
WHERE mensaje LIKE 'Hola%'
```

## NULL

`NULL` significa que no hay valor.
No se compara con `=` ni con `<>`.

```sql
WHERE columna IS NULL
WHERE columna IS NOT NULL
```

## DISTINCT

```sql
SELECT DISTINCT mensaje
FROM saludos;
```

## Idea clave

En una base real, filtrar bien es tan importante como leer bien.
Y con `NULL`, si piensas como si fuera un valor normal, te vas a equivocar.
