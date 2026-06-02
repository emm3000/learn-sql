# Casos Reales: ORDER BY y LIMIT

## Caso 1: ver los registros mas recientes

Un panel administrativo normalmente quiere ver los ultimos eventos primero.

```sql
SELECT *
FROM saludos
ORDER BY id DESC
LIMIT 10;
```

## Caso 2: paginar resultados

Una app muestra resultados en bloques pequeños para no cargar todo de una vez.

```sql
SELECT *
FROM saludos
ORDER BY id ASC
LIMIT 20 OFFSET 20;
```

## Caso 3: listas estables

Si dos filas tienen el mismo valor en una columna, usar una segunda columna como desempate ayuda a tener orden predecible.

```sql
SELECT *
FROM saludos
ORDER BY mensaje ASC, id ASC;
```

