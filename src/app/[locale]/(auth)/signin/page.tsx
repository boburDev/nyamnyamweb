"use client";

import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
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

const phoneWithCountryRegex = /^\+998\d{9}$/;
const phoneLocalRegex = /^[9]\d{8}$/;

const formSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Telefon raqam yoki Email majburiy")
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
  const login = useStore((s) => s.login);
  const router = useRouter();

  const form = useForm<LoginFormInputs>({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  // watch orqali input qiymatini kuzatamiz
  const emailOrPhoneValue = form.watch("emailOrPhone") ?? "";
  const isEmail = emailOrPhoneValue.includes("@");

  // Telefonni normalizatsiya (APIga yuborish uchun)
  const normalizePhone = (raw: string) => {
    if (phoneWithCountryRegex.test(raw)) return raw;
    if (phoneLocalRegex.test(raw)) return `+998${raw}`;
    return raw;
  };

  const onSubmit = (data: LoginFormInputs) => {
    if (isEmail) {
      console.log("Email bilan kirish:", data.emailOrPhone, data.password);
    } else {
      const phoneForApi = normalizePhone(data.emailOrPhone);
      console.log("Telefon bilan kirish:", phoneForApi, data.password);
    }

    login("dummy_auth_token_from_api_response");
    router.push("/");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="auth-title mb-4 text-xl font-semibold">Kirish</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => {
              const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                let v = e.target.value;

                if (!v.includes("@")) {
                  v = v.replace(/[^\d+]/g, "");

                  if (v.startsWith("+")) {
                    if (v.length > 13) v = v.slice(0, 13);
                  } else if (/^[9]/.test(v)) {
                    if (v.length > 9) v = v.slice(0, 9);
                  } else {
                    if (v.length > 13) v = v.slice(0, 13);
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
                      inputMode={isEmail ? "email" : "tel"}
                      onChange={handleChange}
                      className="h-[35px] py-[7.5px] px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
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
                      className="h-[35px] py-[7.5px] px-4"
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-[10px] flex justify-end">
            <Link href="/reset-password">Parolni unutdingizmi?</Link>
          </div>
          <Button
            type="submit"
            className="w-full h-12 bg-mainColor text-white text-lg font-semibold rounded-md hover:bg-mainColor/90 transition-colors"
          >
            Kirish
          </Button>
        </form>
      </Form>
    </div>
  );
}
