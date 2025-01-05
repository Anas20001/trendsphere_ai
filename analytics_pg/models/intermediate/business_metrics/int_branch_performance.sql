with daily_sales as (
    select * from {{ ref('int_daily_sales') }}
),

branch_metrics as (
    select
        branch_id,
        date_trunc('month', date) as month,
        sum(total_sales) as monthly_sales,
        sum(num_orders) as monthly_orders,
        sum(num_customers) as monthly_customers,
        avg(avg_order_value) as avg_order_value,
        sum(total_sales) / sum(num_customers) as revenue_per_customer
    from daily_sales
    group by 1, 2
)

select * from branch_metrics 