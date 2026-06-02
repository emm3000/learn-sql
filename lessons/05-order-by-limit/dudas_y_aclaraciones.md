# Dudas y Aclaraciones: ORDER BY y LIMIT

## Duda 1

**Puedo usar LIMIT sin ORDER BY**

Si, pero en una base real no siempre es recomendable si necesitas resultados consistentes. Sin orden, no tienes garantia clara de cual fila te devuelve primero.

## Duda 2

**OFFSET es bueno para todo**

No siempre. Para paginas muy profundas puede volverse costoso. En proyectos reales, a veces conviene usar otra estrategia de paginacion.

## Duda 3

**Puedo ordenar por varias columnas**

Si. Eso ayuda mucho cuando hay empates y necesitas un desempate estable.

## Duda 4

**Por que ordenar antes de limitar**

Porque primero decides el orden y luego recortas el resultado. Si lo haces al revés, no controlas bien que filas quedan dentro del corte.

