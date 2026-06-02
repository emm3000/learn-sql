# Teoria: ORDER BY y LIMIT

`ORDER BY` ordena las filas del resultado.
`LIMIT` recorta cuantas filas se devuelven.

## ORDER BY basico

```sql
SELECT *
FROM saludos
ORDER BY id ASC;
```

## Orden descendente

```sql
SELECT *
FROM saludos
ORDER BY id DESC;
```

## Orden por varias columnas

```sql
SELECT *
FROM saludos
ORDER BY mensaje ASC, id DESC;
```

## LIMIT basico

```sql
SELECT *
FROM saludos
LIMIT 5;
```

## LIMIT con OFFSET

```sql
SELECT *
FROM saludos
ORDER BY id
LIMIT 5 OFFSET 10;
```

## Idea clave

Si no defines un orden, el resultado puede no ser estable.
En una base real, ordenar antes de limitar es una practica importante, sobre todo en listas y paginacion.
