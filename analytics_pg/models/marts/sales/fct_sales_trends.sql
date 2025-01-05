with daily_sales as (
    select
        date_trunc('hour', order_date) as time_bucket,
        sum(order_total) as sales_amount,
        count(distinct id) as num_orders
    from {{ ref('stg_orders') }}
    where order_date >= current_date - interval '1 day'
    group by 1
),

weekly_sales as (
    select
        date_trunc('day', order_date) as time_bucket,
        sum(order_total) as sales_amount,
        count(distinct id) as num_orders
    from {{ ref('stg_orders') }}
    where order_date >= current_date - interval '7 days'
    group by 1
),

monthly_sales as (
    select
        date_trunc('day', order_date) as time_bucket,
        sum(order_total) as sales_amount,
        count(distinct id) as num_orders
    from {{ ref('stg_orders') }}
    where order_date >= current_date - interval '30 days'
    group by 1
),

yearly_sales as (
    select
        date_trunc('month', order_date) as time_bucket,
        sum(order_total) as sales_amount,
        count(distinct id) as num_orders
    from {{ ref('stg_orders') }}
    where order_date >= current_date - interval '1 year'
    group by 1
),

final as (
    select 
        'daily' as time_range,
        time_bucket,
        sales_amount,
        num_orders
    from daily_sales
    
    union all
    
    select 
        'weekly' as time_range,
        time_bucket,
        sales_amount,
        num_orders
    from weekly_sales
    
    union all
    
    select 
        'monthly' as time_range,
        time_bucket,
        sales_amount,
        num_orders
    from monthly_sales
    
    union all
    
    select 
        'yearly' as time_range,
        time_bucket,
        sales_amount,
        num_orders
    from yearly_sales
)

select * from final 