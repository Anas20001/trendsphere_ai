with source as (
    select * from {{ source('raw', 'orders') }}
),

staged as (
    select
        id as order_id,
        branch_id,
        customer_id,
        order_total,
        status,
        order_date,
        {{ dbt_utils.generate_surrogate_key(['id']) }} as order_sk
    from source
    where status = 'completed' -- Only include completed orders
)

select * from staged 