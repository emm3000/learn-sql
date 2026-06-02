-- Ejemplo 1: actualizar una fila
UPDATE saludos
SET mensaje = 'Hola actualizado'
WHERE id = 1;

-- Ejemplo 2: actualizar y devolver la fila modificada
UPDATE saludos
SET mensaje = 'Hola con RETURNING'
WHERE id = 1
RETURNING *;

-- Ejemplo 3: borrar una fila
DELETE FROM saludos
WHERE id = 1;

-- Ejemplo 4: borrar y devolver la fila borrada
DELETE FROM saludos
WHERE id = 1
RETURNING *;

