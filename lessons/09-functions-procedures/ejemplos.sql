-- Function escalar: nombre completo
CREATE OR REPLACE FUNCTION employee_full_name(p_employee_id integer)
RETURNS text
LANGUAGE sql
AS $$
  SELECT first_name || ' ' || last_name
  FROM employees
  WHERE id = p_employee_id;
$$;

SELECT employee_full_name(1);

-- Function que retorna filas
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

SELECT * FROM employees_in_department(1);

-- Procedure que da aumento
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

CALL give_department_raise(1, 5);

