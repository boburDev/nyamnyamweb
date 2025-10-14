export type ToastType = "success" | "warning" | "info" | "error";

export interface CategoryData {
  id: string;
  slug: string;
  title: string;
}
export interface UserData {
  birth_date: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  [key: string]: string | undefined;
}
export interface Banner {
  cover_image: string;
  url: string;
}
export interface ProductData {
  id: string;
  business_name: string;
  count: number;
  description: string;
  similar_data?: ProductData[];
  distance_km?: string;
  cover_image: string;
  branch_name: string;
  quantity: number;
  lat?: string;
  lon?: string;
  title: string;
  size_name?: string;
  price: number;
  price_in_app: number;
  currency: string;
  start_time?: string;
  end_time?: string;
  distance?: string;
  overall_rating?: null | number;
  surprise_bag?: string;
  surprise_bag_image: string;
  weekday: number;
}
export interface CartData {
  id: string;
  surprise_bag: string;
  surprise_bag_image: string;
  branch_name: string;
  quantity: number;
  subtotal: number;
  title: string;
  count: number;
  price: number;
  price_in_app: number;
  start_time: string;
  end_time: string;
  distance: number;
}
export interface Cart {
  cart_total: number;
  cart_items: CartData[];
}

export interface OrderItem {
  title: string;
  count: number;
  price: number;
  surprise_bag: string;
  start_time: string;
  end_time: string;
  weekday: number;
}

export interface OrderPayload {
  order_items: OrderItem[];
  total_price: number;
  payment_method: string;
}

export interface ErrorData {
  error_message: string;
  message?: string;
}
