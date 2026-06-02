# Roadmap Maestro de PostgreSQL

Este roadmap esta pensado para aprender PostgreSQL de forma intensa, practica y progresiva.
La meta no es memorizar sintaxis suelta, sino dominar la herramienta completa:
SQL, modelado, analitica, funciones, performance, operaciones y uso real en proyectos.

## Principio de entrenamiento

- Aprende con un objetivo claro por fase.
- Escribe SQL todos los dias.
- Cada tema termina en ejercicios reales.
- Si no puedes explicar algo con tus palabras, todavia no lo dominas.
- No saltes fases por ansiedad: primero base solida, luego velocidad.
- Cada vez que aprendas un comando, pregunta: cuanto cuesta en una tabla grande.

## Mapa general de fases

0. Setup minimo
1. SQL base
2. Tipos de datos, texto y fechas
3. Relaciones y joins
4. Agregacion y analitica (incluye window functions)
5. Subqueries, CTEs, recursividad y LATERAL
6. Modelado, normalizacion e integridad
7. Functions, procedures y logica en la base
8. Views, materialized views y triggers
9. Transacciones, MVCC y concurrencia
10. Indices y estructuras de acceso
11. Performance, EXPLAIN y planner
12. Features avanzadas de PostgreSQL
13. Seguridad, roles y RLS
14. Migraciones y evolucion de esquema
15. Integracion con aplicaciones
16. Operacion y administracion
17. Casos de uso reales

## Fase 0: Setup minimo

### Objetivo

Tener un entorno simple para practicar sin friccion.

### Debes dominar

- Docker
- Docker Compose
- `psql` y sus meta-comandos (`\dt`, `\d tabla`, `\l`, `\du`, `\timing`, `\x`)
- archivo `.psqlrc` para una sesion comoda
- levantar y apagar una base local
- conectar desde terminal

### Practica

- levantar PostgreSQL con Docker
- crear una base de datos
- crear un usuario
- conectar con `psql`
- ejecutar una query simple
- activar `\timing` y leer cuanto tarda una query

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
- `LIMIT` y `OFFSET`
- `INSERT`
- `UPDATE`
- `DELETE`
- `RETURNING`
- `DISTINCT`
- `NULL` y logica de tres valores
- operadores logicos (`AND`, `OR`, `NOT`)
- comparaciones (`=`, `<>`, `BETWEEN`, `IN`, `IS NULL`)
- `CASE` para logica condicional
- `COALESCE` y `NULLIF`

### Practica

- 20 queries cortas por dia
- filtrar datos por condiciones distintas
- insertar, actualizar y borrar registros
- usar `RETURNING` para ver lo que cambiaste
- ordenar resultados
- detectar errores por `NULL`

### Meta

Poder leer una tabla y consultar lo que necesitas sin dudar demasiado.

## Fase 2: Tipos de datos, texto y fechas

### Objetivo

Entender que guarda cada columna y como manipular texto y tiempo sin sorpresas.

### Debes dominar

- numericos (`integer`, `bigint`, `numeric`, `real` vs `double precision`)
- texto (`text` vs `varchar`, cuando usar cada uno)
- booleanos
- conversiones de tipo (`CAST`, `::`)
- funciones de texto (`lower`, `upper`, `trim`, `concat`, `substring`, `length`, `split_part`)
- patrones (`LIKE`, `ILIKE`, `SIMILAR TO`, expresiones regulares con `~`)
- fechas y horas (`date`, `timestamp`, `timestamptz`)
- zonas horarias y por que `timestamptz` casi siempre gana
- intervalos y aritmetica de fechas
- `generate_series` para crear rangos de prueba
- `date_trunc`, `extract`, `age`, `now`

### Practica

- agrupar ventas por dia, semana y mes con `date_trunc`
- calcular antiguedad o tiempo transcurrido
- limpiar texto sucio (espacios, mayusculas, nulos)
- buscar con `ILIKE` y con regex
- generar series de fechas para rellenar huecos en un reporte

### Meta

Que ningun tipo de dato te sorprenda y que las fechas dejen de ser un dolor de cabeza.

## Fase 3: Relaciones y joins

### Objetivo

Entender como se conectan los datos entre tablas.

### Debes dominar

