
  create view "postgres"."public_staging"."stg_branches__dbt_tmp"
    
    
  as (
    with source as (
    select * from "postgres"."public"."branches"
),

staged as (
    select
        id as branch_id,
        name,
        city,
        state,
        country,
        business_id,
        md5(cast(coalesce(cast(id as TEXT), '_dbt_utils_surrogate_key_null_') as TEXT)) as branch_sk,
        created_at
    from source
)

select * from staged
  );