WITH order_details AS (
    SELECT
        s.order_id,
        s.created_at as order_date,
        s.net_with_tax as order_total,
        s.customer_id,
        u.full_name as customer_name,
        JSON_OBJECT(
            'product_name', p.product_name,
            'quantity', s.net_quantity,
            'total', s.net_with_tax
        ) as items
    FROM {{ ref('stg_sales') }} s
    JOIN users u ON s.customer_id = u.id
    JOIN products p ON s.product_id = p.id
    WHERE s.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
)

SELECT
    order_id,
    order_date,
    order_total,
    customer_id,
    customer_name,
    JSON_ARRAYAGG(items) as items
FROM order_details
GROUP BY 1, 2, 3, 4, 5
ORDER BY order_date DESC
LIMIT 50 