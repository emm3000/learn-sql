# Leccion 10: Views, Materialized Views y Triggers

## Objetivo

Aprender a reutilizar consultas con `VIEW`, precalcular reportes con `MATERIALIZED VIEW` y automatizar reglas con `TRIGGER`.

## Lo que debes dominar

- `CREATE VIEW`
- `CREATE MATERIALIZED VIEW`
- `REFRESH MATERIALIZED VIEW`
- `CREATE TRIGGER`
- `BEFORE` y `AFTER`
- funciones de trigger
- casos de uso y limites

## Flujo de estudio

1. Cargar el seed clasico.
2. Leer la teoria breve.
3. Correr los ejemplos en `psql`.
4. Resolver los ejercicios.
5. Revisar los casos reales.
6. Escribir tus dudas y aclaraciones.

## Seed recomendado

```bash
docker compose exec -T db psql -U postgres -d aprendizaje < seed/classic_company.sql
```

## Archivos de la leccion

- `teoria.md`
- `ejemplos.sql`
- `ejercicios.sql`
- `casos_reales.md`
- `dudas_y_aclaraciones.md`
- `resumen.md`

