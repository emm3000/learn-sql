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

