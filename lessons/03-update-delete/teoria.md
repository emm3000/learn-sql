# Teoria: UPDATE y DELETE

`UPDATE` sirve para modificar filas existentes.
`DELETE` sirve para borrar filas existentes.

## UPDATE basico

```sql
UPDATE tabla
SET columna = nuevo_valor
WHERE condicion;
```

## UPDATE con RETURNING

```sql
UPDATE saludos
SET mensaje = 'Nuevo mensaje'
WHERE id = 1
RETURNING *;
```

## DELETE basico

```sql
DELETE FROM tabla
WHERE condicion;
```

## DELETE con RETURNING

```sql
DELETE FROM saludos
WHERE id = 1
RETURNING *;
```

## Idea clave

Si olvidas `WHERE`, puedes afectar toda la tabla.
En esta leccion, el filtro importa tanto como la accion.
