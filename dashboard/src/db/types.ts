export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'manager';
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  loyalty_points: number;
  first_visit_date: Date;
  last_visit_date: Date;
  visit_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  customer_id: string;
  staff_id: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string | null;
  discount_percentage: number;
  start_date: Date | null;
  end_date: Date | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BundleItem {
  bundle_id: string;
  product_id: string;
  quantity: number;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: Date;
}