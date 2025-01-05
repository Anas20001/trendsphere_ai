WITH product_sales AS (
    SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.category,
        b.id AS branch_id,
        b.business_id,
        DATE_TRUNC('day', o.created_at) AS sale_date,
        SUM(oi.quantity) AS units_sold,
        SUM(oi.total_amount) AS total_revenue,
        SUM(oi.quantity * p.cost_price) AS total_cost,
        SUM(oi.total_amount - (oi.quantity * p.cost_price)) AS gross_profit
    FROM {{ ref('products') }} p
    JOIN {{ ref('order_items') }} oi ON p.id = oi.product_id
    JOIN {{ ref('orders') }} o ON oi.order_id = o.id
    JOIN {{ ref('branches') }} b ON o.branch_id = b.id
    WHERE o.status = 'completed'
    GROUP BY 1, 2, 3, 4, 5, 6
)

SELECT
    *,
    gross_profit / NULLIF(total_revenue, 0) * 100 AS profit_margin,
    ROW_NUMBER() OVER (PARTITION BY branch_id, sale_date ORDER BY units_sold DESC) AS popularity_rank
FROM product_sales