# TrendSphere Analytics

This dbt project contains the data transformation models for TrendSphere, a business analytics platform.

## Model Structure

The project follows a layered architecture:

### Staging Models (`models/staging/`)
Raw data models that clean and standardize source data:
- `stg_orders.sql` - Cleaned orders data
- `stg_order_items.sql` - Cleaned order items data
- `stg_products.sql` - Cleaned products data
- `stg_customers.sql` - Cleaned customers data

### Intermediate Models (`models/intermediate/`)
Complex calculations and business logic:

**Business Metrics:**
- `int_daily_sales.sql` - Daily sales aggregations
- `int_branch_performance.sql` - Branch performance metrics

**Product Metrics:**
- `int_product_performance.sql` - Product performance analytics

**Customer Metrics:**
- `int_customer_lifetime_value.sql` - Customer value calculations

### Mart Models (`models/marts/`)
Business-domain specific models ready for consumption:

**Core:**
- `fct_orders.sql` - Core order facts
- `fct_dashboard_metrics.sql` - Real-time dashboard metrics
- `fct_recent_transactions.sql` - Recent transaction details

**Sales:**
- `sales_by_branch.sql` - Branch-level sales analytics
- `fct_sales_trends.sql` - Time-based sales trends

**Products:**
- `fct_product_bundles.sql` - Product bundling analysis

**Customers:**
- `dim_customer_segments.sql` - Customer segmentation

## Frontend Integration

The models are designed to support the following dashboard components:

1. **Metric Cards:**
   - Uses `fct_dashboard_metrics` for real-time metrics
   - Provides sales, revenue, customer counts, and growth rates

2. **Sales Charts:**
   - Uses `fct_sales_trends` for time-series data
   - Supports daily, weekly, monthly, and yearly views

3. **Product Analytics:**
   - Uses `fct_product_bundles` for recommendations
   - Uses `int_product_performance` for product metrics

4. **Recent Transactions:**
   - Uses `fct_recent_transactions` for real-time order feed
   - Includes detailed order information with items

## Usage

1. Install dependencies:
```bash
dbt deps
```

2. Run the models:
```bash
dbt run
```

3. Test the models:
```bash
dbt test
```

4. Generate documentation:
```bash
dbt docs generate
dbt docs serve
```

## Model Lineage

```
sources > staging > intermediate > marts
```

Each layer builds upon the previous one, ensuring clean and maintainable transformations.
