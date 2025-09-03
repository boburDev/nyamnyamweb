import {
  completeSchema,
  forgotSchema,
  loginSchema,
  registerSchema,
  resetSchema,
} from "@/schema";
import z from "zod";

export type ForgotForm = z.infer<typeof forgotSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof registerSchema>;
export type ResetForm = z.infer<typeof resetSchema>;
export type CompleteForm = z.infer<typeof completeSchema>;


export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}
export interface ErrorResponseData {
  error_message: string;
}
export interface ResetPasswordResponse {
  message: string;
  success: boolean;
  time_status: boolean;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}
export type ResetPayload = {
  new_password: string;
  confirm_token: string;
};
export interface VerifyResetPayload {
  email?: string;
  phone_number?: string;
  code: string;
}

export interface CompletePayload {
  first_name: string;
  last_name?: string;
  birth_date?: Date | string;
  password: string;
}