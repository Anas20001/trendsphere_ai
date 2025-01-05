WITH customer_sales AS (
    SELECT
        customer_id,
        COUNT(DISTINCT order_id) as total_orders,
        SUM(net_with_tax) as total_spent,
        AVG(net_with_tax) as avg_order_value,
        MIN(created_at) as first_purchase,
        MAX(created_at) as last_purchase,
        COUNT(DISTINCT branch_id) as visited_branches,
        SUM(profit) as total_profit
    FROM {{ ref('stg_sales') }}
    GROUP BY customer_id
)

SELECT
    customer_id,
    total_orders,
    total_spent,
    avg_order_value,
    first_purchase,
    last_purchase,
    visited_branches,
    total_profit,
    DATEDIFF(last_purchase, first_purchase) as customer_lifetime_days,
    total_spent / NULLIF(DATEDIFF(last_purchase, first_purchase), 0) as daily_value,
    DATEDIFF(CURRENT_TIMESTAMP, last_purchase) as days_since_last_purchase
FROM customer_sales 