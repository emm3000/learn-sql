# Casos Reales: Filtros, DISTINCT y NULL

## Caso 1: buscar un registro exacto

Quieres ubicar un usuario, pedido o evento especifico.

```sql
SELECT *
FROM saludos
WHERE id = 1;
```

## Caso 2: limpiar reportes con duplicados

Un dashboard no debe mostrar el mismo valor repetido varias veces.

```sql
SELECT DISTINCT mensaje
FROM saludos;
```

## Caso 3: datos incompletos

Hay columnas vacias porque la informacion no llego todavia.

```sql
SELECT *
FROM saludos
WHERE mensaje IS NULL;
```

## Caso 4: buscar patrones

Quieres encontrar mensajes que empiecen de cierta forma.

```sql
SELECT *
FROM saludos
WHERE mensaje LIKE 'Hola%';
```
