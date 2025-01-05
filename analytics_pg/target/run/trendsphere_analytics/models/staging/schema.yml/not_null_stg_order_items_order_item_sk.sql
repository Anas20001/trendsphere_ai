select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
    



select order_item_sk
from "postgres"."public_staging"."stg_order_items"
where order_item_sk is null



      
    ) dbt_internal_test