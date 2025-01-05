with customer_value as (
    select * from {{ ref('int_customer_lifetime_value') }}
),

segments as (
    select
        customer_id,
        case 
            when total_spent >= percentile_cont(0.9) within group (order by total_spent)
                then 'VIP'
            when total_spent >= percentile_cont(0.7) within group (order by total_spent)
                then 'Regular'
            when days_since_last_purchase <= 30
                then 'Active'
            when days_since_last_purchase <= 90
                then 'At Risk'
            else 'Churned'
        end as segment,
        total_spent,
        total_orders,
        monthly_value,
        days_since_last_purchase
    from customer_value
)

select * from segments 