-- Ejemplo 1: filtrar una fila exacta
SELECT *
FROM saludos
WHERE id = 1;

-- Ejemplo 2: usar AND
SELECT *
FROM saludos
WHERE id >= 1 AND id <= 10;

-- Ejemplo 3: usar IN
SELECT *
FROM saludos
WHERE id IN (1, 2, 3);

-- Ejemplo 4: usar LIKE
SELECT *
FROM saludos
WHERE mensaje LIKE 'Hola%';

-- Ejemplo 5: detectar duplicados lógicos
SELECT DISTINCT mensaje
FROM saludos;