- claves primarias
- claves foraneas
- relaciones 1 a 1
- relaciones 1 a muchos
- relaciones muchos a muchos (tabla intermedia)
- `INNER JOIN`
- `LEFT JOIN`
- `RIGHT JOIN`
- `FULL JOIN`
- `CROSS JOIN`
- `SELF JOIN`
- `ON` vs `USING`
- por que evitar `NATURAL JOIN`
- alias de tablas

### Practica

- modelar usuarios, pedidos y productos
- resolver preguntas usando joins
- explicar por que cada join devuelve lo que devuelve
- usar un self join (jerarquia de empleados, jefe directo)
- detectar joins incorrectos o incompletos (filas duplicadas, filas perdidas)

### Meta

Poder moverte entre tablas como si fuera un mapa conocido.

## Fase 4: Agregacion y analitica

### Objetivo

Responder preguntas de negocio con SQL, incluyendo analitica avanzada.

### Debes dominar

- `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- `GROUP BY`
- `HAVING`
- `FILTER (WHERE ...)` en agregados
- `DISTINCT ON`
- `GROUPING SETS`, `ROLLUP`, `CUBE`
- window functions: `OVER (PARTITION BY ... ORDER BY ...)`
- `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`
- `LAG`, `LEAD`, `FIRST_VALUE`, `LAST_VALUE`
- totales acumulados (running totals) y promedios moviles
- frames de ventana (`ROWS BETWEEN ...`)

### Practica

- ventas por dia, por usuario, por categoria
- top 3 productos por categoria con `ROW_NUMBER`
- ranking de clientes por gasto
- diferencia de ventas contra el mes anterior con `LAG`
- total acumulado de ingresos a lo largo del tiempo
- subtotales y gran total con `ROLLUP`
- reescribir una query en varias formas y comparar

### Meta

Pensar en terminos de preguntas y resultados, y resolver analitica sin subqueries horribles.

## Fase 5: Subqueries, CTEs, recursividad y LATERAL

### Objetivo

Estructurar consultas complejas en pasos claros y resolver problemas jerarquicos.

### Debes dominar

- subqueries en `SELECT`, `FROM` y `WHERE`
- subqueries correlacionadas
- `EXISTS` vs `IN` vs `JOIN`
- `WITH` (CTEs) para legibilidad
- `WITH RECURSIVE` para jerarquias, arboles y grafos
- `LATERAL` joins para subqueries que dependen de cada fila
- cuando un CTE ayuda y cuando esconde un problema de performance

### Practica

- empleados con salario mayor al promedio (correlacionada)
- reescribir una query larga en pasos con `WITH`
- recorrer una jerarquia de categorias o empleados con `WITH RECURSIVE`
- traer los 3 ultimos pedidos de cada cliente con `LATERAL`
- comparar `EXISTS` vs `IN` en una tabla grande

### Meta

Romper un problema grande en piezas legibles sin perder rendimiento.

## Fase 6: Modelado, normalizacion e integridad

### Objetivo

Crear bases de datos limpias y resistentes a errores.

### Debes dominar

- tipos de datos elegidos con criterio
- `PRIMARY KEY` (natural vs surrogate)
- `FOREIGN KEY` y acciones (`ON DELETE CASCADE`, `RESTRICT`, `SET NULL`)
- `NOT NULL`
- `UNIQUE` (simple y compuesta)
- `CHECK`
- `DEFAULT`
- constraints diferidas (`DEFERRABLE`)
- constraints de exclusion (`EXCLUDE`)
- normalizacion (1NF, 2NF, 3NF) y cuando desnormalizar a proposito
- convenciones de nombres
- columnas de auditoria (`created_at`, `updated_at`)
- soft delete vs hard delete
- diseno para lectura y escritura

### Practica

- redisenar una tabla mal hecha
- detectar duplicados y datos invalidos
- crear un esquema desde cero con todas las constraints
- usar un `CHECK` para impedir datos imposibles
- decidir que va en cada tabla y por que

### Meta

Poner buenas reglas antes de que los datos se conviertan en basura.

## Fase 7: Functions, procedures y logica en la base

### Objetivo

Encapsular logica util dentro de PostgreSQL cuando tenga sentido.

### Debes dominar

- `CREATE FUNCTION`
- parametros de entrada y salida
- valores de retorno (`RETURNS valor`, `RETURNS TABLE`, `RETURNS SETOF`)
- funciones en `SQL` vs `PL/pgSQL` y sus tradeoffs
- categorias de volatilidad (`IMMUTABLE`, `STABLE`, `VOLATILE`) y por que importan
- `IF`, `CASE`, `LOOP`, `FOR`
- manejo de errores con `EXCEPTION`
- `SECURITY DEFINER` vs `INVOKER`
- diferencia entre `FUNCTION` y `PROCEDURE` (y por que un procedure puede manejar transacciones)

### Practica

- funcion escalar que retorna un valor
- funcion que retorna filas (`RETURNS TABLE`)
- funcion con logica condicional
- funcion que valida o transforma datos
- procedimiento para operaciones controladas con commit interno
- marcar bien la volatilidad y ver el impacto en el planner

### Meta

Saber cuando la logica debe vivir en SQL y cuando no.

## Fase 8: Views, materialized views y triggers

### Objetivo

Reutilizar consultas y automatizar reglas comunes.

### Debes dominar

- `VIEW`
- views actualizables y `WITH CHECK OPTION`
- `MATERIALIZED VIEW`
- `REFRESH MATERIALIZED VIEW` (y `CONCURRENTLY`)
- `TRIGGER`
- `BEFORE`, `AFTER`, `INSTEAD OF`
- triggers a nivel fila vs sentencia
- funciones de trigger
- casos de auditoria y validacion
- cuando un trigger es util y cuando es magia peligrosa

### Practica

- crear vistas para simplificar consultas
- crear una materialized view para un reporte pesado
- refrescar la materialized view tras un cambio
- trigger que mantiene `updated_at`
- trigger de auditoria que registra cambios en otra tabla
- comparar view vs materialized view vs tabla base

### Meta

Construir automatizacion util, no magia innecesaria.

## Fase 9: Transacciones, MVCC y concurrencia

### Objetivo

Manejar cambios de datos con seguridad cuando hay varios procesos a la vez.

### Debes dominar

- `BEGIN`, `COMMIT`, `ROLLBACK`
- `SAVEPOINT`
- como funciona MVCC en PostgreSQL
- niveles de aislamiento (`READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE`)
- anomalias (dirty read, non-repeatable read, phantom, write skew)
- locks de fila y de tabla
- `SELECT ... FOR UPDATE` y `FOR SHARE`
- `SKIP LOCKED` y `NOWAIT`
- deadlocks: como ocurren y como evitarlos
- idempotencia y consistencia

### Practica

- transacciones exitosas y transacciones que retroceden
- simular dos sesiones tocando la misma fila
- provocar y resolver un deadlock a proposito
- implementar una cola de trabajo con `FOR UPDATE SKIP LOCKED`
- comparar el comportamiento entre niveles de aislamiento

### Meta

No romper datos cuando hay mas de una operacion ocurriendo al mismo tiempo.

## Fase 10: Indices y estructuras de acceso

### Objetivo

Saber que indice crear, por que, y que cuesta mantenerlo.

### Debes dominar

- como funciona un indice por debajo
- `B-tree` (el default)
- `Hash`
- `GIN` (JSONB, arrays, full-text)
- `GiST` y `SP-GiST` (rangos, geometria, busqueda difusa)
- `BRIN` (tablas enormes ordenadas por tiempo)
- indices parciales
- indices de expresion
- indices multicolumna y por que importa el orden de columnas
- indices `INCLUDE` (covering index) y index-only scans
- indices unicos
- costo de escritura y espacio de cada indice

### Practica

- comparar una query con y sin indice
- elegir el indice correcto para un patron de consulta
- crear un indice parcial (solo filas activas)
- crear un indice de expresion (sobre `lower(email)`)
- detectar indices inutiles que solo ocupan espacio
- ver un index-only scan en `EXPLAIN`

### Meta

Crear el indice justo, no un indice por las dudas.

## Fase 11: Performance, EXPLAIN y planner

### Objetivo

Entender por que una query va lenta y arreglarla con criterio.

### Debes dominar

- selectividad y cardinalidad
- `EXPLAIN`
- `EXPLAIN (ANALYZE, BUFFERS)`
- como leer un plan de ejecucion
- estimacion vs realidad (filas estimadas vs reales)
- tipos de scan (seq scan, index scan, index-only scan, bitmap scan)
- tipos de join (nested loop, hash join, merge join)
- el optimizador basado en costos
- estadisticas del planner (`ANALYZE`, `n_distinct`, estadisticas extendidas)
- `pg_stat_statements` para encontrar las queries mas pesadas
- reescritura de queries para ayudar al planner

### Practica

- revisar planes de ejecucion reales
- detectar scans costosos y arreglarlos
- encontrar una mala estimacion del planner y corregirla con estadisticas
- usar `pg_stat_statements` para rankear queries lentas
- comparar el plan antes y despues de un indice

### Meta

No solo hacer que funcione, sino entender por que funciona asi.

## Fase 12: Features avanzadas de PostgreSQL

### Objetivo

Conocer lo que hace especial a PostgreSQL y elegir bien.

### Debes dominar

- `JSONB`: operadores (`->`, `->>`, `@>`, `?`), `jsonb_path_query`, indexado con `GIN`
- `JSON` vs `JSONB` y cuando usar cada uno
- arrays y sus operadores
- `UUID` (y cuando conviene sobre `bigint`)
- `ENUM`
- tipos de rango (`int4range`, `tstzrange`)
- full-text search (`tsvector`, `tsquery`, ranking, `GIN`)
- busqueda difusa con `pg_trgm`
- `UPSERT` con `ON CONFLICT`
- particionamiento (range, list, hash)
- schemas (namespaces logicos)
- extensiones (`pg_trgm`, `pgcrypto`, `uuid-ossp`, `citext`, `hstore`, `postgis`)

### Practica

- guardar y consultar `JSONB` con indice `GIN`
- implementar busqueda de texto eficiente con ranking
- busqueda por similitud con `pg_trgm`
- usar `ON CONFLICT` para insertar o actualizar
- particionar una tabla grande por fecha
- elegir entre columna normal y `JSONB` para un caso real

### Meta

Elegir la herramienta correcta para cada caso real.

## Fase 13: Seguridad, roles y RLS

### Objetivo

Controlar quien ve y quien cambia cada dato.

### Debes dominar

- roles vs usuarios
- `GRANT` y `REVOKE`
- privilegios a nivel tabla, columna y schema
- `DEFAULT PRIVILEGES`
- Row-Level Security (`ENABLE ROW LEVEL SECURITY`, `CREATE POLICY`)
- multi-tenant con RLS
- `SECURITY DEFINER` con cuidado
- conexiones SSL
- manejo de secretos y credenciales
- principio de menor privilegio

### Practica

- crear roles con permisos distintos (lectura, escritura, admin)
- restringir columnas sensibles
- implementar RLS para que cada tenant vea solo sus filas
- probar que un rol no puede ver lo que no debe
- revisar privilegios efectivos de un rol

### Meta

Que la base proteja los datos aunque la app tenga un bug.

## Fase 14: Migraciones y evolucion de esquema

### Objetivo

Cambiar un esquema en produccion sin romper nada ni frenar el servicio.

### Debes dominar

- DDL transaccional en PostgreSQL (la mayoria de los `ALTER` son transaccionales)
- agregar columnas de forma segura
- backfill de datos en lotes
- agregar constraints con `NOT VALID` y luego `VALIDATE`
- crear indices con `CREATE INDEX CONCURRENTLY`
- cambios sin downtime (expand and contract)
- versionado de esquema y herramientas (Flyway, Liquibase, sqitch, dbmate, migraciones del framework)
- como revertir una migracion
- locks que toma cada `ALTER` y por que importan

### Practica

- escribir una migracion que agrega una columna `NOT NULL` sin bloquear la tabla
- agregar una foreign key sin frenar escrituras
- crear un indice en una tabla grande sin downtime
- planear un cambio en dos pasos (expand / contract)
- escribir el rollback de una migracion

### Meta

Evolucionar la base con la misma seguridad que el codigo.

## Fase 15: Integracion con aplicaciones

### Objetivo

Conectar PostgreSQL con una app real sin caer en trampas clasicas.

### Debes dominar

- conexion desde una app y ciclo de vida de la conexion
- connection pooling (pgBouncer) y por que se necesita
- prepared statements
- inyeccion SQL y como prevenirla (consultas parametrizadas)
- el problema N+1 y como detectarlo
- ORM vs SQL crudo: tradeoffs
- `LISTEN` / `NOTIFY` para eventos en tiempo real
- colas de trabajo con `FOR UPDATE SKIP LOCKED`
- transacciones desde el lado de la app
- timeouts (`statement_timeout`, `idle_in_transaction_session_timeout`)

### Practica

- conectar una app pequena a la base
- reproducir un N+1 y arreglarlo
- implementar una cola de tareas con SKIP LOCKED
- usar `LISTEN`/`NOTIFY` para notificar un cambio
- configurar un pool y medir el efecto

### Meta

Que la base y la app convivan sin sorpresas en produccion.

## Fase 16: Operacion y administracion

### Objetivo

Poder sostener una base en un entorno real.

### Debes dominar

- backups: `pg_dump`, `pg_restore`, `pg_basebackup`
- restore y verificacion del backup
- WAL y Point-In-Time Recovery (PITR)
- replicacion (streaming fisica y logica)
- alta disponibilidad y failover (concepto)
- monitoreo: `pg_stat_activity`, `pg_stat_statements`, `pg_stat_user_tables`
- `VACUUM`, `ANALYZE`, autovacuum
- bloat: que es, como detectarlo, como combatirlo
- transaction ID wraparound (por que el autovacuum no es opcional)
- tuning del servidor (`shared_buffers`, `work_mem`, `effective_cache_size`, `maintenance_work_mem`)
- logs y como leerlos (`log_min_duration_statement`)
- upgrades de version

### Practica

- hacer backup y restore completo, y verificar que sirve
- simular una recuperacion ante fallo
- revisar conexiones activas y matar una query colgada
- identificar consultas lentas desde los logs
- detectar bloat en una tabla y limpiarlo
- ajustar un parametro de memoria y medir el efecto

### Meta

Operar PostgreSQL con criterio de produccion.

## Fase 17: Casos de uso reales

### Objetivo

Aplicar lo aprendido en proyectos reales de punta a punta.

### Casos recomendados

- blog con comentarios
- ecommerce con pedidos e inventario
- sistema de tareas con cola de trabajo
- CRM simple multi-tenant (con RLS)
- tracker de gastos con reportes analiticos
- analytics basico con materialized views
- auditoria de eventos con triggers

### Practica

- disenar el esquema desde cero con constraints
- escribir consultas reales (incluyendo analitica con window functions)
- agregar funciones, vistas y triggers utiles
- medir rendimiento con `EXPLAIN ANALYZE`
- escribir migraciones para evolucionar el modelo
- refactorizar el modelo cuando aparece un requisito nuevo

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

- crear tablas correctas con sus constraints
- escribir joins sin copiar ejemplos
- agrupar y analizar datos
- resolver un ranking o un total acumulado con window functions
- recorrer una jerarquia con `WITH RECURSIVE`
- usar funciones con criterio
- leer un plan de ejecucion y explicar el cuello de botella
- elegir el indice correcto para una query lenta
- hacer transacciones seguras y entender el nivel de aislamiento
- escribir una migracion sin downtime
- proteger datos con roles y RLS
- disenar un mini sistema desde cero

## Proyectos para practicar

### Nivel 1

- lista de tareas
- agenda de contactos
- inventario simple

### Nivel 2

- blog con comentarios
- tienda con pedidos
- sistema de reservas (con constraints de exclusion)

### Nivel 3

- CRM basico multi-tenant con RLS
- tracker de gastos con reportes analiticos
- tablero de metricas con materialized views
- sistema multiusuario con permisos y auditoria

## Orden recomendado de estudio

1. Setup minimo
2. SQL base
3. Tipos de datos, texto y fechas
4. Relaciones y joins
5. Agregacion y analitica (con window functions)
6. Subqueries, CTEs, recursividad y LATERAL
7. Modelado, normalizacion e integridad
8. Functions y procedures
9. Views, materialized views y triggers
10. Transacciones, MVCC y concurrencia
11. Indices y estructuras de acceso
12. Performance, EXPLAIN y planner
13. Features avanzadas
14. Seguridad, roles y RLS
15. Migraciones y evolucion de esquema
16. Integracion con aplicaciones
17. Operacion y administracion
18. Proyectos reales

## Regla final

PostgreSQL no se aprende solo leyendo sintaxis.
Se aprende escribiendo consultas, rompiendo cosas en un entorno seguro, corrigiendolas y repitiendo hasta que se vuelvan parte de tu instinto.
