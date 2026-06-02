-- Ejemplo 1: insertar una fila
INSERT INTO saludos (mensaje)
VALUES ('Aprendiendo INSERT');

-- Ejemplo 2: insertar y devolver la fila creada
INSERT INTO saludos (mensaje)
VALUES ('Fila nueva')
RETURNING *;

-- Ejemplo 3: insertar varias filas
INSERT INTO saludos (mensaje)
VALUES
  ('Primera fila'),
  ('Segunda fila'),
  ('Tercera fila');

