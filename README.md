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
