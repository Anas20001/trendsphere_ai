WITH source AS (
    SELECT * FROM {{ source('raw', 'sales') }}
)

SELECT
    id AS sale_id,
    branch_id,
    customer_id,
    date_id,
    order_id,
    total,
    total_percentage,
    net_with_tax,
    visitors_count,
    discount_amount,
    return_amount,
    cancellation_amount,
    profit,
    created_at,
    updated_at
FROM source 