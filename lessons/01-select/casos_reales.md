# Casos Reales: SELECT

## Caso 1: listar registros

Un panel administrativo quiere ver todos los saldos o mensajes registrados.

```sql
SELECT * FROM saludos;
```

## Caso 2: buscar un registro especifico

Quieres encontrar un dato exacto sin recorrer toda la tabla a mano.

```sql
SELECT *
FROM saludos
WHERE mensaje = 'Hola, mundo desde PostgreSQL';
```

## Caso 3: revisar lo mas reciente

Quieres ver los ultimos registros creados.

```sql
SELECT *
FROM saludos
ORDER BY id DESC
LIMIT 10;
```

