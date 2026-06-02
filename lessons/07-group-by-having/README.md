# Leccion 07: GROUP BY y HAVING

## Objetivo

Aprender a resumir datos para responder preguntas de negocio: cuantas filas hay por grupo, cuanto suma cada grupo y como filtrar agregados.

## Lo que debes dominar

- `GROUP BY`
- agregaciones
- `COUNT`
- `SUM`
- `AVG`
- `MIN`
- `MAX`
- `HAVING`
- diferencia entre `WHERE` y `HAVING`

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
