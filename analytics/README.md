# TrendSphere Analytics 

This project transforms raw POS data into analytics-ready models optimized for LLM-powered analytics agents.

## 🎯 Project Goals
- Enable near-real-time, AI-powered business insights
- Provide granular analytics for multi-branch operations
- Drive data-driven decision making for product strategy
- Support automated customer engagement initiatives

## 📊 Data Architecture

### Staging Layer (`staging/`)
- **stg_sales**: Core sales data transformation
  - Standardized field naming
  - Type casting and validation
  - Deduplication logic
  - Incremental processing

### Marts Layer (`marts/`)

#### AI Analytics (`marts/ai/`)
- **ai_analysis_results**
  - Combines bundle insights with frequency metrics
  - Powers LLM-based recommendation engine
  - Real-time insight generation

- **product_bundle_insights**
  - Advanced bundle analysis
  - Confidence scoring
  - Cross-branch pattern detection

#### Core Analytics (`marts/core/`)
- **branch_level_insights**
  - Daily performance metrics
  - Rolling averages (7-day window)
  - YoY comparisons
  - Footfall analysis
  - Revenue growth tracking

- **customer_segmentation**
  - Multi-dimensional segmentation
  - RFM (Recency, Frequency, Monetary) analysis
  - Branch loyalty scoring
  - Customer lifetime value calculation

#### Product Analytics (`marts/product/`)
- **product_pairs_frequency**
  - Market basket analysis
  - Association rules
  - Cross-sell opportunities
  - Branch-specific patterns

- **top_selling_by_revenue**
  - Revenue attribution
  - Product performance metrics
  - Seasonal trend analysis

## 🔄 Refresh Strategy

### Incremental Processing
- **Staging Models**: Hourly refresh
- **Mart Models**: Daily refresh (UTC midnight)

### Performance Optimization
- Materialized tables for high-query marts
- Incremental processing for large datasets
- Strategic partitioning
- Optimized join patterns
- Smart indexing strategy

## 🧪 Testing Framework

### Data Quality
- Primary key uniqueness
- Foreign key relationships
- Not-null constraints
- Value range validation

### Business Logic
- Customer segment rules
- Revenue calculations
- Bundle analysis validation
- Trend detection accuracy

### Performance
- Query execution time
- Resource utilization
- Refresh duration
- Data freshness

## 📈 Monitoring & Observability

### Key Metrics
- Model refresh status
- Data freshness
- Query performance
- Error rates
- Data quality scores

### Alerting
- Failed refreshes
- Data quality issues
- Performance degradation
- Anomaly detection

## 🚀 Getting Started

### Prerequisites
- dbt Core ≥ 1.5.0
- Python ≥ 3.8
- MySQL ≥ 8.0
- Sufficient compute resources for mart materialization
