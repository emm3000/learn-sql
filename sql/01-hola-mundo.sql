CREATE TABLE IF NOT EXISTS saludos (
  id serial PRIMARY KEY,
  mensaje text NOT NULL
);

INSERT INTO saludos (mensaje)
VALUES ('Hola, mundo desde PostgreSQL')
ON CONFLICT DO NOTHING;

SELECT * FROM saludos;
