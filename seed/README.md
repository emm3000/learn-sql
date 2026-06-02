# Seed de Practica

Este seed crea una base pequena pero realista para practicar SQL en varias etapas del curso.

## Incluye

- `departments`
- `employees`
- `projects`
- `employee_projects`
- `customers`
- `orders`
- `order_items`

## Como cargarlo

```bash
docker compose exec -T db psql -U postgres -d aprendizaje < seed/classic_company.sql
```

O dentro de `psql`:

```sql
\i /seed/classic_company.sql
```

## Notas

- Es un seed pensado para aprender, no para produccion.
- Puedes correrlo varias veces para resetear el escenario.
- Si luego quieres, lo podemos separar en varios seeds por tema.
