# Leccion 09: Functions y Procedures

## Objetivo

Aprender a encapsular logica en PostgreSQL para reutilizarla en consultas y operaciones controladas.

## Lo que debes dominar

- `CREATE FUNCTION`
- `CREATE PROCEDURE`
- parametros de entrada
- valores de retorno
- `RETURNS TABLE`
- `RETURNS SETOF`
- `PL/pgSQL`
- `IF`
- `CASE`
- `RETURN`
- `CALL`

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
