WITH sales_products AS (
    SELECT
        s.branch_id,
        s.customer_id,
        s.order_id,
        s.product_id,
        p.product_name,
        s.net_quantity,
        s.net_with_tax,
        s.profit
    FROM {{ ref('stg_sales') }} s
    JOIN {{ ref('stg_products') }} p ON s.product_id = p.product_id
)

SELECT
    branch_id,
    customer_id,
    product_id,
    product_name,
    SUM(net_quantity) as total_quantity_sold,
    SUM(net_with_tax) as total_revenue,
    SUM(profit) as total_profit,
    COUNT(DISTINCT order_id) as number_of_orders
FROM sales_products
GROUP BY 1, 2, 3, 4 