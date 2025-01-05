with source as (
    select * from {{ source('raw', 'orderitems') }}
),

staged as (
    select
        id as order_item_id,
        order_id,
        product_id,
        quantity,
        item_total,
        {{ dbt_utils.generate_surrogate_key(['id']) }} as order_item_sk
    from source
)

select * from staged 