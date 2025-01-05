WITH sales_products AS (
    SELECT
        s.branch_id,
        s.customer_id,
        s.order_id,
        s.product_id,
        p.product_name,
        s.net_quantity
    FROM {{ ref('stg_sales') }} s
    JOIN {{ ref('stg_products') }} p ON s.product_id = p.product_id
),

product_pairs AS (
    SELECT
        s1.branch_id,
        s1.customer_id,
        s1.product_id AS product_1_id,
        p1.product_name AS product_1_name,
        s2.product_id AS product_2_id,
        p2.product_name AS product_2_name,
        COUNT(DISTINCT s1.order_id) AS bundle_orders,
        SUM(s1.net_quantity * s2.net_quantity) AS bundle_quantity,
        COUNT(*) AS times_bought_together
    FROM sales_products s1
    JOIN sales_products s2 
        ON s1.order_id = s2.order_id 
        AND s1.product_id < s2.product_id
    JOIN {{ ref('stg_products') }} p1 ON s1.product_id = p1.product_id
    JOIN {{ ref('stg_products') }} p2 ON s2.product_id = p2.product_id
    GROUP BY 1, 2, 3, 4, 5, 6
),

total_orders AS (
    SELECT 
        branch_id,
        customer_id,
        COUNT(DISTINCT order_id) AS total_orders
    FROM {{ ref('stg_sales') }}
    GROUP BY 1, 2
)

SELECT
    pp.*,
    pp.bundle_orders * 100.0 / t.total_orders AS bundle_percentage,
    ROW_NUMBER() OVER (PARTITION BY pp.branch_id, pp.customer_id ORDER BY pp.bundle_orders DESC) AS bundle_rank
FROM product_pairs pp
JOIN total_orders t ON pp.branch_id = t.branch_id AND pp.customer_id = t.customer_id