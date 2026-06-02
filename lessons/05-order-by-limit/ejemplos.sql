-- Ejemplo 1: ordenar ascendente
SELECT *
FROM saludos
ORDER BY id ASC;

-- Ejemplo 2: ordenar descendente
SELECT *
FROM saludos
ORDER BY id DESC;

-- Ejemplo 3: ordenar por mensaje y luego por id
SELECT *
FROM saludos
ORDER BY mensaje ASC, id DESC;

-- Ejemplo 4: limitar resultados
SELECT *
FROM saludos
ORDER BY id DESC
LIMIT 3;

-- Ejemplo 5: paginacion simple
SELECT *
FROM saludos
ORDER BY id ASC
LIMIT 5 OFFSET 5;

