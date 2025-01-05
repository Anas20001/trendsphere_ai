WITH product_metrics AS (
    SELECT * FROM {{ ref('int_product_performance') }}
),

product_bundles AS (
    SELECT * FROM {{ ref('fct_product_bundles') }}
),

product_analytics AS (
    SELECT
        pm.branch_id,
        pm.customer_id,
        pm.product_id,
        pm.product_name,
        pm.total_quantity_sold,
        pm.total_revenue,
        pm.total_profit,
        pm.number_of_orders,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'paired_product', pb.product_2_name,
                'times_bought_together', pb.times_bought_together
            )
        ) as common_bundles
    FROM product_metrics pm
    LEFT JOIN product_bundles pb 
        ON pm.product_id = pb.product_1_id
        AND pm.branch_id = pb.branch_id
    GROUP BY 1, 2, 3, 4, 5, 6, 7
)

SELECT * FROM product_analytics 