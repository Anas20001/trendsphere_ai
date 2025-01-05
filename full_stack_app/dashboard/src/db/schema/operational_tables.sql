-- Additional Operational Tables

-- Enhanced Products Table
ALTER TABLE Products
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS sku text UNIQUE,
ADD COLUMN IF NOT EXISTS cost_price numeric(10, 2),
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS stock_level integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS reorder_point integer DEFAULT 0;

-- Customer Management
CREATE TABLE IF NOT EXISTS Customers (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    branch_id bigint REFERENCES Branches(id),
    name text NOT NULL,
    email text,
    phone text,
    loyalty_points integer DEFAULT 0,
    first_visit_date timestamp with time zone DEFAULT now(),
    last_visit_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Enhanced Sales Table (renamed to Orders for clarity)
CREATE TABLE IF NOT EXISTS Orders (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    branch_id bigint REFERENCES Branches(id),
    customer_id bigint REFERENCES Customers(id),
    order_number text UNIQUE NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    payment_method text NOT NULL,
    total_amount numeric(10, 2) NOT NULL,
    discount_amount numeric(10, 2) DEFAULT 0,
    tax_amount numeric(10, 2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Order Items (breaking down Sales into more detailed structure)
CREATE TABLE IF NOT EXISTS OrderItems (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id bigint REFERENCES Orders(id),
    product_id bigint REFERENCES Products(id),
    quantity integer NOT NULL,
    unit_price numeric(10, 2) NOT NULL,
    discount_amount numeric(10, 2) DEFAULT 0,
    total_amount numeric(10, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Inventory Tracking
CREATE TABLE IF NOT EXISTS InventoryTransactions (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    branch_id bigint REFERENCES Branches(id),
    product_id bigint REFERENCES Products(id),
    transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'waste')),
    quantity integer NOT NULL,
    unit_cost numeric(10, 2),
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

-- Staff Management
CREATE TABLE IF NOT EXISTS Staff (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    branch_id bigint REFERENCES Branches(id),
    user_id bigint REFERENCES Users(id),
    role text NOT NULL CHECK (role IN ('manager', 'server', 'kitchen', 'cashier')),
    start_date date NOT NULL,
    end_date date,
    created_at timestamp with time zone DEFAULT now()
);

-- Shifts and Time Tracking
CREATE TABLE IF NOT EXISTS Shifts (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    branch_id bigint REFERENCES Branches(id),
    staff_id bigint REFERENCES Staff(id),
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Additional Indexes
CREATE INDEX IF NOT EXISTS idx_customers_branch ON Customers(branch_id);
CREATE INDEX IF NOT EXISTS idx_orders_branch_date ON Orders(branch_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON Orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_inventory_branch_product ON InventoryTransactions(branch_id, product_id);
CREATE INDEX IF NOT EXISTS idx_shifts_branch_date ON Shifts(branch_id, start_time);