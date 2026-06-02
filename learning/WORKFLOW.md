# Workflow de Aprendizaje

Este repositorio esta pensado para avanzar en temas pequenos, claros y versionados.

## Regla de commits

- Un commit por tema cerrado.
- Un tema se considera cerrado cuando:
  - entendiste la teoria
  - resolviste ejercicios
  - hiciste al menos un caso real
  - dejaste notas de dudas o aclaraciones
- No hace falta un commit por cada ejercicio pequeno.
- Si un tema crece mucho, se puede dividir en subtemas, pero cada bloque debe quedar completo.

## Flujo recomendado por tema

1. Leer la teoria corta.
2. Ejecutar los ejemplos en terminal.
3. Resolver los ejercicios sin mirar la respuesta.
4. Probar un caso de uso real.
5. Anotar dudas, errores y aclaraciones.
6. Hacer commit del tema terminado.

## Herramientas

- Terminal con `psql` para practicar de verdad.
- Docker para levantar PostgreSQL local.
- UI solo como apoyo visual, no como reemplazo.

## Estructura de cada leccion

- `teoria.md`
- `ejemplos.sql`
- `ejercicios.sql`
- `casos_reales.md`
- `dudas_y_aclaraciones.md`
- `resumen.md`

## Enfoque obligatorio por leccion

Cada leccion debe responder, ademas de la sintaxis:

- si esto se usa en proyectos reales
- en que casos se usa mucho y en cuales no tanto
- que costo de performance puede tener
- que alternativa puede ser mejor si el problema cambia
- que riesgos o limites aparecen en bases grandes
- como se ve esto en una app real o en un dashboard real

## Enfoque de `dudas_y_aclaraciones`

Esta seccion no debe quedarse en definiciones secas.
Debe responder preguntas de mundo real como:

- que pasa si la tabla ya tiene millones de filas
- que riesgo existe si olvidas un `WHERE`
- cuando conviene usar esta tecnica y cuando no
- que errores aparecen en produccion
- como se comporta con datos sucios o incompletos
- que decision tomar si esto forma parte de una app real
