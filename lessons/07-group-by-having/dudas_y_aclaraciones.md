# Dudas y Aclaraciones: GROUP BY y HAVING

## Duda 1

**Por que no puedo usar cualquier columna en el SELECT**

Porque al agrupar, cada columna seleccionada debe ser parte del grupo o una agregacion. Si no, PostgreSQL no sabe que valor mostrar para ese grupo.

## Duda 2

**Cuando usar HAVING en lugar de WHERE**

Usa `WHERE` para filtrar filas antes de agrupar. Usa `HAVING` cuando el filtro depende del resultado agregado, por ejemplo contar, sumar o promediar.

## Duda 3

**En una base real esto se usa mucho**

Si. Reportes, dashboards, KPIs y resúmenes operativos usan este patron todo el tiempo.

## Duda 4

**Puede ser lento en tablas grandes**

Si, especialmente si no hay indices o si agrupas grandes volúmenes de datos. En bases reales, la forma de agrupar y los filtros previos importan bastante.
