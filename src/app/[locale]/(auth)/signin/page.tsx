"use client";

import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import axios, { AxiosError } from "axios";
import { Link, useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AuthBottom } from "@/components/auth";
import { showError } from "@/components/toast/Toast";
import { SIGNIN } from "@/constants";
import { useLocale } from "next-intl";

const phoneWithCountryRegex = /^\+998\d{9}$/;
const phoneLocalRegex = /^\d{9}$/;

const formSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Telefon raqam yoki Email majburiy")
    .transform((val) => val.trim().replace(/\s/g, ""))
    .refine((val) => {
      if (val.includes("@")) {
        return z.string().email().safeParse(val).success;
      }
      if (phoneWithCountryRegex.test(val) || phoneLocalRegex.test(val)) {
        return true;
      }
      return false;
    }, "Yaroqsiz telefon raqam yoki email manzili"),
  password: z
    .string()
    .min(1, "Parol majburiy")
    .min(6, "Parol kamida 6 belgidan iborat bo'lishi kerak"),
});

type LoginFormInputs = z.infer<typeof formSchema>;

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const _login = useStore((s) => s.login);
  const _router = useRouter();
  const locale = useLocale();

  const form = useForm<LoginFormInputs>({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const emailOrPhoneValue = form.watch("emailOrPhone") ?? "";
  const firstChar = emailOrPhoneValue.charAt(0);
  const isPhoneIntent = firstChar === "+" || /^[0-9]$/.test(firstChar);
  const inputMode = isPhoneIntent ? "tel" : "email";

  const normalizePhone = (raw: string) => {
    if (phoneWithCountryRegex.test(raw)) return raw;
    if (phoneLocalRegex.test(raw)) return `+998${raw}`;
    return raw;
  };

  const onSubmit = async (data: LoginFormInputs) => {
    const isEmail = data.emailOrPhone.includes("@");
    const emailOrPhone = isEmail
      ? { email: data.emailOrPhone.trim() }
      : { phone_number: normalizePhone(data.emailOrPhone) };
    const payload = {
      ...emailOrPhone,
      password: data.password,
    };
    try {
      const res = await axios.post(SIGNIN, payload, {
        headers: {
          "Accept-Language": locale,
        },
      });
      console.log("res", res);
    } catch (error: unknown) {
      console.error("Login error", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error_message;
        showError(errorMessage);
      }
      throw error;
    }
  };

  return (
    <div className="w-full ">
      <h2 className="auth-title ">Kirish</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
          noValidate
        >
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => {
              const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                let v = e.target.value;
                const fc = v.charAt(0);
                const intentPhone = fc === "+" || /^[0-9]$/.test(fc);
                if (intentPhone) {
                  v = v.replace(/[^\d+]/g, "");
                  if (v.startsWith("+")) {
                    if (v.length > 13) v = v.slice(0, 13);
                  } else {
                    if (v.length > 9) v = v.slice(0, 9);
                  }
                }
                field.onChange(v);
              };

              return (
                <FormItem className="w-full gap-[3px]">
                  <FormLabel className="text-[13px] text-textColor font-normal">
                    Telefon raqam yoki Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="username"
                      type="text"
                      placeholder={"Telefon raqam yoki Email"}
                      inputMode={inputMode}
                      onChange={handleChange}
                      className={`h-12 py-[7.5px] px-4  `}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => {
              const hasError = !!fieldState.error;
              return (
                <FormItem className="gap-[3px]">
                  <FormLabel className="text-[13px] text-textColor font-normal">
                    Parol
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Parolingizni kiriting"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className={`h-12 py-[7.5px] px-4 border ${
                          hasError ? "border-red-500" : "border-borderColor"
                        } focus:outline-none focus:ring-2 ${
                          hasError
                            ? "focus:ring-red-200"
                            : "focus:ring-mainColor/30"
                        }`}
                        aria-invalid={hasError ? "true" : "false"}
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
              );
            }}
          />
          <div className="mt-[10px] flex justify-end">
            <Link
              href="/forgot-password"
              className="font-medium text-mainColor leading-[150%]"
            >
              Parolni unutdingizmi?
            </Link>
          </div>
          <Button
            disabled={!form.formState.isValid}
            type="submit"
            className="mt-[10px] w-full h-12 rounded-[10px] font-semibold text-lg"
          >
            Kirish
          </Button>
        </form>
      </Form>
      <AuthBottom />
    </div>
  );
}
