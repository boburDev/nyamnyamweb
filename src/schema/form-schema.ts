import { phoneLocalRegex, phoneRegex } from "@/utils";
import z from "zod";

// signin
export const loginSchema = (tValidation: (key: string) => string) => z.object({
  emailOrPhone: z
    .string()
    .min(1, tValidation("emailOrPhone"))
    .transform((val) => val.trim().replace(/\s/g, ""))
    .refine((val) => {
      if (val.includes("@")) {
        return z.string().email().safeParse(val).success;
      }
      if (phoneRegex.test(val) || phoneLocalRegex.test(val)) {
        return true;
      }
      return false;
    }, tValidation("emailOrPhone")),
  password: z
    .string()
    .min(1, tValidation("password"))
    .min(5, tValidation("password")),
});

// signup
export const registerSchema = (tValidation: (key: string) => string) => z.object({
  emailOrPhone: z
    .string()
    .min(1, tValidation("emailOrPhone"))
    .transform((val) => val.trim().replace(/\s/g, ""))
    .refine((val) => {
      if (val.includes("@")) {
        return z.string().email().safeParse(val).success;
      }
      if (phoneRegex.test(val) || phoneLocalRegex.test(val)) {
        return true;
      }
      return false;
    }, tValidation("emailOrPhone")),
});

// ForgotPassword 
export const forgotSchema = (tValidation: (key: string) => string) => z.object({
  emailOrPhone: z
    .string()
    .min(1, tValidation("emailOrPhone"))
    .transform((val) => val.trim().replace(/\s/g, ""))
    .refine((val) => {
      if (val.includes("@")) {
        return z.string().email().safeParse(val).success;
      }
      if (phoneRegex.test(val) || phoneLocalRegex.test(val)) {
        return true;
      }
      return false;
    }, tValidation("emailOrPhone")),
});

// ResetPasswordPage
export const resetSchema = (tValidation: (key: string) => string) => z
  .object({
    new_password: z
      .string()
      .min(5, tValidation("password"))
      .trim(),
    confirmPassword: z.string().min(1, tValidation("confirmPassword")).trim(),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: tValidation("passwordMatch"),
    path: ["confirmPassword"],
  });

// Signup Complete
export const completeSchema = (tValidation: (key: string) => string) => z
  .object({
    first_name: z.string().min(1, tValidation("firstName")),
    last_name: z.string().optional(),
    birth_date: z
      .date()
      .optional()
      .refine(
        (date) => {
          if (!date) return true;
          const minDate = new Date("1900-01-01");
          const maxDate = new Date();
          return date >= minDate && date <= maxDate;
        },
        { message: tValidation("invalidDate") }
      ),
    password: z
      .string()
      .min(5, tValidation("password")),
    confirmPassword: z.string().min(1, tValidation("confirmPassword")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: tValidation("passwordMatch"),
    path: ["confirmPassword"],
  });
