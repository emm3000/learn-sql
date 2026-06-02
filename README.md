# PostgreSQL Hola Mundo

Un arranque mínimo con PostgreSQL en Docker usando una imagen liviana basada en Alpine.

## Requisitos

- Docker
- Docker Compose

## Levantar la base

```bash
docker compose up -d
```

La primera vez, PostgreSQL ejecuta automáticamente los scripts de `./sql` al inicializar el volumen.

## Probarlo

```bash
docker compose exec db psql -U postgres -d aprendizaje -c "SELECT * FROM saludos;"
```

También puedes entrar al cliente interactivo:

```bash
docker compose exec db psql -U postgres -d aprendizaje
```

Y correr:

```sql
SELECT 'Hola, mundo desde PostgreSQL' AS mensaje;
```

## Apagar

```bash
docker compose down
```

Si quieres borrar también los datos:

```bash
docker compose down -v
```

## Ruta de estudio

- [Roadmap maestro](./ROADMAP_POSTGRES.md)
- [Workflow de aprendizaje](./WORKFLOW.md)
- [Leccion 01: SELECT](./lessons/01-select/README.md)
- [Leccion 02: INSERT](./lessons/02-insert/README.md)
- [Leccion 03: UPDATE y DELETE](./lessons/03-update-delete/README.md)
- [Leccion 04: Filtros, DISTINCT y NULL](./lessons/04-filtros-distinct-null/README.md)
- [Leccion 05: ORDER BY y LIMIT](./lessons/05-order-by-limit/README.md)
