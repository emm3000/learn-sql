-- Ejemplo 1: ver todo
SELECT * FROM saludos;

-- Ejemplo 2: ver una sola columna
SELECT mensaje FROM saludos;

-- Ejemplo 3: filtrar con WHERE
SELECT *
FROM saludos
WHERE mensaje = 'Hola, mundo desde PostgreSQL';

-- Ejemplo 4: ordenar y limitar
SELECT *
FROM saludos
ORDER BY id DESC
LIMIT 5;

