WITH staff_metrics AS (
    SELECT
        s.id AS staff_id,
        s.branch_id,
        b.business_id,
        DATE_TRUNC('day', sh.start_time) AS work_date,
        COUNT(DISTINCT o.id) AS orders_handled,
        SUM(o.total_amount) AS total_sales,
        SUM(EXTRACT(EPOCH FROM (sh.end_time - sh.start_time))) / 3600 AS hours_worked
    FROM {{ ref('staff') }} s
    JOIN {{ ref('shifts') }} sh ON s.id = sh.staff_id
    JOIN {{ ref('orders') }} o ON s.branch_id = o.branch_id
    JOIN {{ ref('branches') }} b ON s.branch_id = b.id
    WHERE o.status = 'completed'
    AND o.created_at BETWEEN sh.start_time AND sh.end_time
    GROUP BY 1, 2, 3, 4
)

SELECT
    *,
    total_sales / NULLIF(hours_worked, 0) AS sales_per_hour,
    orders_handled / NULLIF(hours_worked, 0) AS orders_per_hour
FROM staff_metrics