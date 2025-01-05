WITH source AS (
    SELECT * FROM {{ source('raw', 'orders') }}
)

SELECT
    id AS order_id,
    type AS order_type,
    source AS order_source,
    status,
    external_number,
    coupon_code,
    order_date,
    created_at,
    updated_at
FROM source 