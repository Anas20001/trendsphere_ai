WITH sales AS (
    SELECT 
        s.*,
        DATE(s.created_at) as sale_date,
        b.branch_name,
        b.branch_reference,
        CASE 
            WHEN s.net_with_tax = 0 THEN 'Zero Value'
            WHEN s.cancellation_amount > 0 THEN 'Cancelled'
            WHEN s.return_amount > 0 THEN 'Returned'
            ELSE 'Regular'
        END as order_category
    FROM {{ ref('stg_sales') }} s
    JOIN {{ ref('stg_branches') }} b ON s.branch_id = b.branch_id
)

SELECT
    branch_id,
    customer_id,
    branch_name,
    branch_reference,
    sale_date as business_date,
    -- Order metrics
    COUNT(DISTINCT order_id) as total_orders,
    COUNT(DISTINCT customer_id) as unique_customers,
    -- Revenue metrics
    SUM(net_with_tax) as total_revenue,
    SUM(profit) as total_profit,
    AVG(net_with_tax) as avg_order_value,
    -- Visitor metrics
    SUM(visitors_count) as total_visitors,
    AVG(avg_value_per_visitor) as avg_value_per_visitor,
    -- Additional metrics
    SUM(net_quantity) as total_items_sold,
    SUM(return_amount) as total_returns,
    SUM(cancellation_amount) as total_cancellations,
    SUM(discount_amount) as total_discounts,
    -- Order category metrics
    COUNT(DISTINCT CASE WHEN order_category = 'Zero Value' THEN order_id END) as zero_value_orders,
    COUNT(DISTINCT CASE WHEN order_category = 'Cancelled' THEN order_id END) as cancelled_orders,
    COUNT(DISTINCT CASE WHEN order_category = 'Returned' THEN order_id END) as returned_orders,
    COUNT(DISTINCT CASE WHEN order_category = 'Regular' THEN order_id END) as regular_orders
FROM sales
GROUP BY 1, 2, 3, 4, 5 