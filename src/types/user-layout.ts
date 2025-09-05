export type ToastType = "success" | "warning" | "info" | "error";

export interface UserData {
  birth_date: string;
  email: string;
  first_name: string;
  last_name?: string ;
  phone_number?: string;
  [key: string]: string | undefined;
}
