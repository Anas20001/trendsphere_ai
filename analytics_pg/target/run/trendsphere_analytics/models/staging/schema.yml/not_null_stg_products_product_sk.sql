select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
    



select product_sk
from "postgres"."public_staging"."stg_products"
where product_sk is null



      
    ) dbt_internal_test