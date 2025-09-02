import { forgotSchema, loginSchema, registerSchema } from "@/schema";
import z from "zod";

export type ForgotForm = z.infer<typeof forgotSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof registerSchema>;
