# Casos Reales: UPDATE y DELETE

## Caso 1: corregir un dato

Un usuario escribio mal un mensaje y necesitas corregirlo.

```sql
UPDATE saludos
SET mensaje = 'Mensaje corregido'
WHERE id = 1;
```

## Caso 2: eliminar un registro invalido

Un registro de prueba o error ya no debe existir.

```sql
DELETE FROM saludos
WHERE id = 1;
```

## Caso 3: auditar el cambio

Quieres ver exactamente que fila cambio o se borro.

```sql
UPDATE saludos
SET mensaje = 'Cambio auditado'
WHERE id = 1
RETURNING *;
```

