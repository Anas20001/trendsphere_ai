export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'manager';
  permissions: string[];  // Added for granular access control
  last_login: Date;      // Added for security tracking
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
  stock_level: number;         // Added for inventory tracking
  reorder_point: number;       // Added for inventory management
  preparation_time: number;    // Added for kitchen optimization
  nutritional_info: {         // Added for dietary tracking
    calories: number;
    allergens: string[];
  };
  peak_hours: string[];       // Added for demand prediction
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
  lifetime_value: number;     // Added for customer value tracking
  preferences: {             // Added for personalization
    favorite_items: string[];
    dietary_restrictions: string[];
    preferred_visit_times: string[];
  };
  segment: string;           // Added for customer segmentation
  churn_risk: number;        // Added for retention analysis
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  customer_id: string;
  staff_id: string;
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_method: string;
  table_number: string | null;     // Added for dine-in tracking
  order_type: 'dine-in' | 'takeaway' | 'delivery';
  preparation_time: number;        // Added for kitchen metrics
  delivery_time?: number;          // Added for delivery tracking
  feedback_rating?: number;        // Added for satisfaction tracking
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
  modifications: string[];    // Added for customization tracking
  waste_status: boolean;      // Added for waste management
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
  min_order_value: number;    // Added for bundle conditions
  max_redemptions: number;    // Added for offer limits
  actual_redemptions: number; // Added for offer tracking
  target_segment: string[];   // Added for targeted marketing
  created_at: Date;
  updated_at: Date;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  metadata: {
    session_id?: string;     // Added for user journey tracking
    device_info?: string;    // Added for platform analytics
    location?: {            // Added for geographical analysis
      latitude: number;
      longitude: number;
    };
    interaction_time?: number; // Added for UX analysis
    previous_state?: string;  // Added for flow analysis
    next_state?: string;
  };
  created_at: Date;
}

export interface InventoryLog {  // New table for inventory tracking
  id: string;
  product_id: string;
  quantity_change: number;
  reason: 'sale' | 'waste' | 'restock' | 'adjustment';
  batch_number?: string;
  expiry_date?: Date;
  cost_per_unit: number;
  created_at: Date;
}

export interface MLPrediction {  // New table for ML predictions
  id: string;
  prediction_type: 'demand' | 'churn' | 'inventory' | 'staffing';
  target_date: Date;
  predicted_value: number;
  confidence_score: number;
  features_used: string[];
  model_version: string;
  actual_value?: number;
  created_at: Date;
}

export interface StaffSchedule {  // New table for staff scheduling
  id: string;
  staff_id: string;
  shift_start: Date;
  shift_end: Date;
  role: string;
  station: string;
  is_backup: boolean;
  created_at: Date;
  updated_at: Date;
}