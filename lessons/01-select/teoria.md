# Teoria: SELECT

`SELECT` sirve para leer datos de una o mas tablas.

## Forma basica

```sql
SELECT columna_1, columna_2
FROM tabla;
```

## Leer todas las columnas

```sql
SELECT *
FROM tabla;
```

## Filtrar filas

```sql
SELECT *
FROM tabla
WHERE condicion;
```

## Ordenar

```sql
SELECT *
FROM tabla
ORDER BY columna ASC;
```

## Limitar resultados

```sql
SELECT *
FROM tabla
LIMIT 10;
```

## Idea clave

`SELECT` no solo sirve para “ver datos”.
Sirve para pensar en consultas precisas y predecibles.
