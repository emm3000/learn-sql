# Dudas y Aclaraciones: Filtros, DISTINCT y NULL

## Duda 1

**Por que `NULL` no se compara con `=`**

Porque `NULL` no representa un valor concreto, representa ausencia de valor. En SQL se usa `IS NULL`.

## Duda 2

**Cuando usar `DISTINCT`**

Cuando de verdad necesitas eliminar repetidos en el resultado. En bases reales, muchas veces es una solucion rapida, pero no siempre sustituye un buen modelo de datos.

## Duda 3

**Que pasa si olvido que una columna puede ser `NULL`**

Tu query puede devolver menos resultados de los que esperas o comportarse de forma confusa en filtros y joins.

## Duda 4

**`LIKE` sirve siempre**

Sirve para buscar patrones simples, pero en tablas grandes o busquedas complejas puede no ser lo mas eficiente.
