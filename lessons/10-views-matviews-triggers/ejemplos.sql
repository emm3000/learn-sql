-- View: directorio de empleados con departamento
CREATE OR REPLACE VIEW employee_directory AS
SELECT
  e.id,
  e.first_name,
  e.last_name,
  e.job_title,
  d.name AS department_name
FROM employees e
LEFT JOIN departments d ON d.id = e.department_id;

SELECT * FROM employee_directory ORDER BY id;

-- Materialized view: resumen de ingresos por estado de pedido
DROP MATERIALIZED VIEW IF EXISTS order_revenue_by_status;
CREATE MATERIALIZED VIEW order_revenue_by_status AS
SELECT
  status,
  COUNT(*) AS total_orders,
  SUM(total_amount) AS revenue
FROM orders
GROUP BY status;

SELECT * FROM order_revenue_by_status;

-- Trigger: mantener updated_at en customers
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS updated_at timestamptz;

CREATE OR REPLACE FUNCTION set_customers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION set_customers_updated_at();

UPDATE customers
SET city = city
WHERE id = 1;

SELECT id, first_name, last_name, city, updated_at
FROM customers
ORDER BY id;

