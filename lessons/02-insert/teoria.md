# Teoria: INSERT

`INSERT` sirve para agregar nuevas filas a una tabla.

## Forma basica

```sql
INSERT INTO tabla (columna_1, columna_2)
VALUES (valor_1, valor_2);
```

## Insertar una sola fila

```sql
INSERT INTO saludos (mensaje)
VALUES ('Hola, mundo');
```

## Insertar varias filas

```sql
INSERT INTO saludos (mensaje)
VALUES
  ('Hola'),
  ('Que tal'),
  ('Bienvenido');
```

## Devolver lo insertado

```sql
INSERT INTO saludos (mensaje)
VALUES ('Hola, mundo')
RETURNING *;
```

## Idea clave

Con `INSERT`, el orden de columnas y valores debe coincidir.
Si te equivocas ahi, puedes guardar datos incorrectos o romper la consulta.

