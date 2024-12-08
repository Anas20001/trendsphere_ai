import { sql } from '@libsql/client';

export const schema = {
  tables: {
    users: sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'manager')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    products: sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    customers: sql`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        loyalty_points INTEGER DEFAULT 0,
        first_visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        visit_count INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    orders: sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_id TEXT REFERENCES customers(id),
        staff_id TEXT REFERENCES users(id),
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
        payment_method TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    order_items: sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT REFERENCES orders(id),
        product_id TEXT REFERENCES products(id),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    product_bundles: sql`
      CREATE TABLE IF NOT EXISTS product_bundles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        discount_percentage DECIMAL(5,2) NOT NULL,
        start_date DATETIME,
        end_date DATETIME,
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    bundle_items: sql`
      CREATE TABLE IF NOT EXISTS bundle_items (
        bundle_id TEXT REFERENCES product_bundles(id),
        product_id TEXT REFERENCES products(id),
        quantity INTEGER NOT NULL,
        PRIMARY KEY (bundle_id, product_id)
      )
    `,

    analytics_events: sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        metadata JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
  },

  indexes: {
    orders_customer: sql`
      CREATE INDEX IF NOT EXISTS idx_orders_customer 
      ON orders(customer_id, created_at)
    `,
    orders_date: sql`
      CREATE INDEX IF NOT EXISTS idx_orders_date 
      ON orders(created_at)
    `,
    order_items_product: sql`
      CREATE INDEX IF NOT EXISTS idx_order_items_product 
      ON order_items(product_id)
    `,
    analytics_event_type: sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type 
      ON analytics_events(event_type, created_at)
    `
  }
};