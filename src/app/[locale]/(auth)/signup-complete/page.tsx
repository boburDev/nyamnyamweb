"use client";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

const completeSchema = z
  .object({
    first_name: z.string().min(1, "Ism majburiy"),
    last_name: z.string().optional(),
    birth_date: z
      .string()
      .length(4, "Tug'ilgan yil xato kiritilldi")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(5, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string().min(1, "Parolni tasdiqlash majburiy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmadi",
    path: ["confirmPassword"],
  });

type SignUpCompleteFormInputs = z.infer<typeof completeSchema>;
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import axios, { AxiosError } from "axios";
import { showError } from "@/components/toast/Toast";
import useStore from "@/context/store";
import { useLocale } from "next-intl";

export default function SignUpCompletePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const authId = useAuthStore((s) => s.authId);
  const login = useStore((s) => s.login);
  const locale = useLocale();

  const form = useForm<SignUpCompleteFormInputs>({
    mode: "onTouched",
    resolver: zodResolver(completeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      birth_date: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpCompleteFormInputs) => {
    const { confirmPassword: _confirmPassword, ...payload } = data;
    console.log(payload);
    try {
      const res = await axios.patch(`/auth/${authId}/update_detail/`, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });
      console.log(res);
      if (res.status === 200) {
        login(res.data.data.access_token, res.data.data.refresh_token);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.error_message;
        showError(errorMessage);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <div>
      <h2 className="auth-title">Ma’lumotlaringizni kiriting</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[30px] w-full"
        >
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="auth-label">Ism*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="username"
                    type="text"
                    placeholder="Ismingizni kiriting"
                    className="h-12 py-[7.5px] px-4"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="auth-label">Familiya</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Familiyangizni kiriting"
                    className="h-12 py-[7.5px] px-4"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="auth-label ">Tug'ilgan yil</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Faqat raqamlarni qoldirish
                      const numericValue = value.replace(/[^0-9]/g, "");
                      // field.onChange orqali form qiymatini yangilash
                      field.onChange(numericValue);
                    }}
                    type="text"
                    placeholder="Yilingizni kiriting"
                    className="h-12 py-[7.5px] px-4"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="auth-label">Parol*</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Parol kiriting"
                      className="h-12 py-[7.5px] pl-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-900 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={22} className="text-iconColor" />
                      ) : (
                        <Eye size={22} className="text-iconColor" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="auth-label">
                  Parolni tasdiqlash*
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      autoComplete="current-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Parolni qayta kiriting"
                      className="h-12 py-[7.5px] pl-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-900 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={22} className="text-iconColor" />
                      ) : (
                        <Eye size={22} className="text-iconColor" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="flex gap-[27px]">
            <Button
              variant={"outline"}
              onClick={handleBack}
              type="button"
              className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
            >
              Bekor qilish
            </Button>
            <Button type="submit" className="h-12 flex-1 rounded-[12px]">
              Ro'yxatdan o'tish
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
