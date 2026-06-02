-- Ejemplo 1: empleados con salario mayor al promedio
SELECT first_name, last_name, salary
FROM employees
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
);

-- Ejemplo 2: departamentos con mas de un empleado usando subquery en FROM
SELECT department_id, total_employees
FROM (
  SELECT department_id, COUNT(*) AS total_employees
  FROM employees
  GROUP BY department_id
) dept_counts
WHERE total_employees > 1;

-- Ejemplo 3: CTE para resumir pedidos por cliente
WITH customer_orders AS (
  SELECT customer_id, COUNT(*) AS total_orders, SUM(total_amount) AS revenue
  FROM orders
  GROUP BY customer_id
)
SELECT *
FROM customer_orders
WHERE revenue > 100;

-- Ejemplo 4: CTE encadenado con join
WITH dept_counts AS (
  SELECT department_id, COUNT(*) AS total_employees
  FROM employees
  GROUP BY department_id
)
SELECT d.name, dc.total_employees
FROM dept_counts dc
JOIN departments d ON d.id = dc.department_id;

