with source as (
    select * from "postgres"."public"."orderitems"
),

staged as (
    select
        id as order_item_id,
        order_id,
        product_id,
        quantity,
        item_total,
        md5(cast(coalesce(cast(id as TEXT), '_dbt_utils_surrogate_key_null_') as TEXT)) as order_item_sk
    from source
)

select * from staged