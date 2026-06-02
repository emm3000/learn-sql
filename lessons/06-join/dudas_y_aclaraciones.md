# Dudas y Aclaraciones: JOIN

## Duda 1

**Por que el `ON` es tan importante**

Porque ahi defines la relacion real entre tablas. Si la condicion esta mal, el join puede devolver resultados incorrectos aunque la consulta “corra bien”.

## Duda 2

**Cuando usar `INNER JOIN`**

Cuando solo quieres filas que existan en ambas tablas.

## Duda 3

**Cuando usar `LEFT JOIN`**

Cuando necesitas conservar todas las filas de la tabla principal aunque falte informacion relacionada.

## Duda 4

**Que pasa en una base real si haces un join sin indices**

En tablas grandes puede volverse lento. El join puede seguir funcionando, pero el costo puede crecer mucho.
