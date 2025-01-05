with orders as (
    select * from {{ ref('stg_orders') }}
),

order_items as (
    select * from {{ ref('stg_order_items') }}
),

products as (
    select * from {{ ref('stg_products') }}
),

customers as (
    select * from {{ ref('stg_customers') }}
),

order_details as (
    select
        o.order_id,
        o.order_date,
        o.order_total,
        c.id as customer_id,
        c.name as customer_name,
        json_agg(
            json_build_object(
                'name', p.name,
                'quantity', oi.quantity,
                'price', p.price
            )
        ) as items
    from orders o
    join customers c on o.customer_id = c.id
    join order_items oi on o.order_id = oi.order_id
    join products p on oi.product_id = p.id
    group by 1, 2, 3, 4, 5
),

final as (
    select *
    from order_details
    where order_date >= current_timestamp - interval '24 hours'
    order by order_date desc
    limit 50
)

select * from final 