WITH customer_metrics AS (
    SELECT * FROM {{ ref('int_customer_lifetime_value') }}
),

customer_details AS (
    SELECT
        cm.*,
        CASE 
            WHEN total_orders >= 10 AND total_spent >= 1000 THEN 'VIP'
            WHEN total_orders >= 5 OR total_spent >= 500 THEN 'Regular'
            WHEN days_since_last_purchase <= 30 THEN 'Active'
            WHEN days_since_last_purchase <= 90 THEN 'At Risk'
            ELSE 'Churned'
        END as segment
    FROM customer_metrics cm
)

SELECT * FROM customer_details 