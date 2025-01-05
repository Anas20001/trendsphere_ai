with source as (
    select * from {{ source('raw', 'products') }}
),

staged as (
    select
        id as product_id,
        branch_id,
        name as product_name,
        price,
        {{ dbt_utils.generate_surrogate_key(['id']) }} as product_sk
    from source
)

select * from staged 