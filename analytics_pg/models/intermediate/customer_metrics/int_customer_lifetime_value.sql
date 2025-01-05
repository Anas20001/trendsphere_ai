with orders as (
    select * from {{ ref('stg_orders') }}
),

customer_metrics as (
    select
        customer_id,
        count(distinct order_id) as total_orders,
        sum(order_total) as total_spent,
        avg(order_total) as avg_order_value,
        min(order_date) as first_purchase,
        max(order_date) as last_purchase,
        count(distinct date_trunc('month', order_date)) as active_months
    from orders
    group by 1
),

final as (
    select
        *,
        total_spent / nullif(active_months, 0) as monthly_value,
        date_part('day', now() - last_purchase) as days_since_last_purchase
    from customer_metrics
)

select * from final 