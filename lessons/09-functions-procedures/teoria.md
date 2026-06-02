# Teoria: Functions y Procedures

Una `function` devuelve un valor o un conjunto de filas.
Un `procedure` se usa para ejecutar acciones, normalmente con efectos sobre datos.

## Function escalar

```sql
CREATE OR REPLACE FUNCTION employee_full_name(p_employee_id integer)
RETURNS text
LANGUAGE sql
AS $$
  SELECT first_name || ' ' || last_name
  FROM employees
  WHERE id = p_employee_id;
$$;
```

## Function que retorna filas

```sql
CREATE OR REPLACE FUNCTION employees_in_department(p_department_id integer)
RETURNS TABLE (
  id integer,
  first_name text,
  last_name text,
  job_title text
)
LANGUAGE sql
AS $$
  SELECT id, first_name, last_name, job_title
  FROM employees
  WHERE department_id = p_department_id
  ORDER BY id;
$$;
```

## Procedure

```sql
CREATE OR REPLACE PROCEDURE give_department_raise(
  p_department_id integer,
  p_percent numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE employees
  SET salary = salary * (1 + p_percent / 100.0)
  WHERE department_id = p_department_id;
END;
$$;
```

## Idea clave

Usa `function` para reutilizar logica de lectura o calculo.
Usa `procedure` para operaciones controladas que modifican datos.
