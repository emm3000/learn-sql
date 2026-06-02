# Roadmap Maestro de PostgreSQL

Este roadmap esta pensado para aprender PostgreSQL de forma intensa, practica y progresiva.
La meta no es memorizar sintaxis suelta, sino dominar la herramienta completa:
SQL, modelado, funciones, performance, operaciones y uso real en proyectos.

## Principio de entrenamiento

- Aprende con un objetivo claro por fase.
- Escribe SQL todos los dias.
- Cada tema termina en ejercicios reales.
- Si no puedes explicar algo con tus palabras, todavia no lo dominas.
- No saltes fases por ansiedad: primero base solida, luego velocidad.

## Fase 0: Setup minimo

### Objetivo
Tener un entorno simple para practicar sin friccion.

### Debes dominar
- Docker
- Docker Compose
- `psql`
- levantar y apagar una base local
- conectar desde terminal

### Practica
- levantar PostgreSQL con Docker
- crear una base de datos
- crear un usuario
- conectar con `psql`
- ejecutar una query simple

### Meta
Poder iniciar una base y entrar a ella sin buscar tutorial.

## Fase 1: SQL base

### Objetivo
Escribir consultas basicas de forma natural.

### Debes dominar
- `SELECT`
- `FROM`
- `WHERE`
- `ORDER BY`
- `LIMIT`
- `INSERT`
- `UPDATE`
- `DELETE`
- `DISTINCT`
- `NULL`
- operadores logicos
- comparaciones

### Practica
- 20 queries cortas por dia
- filtrar datos por condiciones distintas
- insertar, actualizar y borrar registros
- ordenar resultados
- detectar errores por `NULL`

### Meta
Poder leer una tabla y consultar lo que necesitas sin dudar demasiado.

## Fase 2: Relaciones y joins

### Objetivo
Entender como se conectan los datos entre tablas.

### Debes dominar
- claves primarias
- claves foraneas
- relaciones 1 a 1
- relaciones 1 a muchos
- relaciones muchos a muchos
- `INNER JOIN`
- `LEFT JOIN`
- `RIGHT JOIN`
- `FULL JOIN`
- alias de tablas

### Practica
- modelar usuarios, pedidos y productos
- resolver preguntas usando joins
- explicar por que cada join devuelve lo que devuelve
- detectar joins incorrectos o incompletos

### Meta
Poder moverte entre tablas como si fuera un mapa conocido.

## Fase 3: Agregacion y analitica

### Objetivo
Responder preguntas de negocio con SQL.

### Debes dominar
- `COUNT`
- `SUM`
- `AVG`
- `MIN`
- `MAX`
- `GROUP BY`
- `HAVING`
- subqueries
- `WITH` / CTEs

### Practica
- ventas por dia
- pedidos por usuario
- productos mas vendidos
- segmentos por categoria
- reescribir una query en varias formas

### Meta
Pensar en terminos de preguntas y resultados, no solo de sintaxis.

## Fase 4: Modelado y diseno de esquema

### Objetivo
Crear bases de datos limpias y resistentes a errores.

### Debes dominar
- tipos de datos
- `PRIMARY KEY`
- `FOREIGN KEY`
- `NOT NULL`
- `UNIQUE`
- `CHECK`
- `DEFAULT`
- normalizacion basica
- convenciones de nombres
- diseno para lectura y escritura

### Practica
- redisenar una tabla mal hecha
- detectar duplicados y datos invalidos
- crear un esquema desde cero
- decidir que va en cada tabla

### Meta
Poner buenas reglas antes de que los datos se conviertan en basura.

## Fase 5: Functions, procedures y logica en la base

### Objetivo
Encapsular logica util dentro de PostgreSQL cuando tenga sentido.

### Debes dominar
- `CREATE FUNCTION`
- parametros
- valores de retorno
- `RETURNS TABLE`
- `RETURNS SETOF`
- funciones en `SQL`
- funciones en `PL/pgSQL`
- `IF`
- `CASE`
- `LOOP`
- `EXCEPTION`
- diferencia entre `FUNCTION` y `PROCEDURE`

### Practica
- funcion simple que retorna un valor
- funcion que retorna filas
- funcion con logica condicional
- funcion que valida o transforma datos
- procedimiento para operaciones controladas

### Meta
Saber cuando la logica debe vivir en SQL y cuando no.

## Fase 6: Views, materialized views y triggers

### Objetivo
Reutilizar consultas y automatizar reglas comunes.

### Debes dominar
- `VIEW`
- `MATERIALIZED VIEW`
- `TRIGGER`
- `BEFORE`
- `AFTER`
- `INSTEAD OF`
- casos de auditoria
- casos de validacion

