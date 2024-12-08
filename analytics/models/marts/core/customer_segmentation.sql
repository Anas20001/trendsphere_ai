WITH customer_metrics AS (
    SELECT 
        s.customer_id,
        COUNT(DISTINCT s.order_id) as total_orders,
        SUM(s.net_with_tax) as total_spent,
        AVG(s.net_with_tax) as avg_order_value,
        MAX(d.business_date) as last_order_date,
        MIN(d.business_date) as first_order_date,
        COUNT(DISTINCT s.branch_id) as visited_branches
    FROM {{ ref('stg_sales') }} s
    JOIN dates d ON s.date_id = d.id
    GROUP BY s.customer_id
),

customer_segments AS (
    SELECT 
        customer_id,
        total_orders,
        total_spent,
        avg_order_value,
        DATEDIFF(last_order_date, first_order_date) as customer_lifetime_days,
        visited_branches,
        CASE 
            WHEN total_orders >= 10 AND total_spent >= 1000 THEN 'VIP'
            WHEN total_orders >= 5 OR total_spent >= 500 THEN 'Regular'
            ELSE 'New'
        END as segment
    FROM customer_metrics
)

SELECT * FROM customer_segments 