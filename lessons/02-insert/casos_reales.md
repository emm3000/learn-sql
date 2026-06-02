# Casos Reales: INSERT

## Caso 1: registrar un nuevo evento

Una aplicacion necesita guardar un mensaje o evento nuevo en una tabla.

```sql
INSERT INTO saludos (mensaje)
VALUES ('Evento registrado');
```

## Caso 2: crear varios registros de una vez

Quieres cargar varios valores en una sola operacion.

```sql
INSERT INTO saludos (mensaje)
VALUES
  ('Uno'),
  ('Dos'),
  ('Tres');
```

## Caso 3: obtener el dato creado

Quieres confirmar de inmediato que el registro se guardo bien.

```sql
INSERT INTO saludos (mensaje)
VALUES ('Confirmar insercion')
RETURNING *;
```

