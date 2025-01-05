with source as (
    select * from {{ source('raw', 'branches') }}
),

staged as (
    select
        id as branch_id,
        name,
        city,
        state,
        country,
        business_id,
        {{ dbt_utils.generate_surrogate_key(['id']) }} as branch_sk,
        created_at
    from source
)

select * from staged 