WITH order_details AS (
    SELECT 
        s.order_id,
        s.branch_id,
        s.customer_id,
        p.product_name,
        ROW_NUMBER() OVER (PARTITION BY s.order_id ORDER BY p.product_name) as product_position
    FROM {{ ref('stg_sales') }} s
    JOIN products p ON s.product_id = p.id
),

product_combinations AS (
    SELECT 
        a.branch_id,
        a.customer_id,
        a.product_name as product_1,
        b.product_name as product_2,
        COUNT(*) as pair_frequency
    FROM order_details a
    JOIN order_details b 
        ON a.order_id = b.order_id 
        AND a.product_position < b.product_position
    GROUP BY 
        a.branch_id,
        a.customer_id,
        a.product_name,
        b.product_name
),

total_orders_per_branch AS (
    SELECT 
        branch_id,
        COUNT(DISTINCT order_id) as total_orders
    FROM {{ ref('stg_sales') }}
    GROUP BY branch_id
)

SELECT 
    pc.branch_id,
    pc.product_1,
    pc.product_2,
    pc.pair_frequency,
    ROUND(pc.pair_frequency * 100.0 / t.total_orders, 2) as pair_percentage
FROM product_combinations pc
JOIN total_orders_per_branch t ON pc.branch_id = t.branch_id 