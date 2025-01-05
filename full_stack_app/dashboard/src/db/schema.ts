import { sql } from '@libsql/client';

export const schema = {
  tables: {
    users: sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'manager')),
        permissions JSON NOT NULL DEFAULT '[]',
        last_login DATETIME,
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
        stock_level INTEGER NOT NULL DEFAULT 0,
        reorder_point INTEGER NOT NULL DEFAULT 0,
        preparation_time INTEGER NOT NULL DEFAULT 0,
        nutritional_info JSON,
        peak_hours JSON,
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
        lifetime_value DECIMAL(10,2) DEFAULT 0,
        preferences JSON,
        segment TEXT,
        churn_risk DECIMAL(5,2),
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
        status TEXT NOT NULL CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
        payment_method TEXT NOT NULL,
        table_number TEXT,
        order_type TEXT NOT NULL CHECK (order_type IN ('dine-in', 'takeaway', 'delivery')),
        preparation_time INTEGER,
        delivery_time INTEGER,
        feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
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
        modifications JSON,
        waste_status BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    inventory_logs: sql`
      CREATE TABLE IF NOT EXISTS inventory_logs (
        id TEXT PRIMARY KEY,
        product_id TEXT REFERENCES products(id),
        quantity_change INTEGER NOT NULL,
        reason TEXT NOT NULL CHECK (reason IN ('sale', 'waste', 'restock', 'adjustment')),
        batch_number TEXT,
        expiry_date DATETIME,
        cost_per_unit DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    ml_predictions: sql`
      CREATE TABLE IF NOT EXISTS ml_predictions (
        id TEXT PRIMARY KEY,
        prediction_type TEXT NOT NULL CHECK (prediction_type IN ('demand', 'churn', 'inventory', 'staffing')),
        target_date DATETIME NOT NULL,
        predicted_value DECIMAL(10,2) NOT NULL,
        confidence_score DECIMAL(5,2) NOT NULL,
        features_used JSON NOT NULL,
        model_version TEXT NOT NULL,
        actual_value DECIMAL(10,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,

    staff_schedules: sql`
      CREATE TABLE IF NOT EXISTS staff_schedules (
        id TEXT PRIMARY KEY,
        staff_id TEXT REFERENCES users(id),
        shift_start DATETIME NOT NULL,
        shift_end DATETIME NOT NULL,
        role TEXT NOT NULL,
        station TEXT NOT NULL,
        is_backup BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    inventory_product: sql`
      CREATE INDEX IF NOT EXISTS idx_inventory_product
      ON inventory_logs(product_id, created_at)
    `,
    ml_predictions_type: sql`
      CREATE INDEX IF NOT EXISTS idx_ml_predictions_type
      ON ml_predictions(prediction_type, target_date)
    `,
    staff_schedules_date: sql`
      CREATE INDEX IF NOT EXISTS idx_staff_schedules_date
      ON staff_schedules(shift_start, shift_end)
    `,
    analytics_event_type: sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type 
      ON analytics_events(event_type, created_at)
    `
  }
};