# Dudas y Aclaraciones: Subqueries y WITH

## Duda 1

**Cuando usar una subquery**

Cuando necesitas un resultado intermedio solo para resolver la consulta actual.

## Duda 2

**Cuando usar WITH**

Cuando la consulta empieza a tener varios pasos y quieres que sea mas facil de leer y mantener.

## Duda 3

**Es lo mismo que hacer una tabla temporal**

No exactamente. Un CTE es una construccion de la consulta. En algunos casos se comporta muy parecido a una vista temporal logica, pero no es lo mismo que una tabla creada manualmente.

## Duda 4

**En bases reales esto ayuda de verdad**

Si. Cuando los reportes se vuelven largos, `WITH` ayuda mucho a separar logica y a revisar cada paso.

## Duda 5

**Esto se usa mucho en proyectos reales**

Si, sobre todo en reportes, analitica, consultas de negocio y pipelines de lectura donde quieres claridad y pasos intermedios bien nombrados.

## Duda 6

**Hay alternativas mejores a veces**

Si. A veces una vista, una consulta mas simple o incluso una tabla agregada puede ser mejor si el reporte se repite mucho o si el costo de recalcularlo es alto.

## Duda 7

**Puede afectar performance**

Si, dependiendo del tamano de los datos y de como el planner optimize la consulta. En tablas grandes, conviene revisar el plan y no asumir que dividir la query siempre la vuelve mas rapida.
