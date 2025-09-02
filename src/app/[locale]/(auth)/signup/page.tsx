"use client";

import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthBottom, AuthBrowser } from "@/components/auth";
import { useRouter } from "@/i18n/navigation";
import { showError } from "@/components/toast/Toast";
import useAuthStore from "@/context/useAuth";
import { SignupForm } from "@/types";
import { registerSchema } from "@/schema";
import { useRegister } from "@/hooks";

export default function SignUpPage() {
  const locale = useLocale();
  const setTo = useAuthStore((s) => s.setTo);
  const setAuthId = useAuthStore((s) => s.setAuthId);
  const form = useForm<SignupForm>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      emailOrPhone: "",
    },
  });
  const router = useRouter();
  const emailOrPhoneValue = form.watch("emailOrPhone") ?? "";
  const firstChar = emailOrPhoneValue.charAt(0);
  const isPhoneIntent = firstChar === "+" || /^[0-9]$/.test(firstChar);
  const inputMode = isPhoneIntent ? "tel" : "email";

  const { mutate: registerMutate, isPending } = useRegister(locale);

  const onSubmit = (data: SignupForm) => {
    registerMutate(data, {
      onSuccess: (res) => {
        if (res.otp_sent) {
          router.push("/verify");
        } else {
          router.push("/signup-complete");
        }
        setTo(data.emailOrPhone);
        setAuthId(res.id);
      },
      onError: (error) => {
        const errorMessage =
          typeof error.response?.data === "object" &&
          error.response?.data &&
          "error_message" in error.response.data
            ? (error.response.data.error_message as string)
            : "Noma'lum xatolik yuz berdi";

        showError(errorMessage);

        if (errorMessage === "❌ 1 daqiqada faqat 1 OTP yuboriladi") {
          router.push("/verify");
          setTo(data.emailOrPhone);
        }
      },
    });
  };

  return (
    <div className="w-full">
      <h2 className="auth-title">Ro'yxatdan o'tish</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" w-full"
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

          <Button
            disabled={!form.formState.isValid || isPending}
            type="submit"
            className="mt-[43px] w-full h-12 rounded-[10px] font-semibold text-lg"
          >
            {isPending ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
          </Button>
        </form>
      </Form>
      <AuthBottom type="signup" />
      <AuthBrowser />
    </div>
  );
}
