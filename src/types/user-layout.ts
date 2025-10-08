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
  distance_km: number;
}
export interface Cart {
  cart_total: number;
  cart_items: CartData[];
}
