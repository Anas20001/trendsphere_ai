with daily_sales as (
    select * from "postgres"."public"."int_daily_sales"
),

branches as (
    select * from "postgres"."public_staging"."stg_branches"
),

final as (
    select
        b.name as branch_name,
        b.city,
        b.state,
        b.country,
        ds.date,
        ds.num_orders,
        ds.num_customers,
        ds.total_sales,
        ds.avg_order_value,
        lag(ds.total_sales) over (partition by b.branch_id order by ds.date) as prev_day_sales,
        (ds.total_sales - lag(ds.total_sales) over (partition by b.branch_id order by ds.date)) / 
            nullif(lag(ds.total_sales) over (partition by b.branch_id order by ds.date), 0) * 100 as sales_growth_pct
    from daily_sales ds
    join branches b on ds.branch_id = b.branch_id
)

select * from final