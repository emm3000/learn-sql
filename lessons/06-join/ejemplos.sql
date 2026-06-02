-- Ejemplo 1: empleados con su departamento
SELECT e.first_name, e.last_name, d.name AS department_name
FROM employees e
INNER JOIN departments d ON d.id = e.department_id;

-- Ejemplo 2: empleados con su jefe
SELECT e.first_name AS employee_name,
       m.first_name AS manager_name
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;

-- Ejemplo 3: clientes con sus pedidos
SELECT c.first_name, c.last_name, o.id AS order_id, o.status, o.total_amount
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;

-- Ejemplo 4: proyectos con departamento
SELECT p.name AS project_name, d.name AS department_name
FROM projects p
LEFT JOIN departments d ON d.id = p.department_id;

