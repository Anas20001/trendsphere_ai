# TrendSphere Analytics Data Modeling Architecture

## Core Business Context
TrendSphere is a SaaS platform providing analytics and operations management for restaurants and coffee shops. Our data models need to support:

- Multi-branch performance analysis
- Real-time sales monitoring
- Customer behavior tracking
- Product bundle/menu optimization
- Staff performance metrics
- Inventory and cost management

## Data Model Organization

### 1. Staging Layer (`staging/`)
Raw data standardization only. No business logic. 