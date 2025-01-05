WITH customer_metrics AS (
    SELECT
        c.id AS customer_id,
        c.branch_id,
        b.business_id,
        COUNT(DISTINCT o.id) AS total_orders,
        SUM(o.total_amount) AS total_spent,
        MAX(o.created_at) AS last_order_date,
        MIN(o.created_at) AS first_order_date,
        AVG(o.total_amount) AS avg_order_value
    FROM {{ ref('customers') }} c
    JOIN {{ ref('orders') }} o ON c.id = o.customer_id
    JOIN {{ ref('branches') }} b ON c.branch_id = b.id
    WHERE o.status = 'completed'
    GROUP BY 1, 2, 3
)

SELECT
    *,
    NOW() - last_order_date AS days_since_last_order,
    total_spent / NULLIF(total_orders, 0) AS customer_lifetime_value,
    CASE
        WHEN NOW() - last_order_date <= INTERVAL '30 days' THEN 'active'
        WHEN NOW() - last_order_date <= INTERVAL '90 days' THEN 'at_risk'
        ELSE 'churned'
    END AS customer_status
FROM customer_metrics