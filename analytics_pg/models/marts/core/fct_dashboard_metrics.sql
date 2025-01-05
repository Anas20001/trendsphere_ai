with daily_metrics as (
    select * from {{ ref('int_daily_sales') }}
),

prev_day_metrics as (
    select
        branch_id,
        date,
        total_sales,
        num_customers,
        lag(total_sales) over (partition by branch_id order by date) as prev_day_sales,
        lag(num_customers) over (partition by branch_id order by date) as prev_day_customers
    from daily_metrics
),

final as (
    select
        current_date as metric_date,
        coalesce(sum(dm.total_sales), 0) as total_sales,
        coalesce(sum(dm.num_customers), 0) as total_customers,
        coalesce(round(
            ((sum(dm.total_sales) - sum(pdm.prev_day_sales)) / nullif(sum(pdm.prev_day_sales), 0) * 100)::numeric, 
            2
        ), 0) as sales_growth_pct,
        coalesce(round(
            ((sum(dm.num_customers) - sum(pdm.prev_day_customers)) / nullif(sum(pdm.prev_day_customers), 0) * 100)::numeric,
            2
        ), 0) as customer_growth_pct
    from daily_metrics dm
    left join prev_day_metrics pdm 
        on dm.branch_id = pdm.branch_id 
        and dm.date = pdm.date
    where dm.date >= current_date - interval '1 day'
)

select * from final 