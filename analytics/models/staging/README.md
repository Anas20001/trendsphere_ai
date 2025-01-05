# Staging Layer Documentation

## Overview
The staging layer transforms raw MySQL data into standardized, clean models for analytics use.

## Models

### stg_sales
Cleans and standardizes the raw sales table.

**Key Transformations:**
- Renames `id` to `sale_id` for clarity
- Preserves core financial metrics (net_with_tax, total, profit)
- Maintains visitor analytics (visitors_count, avg_value_per_visitor)
- Keeps transaction metadata (date_id, order_id, branch_id)

**Source Fields Used:**
```sql
- id → sale_id
- branch_id
- customer_id
- date_id
- order_id
- total
- net_with_tax
- total_excluding_tax
- net_quantity
- cost
- profit
- visitors_count
- avg_value_per_visitor
- preparation_period
```

### stg_branches
Standardizes branch information.

**Key Transformations:**
- Renames `id` to `branch_id`
- Maintains branch reference data

**Source Fields Used:**
```sql
- id → branch_id
- name
- reference
- created_at
```

### stg_products
Standardizes product catalog data.

**Key Transformations:**
- Renames `id` to `product_id`
- Preserves product identification

**Source Fields Used:**
```sql
- id → product_id
- identification_code
- product_name
- created_at
```

### stg_orders
Standardizes order information.

**Key Transformations:**
- Renames `id` to `order_id`
- Captures order type and source
- Maintains discount information

**Source Fields Used:**
```sql
- id → order_id
- type
- source
- status
- external_number
- coupon_code
- discount_name
- order_date
``` 