### Practica
- crear vistas para simplificar consultas
- crear una materialized view para un reporte
- disparar una accion automatica con un trigger
- registrar cambios de datos

### Meta
Construir automatizacion util, no magia innecesaria.

## Fase 7: Transacciones y concurrencia

### Objetivo
Manejar cambios de datos con seguridad.

### Debes dominar
- `BEGIN`
- `COMMIT`
- `ROLLBACK`
- aislamiento
- locks
- bloqueos
- deadlocks
- consistencia
- idempotencia

### Practica
- transacciones exitosas
- transacciones que fallan y retroceden
- simular cambios concurrentes
- entender que pasa cuando dos procesos tocan la misma fila

### Meta
No romper datos cuando hay mas de una operacion ocurriendo al mismo tiempo.

## Fase 8: Performance y optimizacion

### Objetivo
Entender por que una query va lenta y arreglarla.

### Debes dominar
- indices
- selectividad
- cardinalidad
- `EXPLAIN`
- `EXPLAIN ANALYZE`
- planner
- nested loop
- hash join
- merge join
- `VACUUM`
- `ANALYZE`
- autovacuum
- bloat
- tuning basico

### Practica
- comparar una query con y sin indice
- revisar planes de ejecucion
- detectar scans costosos
- elegir el indice correcto
- evitar indices inutiles

### Meta
No solo hacer que funcione, sino entender por que funciona asi.

## Fase 9: Features avanzadas de PostgreSQL

### Objetivo
Conocer lo que hace especial a PostgreSQL.

### Debes dominar
- `JSONB`
- arrays
- `UUID`
- `ENUM`
- full-text search
- rangos
- `UPSERT` con `ON CONFLICT`
- particionamiento
- schemas
- extensiones

### Practica
- guardar y consultar JSONB
- buscar texto de forma eficiente
- usar `ON CONFLICT`
- particionar una tabla grande
- trabajar con tipos especiales

### Meta
Elegir la herramienta correcta para cada caso real.

## Fase 10: Operacion y administracion

### Objetivo
Poder sostener una base en un entorno real.

### Debes dominar
- roles
- permisos
- seguridad
- backups
- restore
- `pg_dump`
- `pg_restore`
- logs
- monitoreo
- mantenimiento
- replicacion basica

### Practica
- crear roles con permisos distintos
- hacer backup y restore
- revisar logs
- identificar consultas lentas
- pensar en recuperacion ante fallos

### Meta
Operar PostgreSQL con criterio de produccion.

## Fase 11: Casos de uso reales

### Objetivo
Aplicar lo aprendido en proyectos reales.

### Casos recomendados
- blog
- ecommerce
- sistema de tareas
- inventario
- CRM simple
- tracker de gastos
- analytics basico
- auditoria de eventos

### Practica
- diseñar el esquema
- escribir consultas reales
- agregar funciones utiles
- medir rendimiento
- refactorizar el modelo

### Meta
Poder construir una app o backend pequeno con base solida.

## Rutina diaria recomendada

### Opcion corta
- 10 min: repaso
- 20 min: tema nuevo
- 30 min: ejercicios
- 10 min: correccion

### Opcion intensa
- 15 min: repaso
- 30 min: teoria aplicable
- 45 min: ejercicios
- 30 min: mini proyecto
- 15 min: documentar aprendizajes

### Regla
Si no escribiste SQL, ese dia no conto.

## Metodo de evaluacion

Vas bien si puedes hacer esto sin ayuda constante:

- crear tablas correctas
- escribir joins sin copiar ejemplos
- agrupar y analizar datos
- usar funciones con criterio
- leer planes de ejecucion
- detectar problemas de performance
- hacer transacciones seguras
- diseñar un mini sistema desde cero

## Proyectos para practicar

### Nivel 1
- lista de tareas
- agenda de contactos
- inventario simple

### Nivel 2
- blog con comentarios
- tienda con pedidos
- sistema de reservas

### Nivel 3
- CRM basico
- tracker de gastos
- tablero de metricas
- sistema multiusuario con permisos

## Orden recomendado de estudio

1. Setup minimo
2. SQL base
3. Joins y relaciones
4. Agregacion y CTEs
5. Modelado de esquema
6. Functions y procedures
7. Views y triggers
8. Transacciones y concurrencia
9. Performance y indices
10. Features avanzadas
11. Operacion y administracion
12. Proyectos reales

## Regla final

PostgreSQL no se aprende solo leyendo sintaxis.
Se aprende escribiendo consultas, rompiendo cosas en un entorno seguro, corrigiendolas y repitiendo hasta que se vuelvan parte de tu instinto.

