
    
    

select
    product_sk as unique_field,
    count(*) as n_records

from "postgres"."public_staging"."stg_products"
where product_sk is not null
group by product_sk
having count(*) > 1


