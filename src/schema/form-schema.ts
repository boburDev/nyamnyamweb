import { phoneLocalRegex, phoneRegex } from "@/utils";
import z from "zod";

// signin
export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Telefon raqam yoki Email majburiy")
    .transform((val) => val.trim().replace(/\s/g, ""))
    .refine((val) => {
      if (val.includes("@")) {
        return z.string().email().safeParse(val).success;
      }
      if (phoneRegex.test(val) || phoneLocalRegex.test(val)) {
        return true;
      }
      return false;
    }, "Yaroqsiz telefon raqam yoki email manzili"),
  password: z
    .string()
    .min(1, "Parol majburiy")
    .min(5, "Parol kamida 5 belgidan iborat bo'lishi kerak"),
});

// signup

export const registerSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Telefon raqam yoki Email majburiy")
    .transform((val) => val.trim().replace(/\s/g, ""))
    .refine((val) => {
      if (val.includes("@")) {
        return z.string().email().safeParse(val).success;
      }
      if (phoneRegex.test(val) || phoneLocalRegex.test(val)) {
        return true;
      }
      return false;
    }, "Yaroqsiz telefon raqam yoki email manzili"),
});
// ForgotPassword 
export const forgotSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Telefon raqam yoki Email majburiy")
    .transform((val) => val.trim().replace(/\s/g, ""))
    .refine((val) => {
      if (val.includes("@")) {
        return z.string().email().safeParse(val).success;
      }
      if (phoneRegex.test(val) || phoneLocalRegex.test(val)) {
        return true;
      }
      return false;
    }, "Yaroqsiz telefon raqam yoki email manzili"),
});
  // ResetPasswordPage
export const resetSchema = z
  .object({
    new_password: z
      .string()
      .min(5, "Parol kamida 5 ta belgidan iborat bo'lishi kerak")
      .trim(),
    confirmPassword: z.string().min(1, "Parolni tasdiqlash majburiy").trim(),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: "Parollar mos kelmadi",
    path: ["confirmPassword"],
  });

  // Signup Complete
export const completeSchema = z
  .object({
    first_name: z.string().min(1, "Ism majburiy"),
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
        { message: "Noto‘g‘ri  sana" }
      ),
    password: z
      .string()
      .min(5, "Parol kamida 5 ta belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string().min(1, "Parolni tasdiqlash majburiy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmadi",
    path: ["confirmPassword"],
  });
