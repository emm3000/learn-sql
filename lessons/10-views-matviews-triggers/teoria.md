# Teoria: Views, Materialized Views y Triggers

## VIEW

Una `view` es una consulta guardada con nombre.
No guarda datos por si sola, solo define como verlos.

## MATERIALIZED VIEW

Una `materialized view` guarda el resultado de una consulta ya calculada.
Es util para reportes que se consultan mucho y cambian poco.

## TRIGGER

Un `trigger` dispara una accion automatica cuando ocurre un evento, como `INSERT`, `UPDATE` o `DELETE`.

## Idea clave

- `VIEW` = capa de lectura reutilizable
- `MATERIALIZED VIEW` = reporte precalculado
- `TRIGGER` = automatizacion al escribir datos
