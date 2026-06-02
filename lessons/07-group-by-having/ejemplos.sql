-- Ejemplo 1: cantidad de empleados por departamento
SELECT department_id, COUNT(*) AS total_employees
FROM employees
GROUP BY department_id;

-- Ejemplo 2: total de salario por departamento
SELECT department_id, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id;

-- Ejemplo 3: salario promedio por departamento
SELECT department_id, AVG(salary) AS average_salary
FROM employees
GROUP BY department_id;

-- Ejemplo 4: departamentos con dos o mas empleados
SELECT department_id, COUNT(*) AS total_employees
FROM employees
GROUP BY department_id
HAVING COUNT(*) >= 2;

-- Ejemplo 5: pedidos por estado
SELECT status, COUNT(*) AS total_orders, SUM(total_amount) AS revenue
FROM orders
GROUP BY status;

