"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthBottom, AuthBrowser } from "@/components/auth";
import { showError } from "@/components/toast/Toast";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schema";
import useStore from "@/context/store";
import { LoginForm } from "@/types";
import { useLogin } from "@/hooks";
import { SubmitLoader } from "@/components/loader";

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useStore((s) => s.login);
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<LoginForm>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const emailOrPhoneValue = form.watch("emailOrPhone") ?? "";
  const firstChar = emailOrPhoneValue.charAt(0);
  const isPhoneIntent = firstChar === "+" || /^[0-9]$/.test(firstChar);
  const inputMode = isPhoneIntent ? "tel" : "email";

  const { mutate: loginMutate, isPending } = useLogin(locale);

  const onSubmit = (data: LoginForm) => {
    loginMutate(data, {
      onSuccess: (res) => {
        console.log("res", res);
        login(res.tokens.access_token, res.tokens.refresh_token);
        router.push("/");
      },
      onError: (error) => {
        const errorMessage =
          typeof error.response?.data === "object" &&
          error.response?.data &&
          "error_message" in error.response.data
            ? (error.response.data.error_message as string)
            : "Noma'lum xatolik yuz berdi";
        showError(errorMessage);
      },
    });
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
            disabled={!form.formState.isValid || isPending}
            type="submit"
            className="mt-[10px] w-full h-12 rounded-[10px] font-semibold text-lg"
          >
            {isPending ? <SubmitLoader /> : "Kirish"}
          </Button>
        </form>
      </Form>
      <AuthBottom />
      <AuthBrowser />
    </div>
  );
}
