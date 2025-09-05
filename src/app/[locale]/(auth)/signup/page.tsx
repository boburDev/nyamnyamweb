"use client";

import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { AuthBottom, AuthBrowser } from "@/components/auth";
import { EmailOrPhoneInput } from "@/components/form";
import { showError } from "@/components/toast/Toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import { registerSchema } from "@/schema";
import { useRegister } from "@/hooks";
import { SignupForm } from "@/types";
import { SubmitLoader } from "@/components/loader";

export default function SignUpPage() {
  const router = useRouter();
  const locale = useLocale();
  const setTo = useAuthStore((s) => s.setTo);
  const setAuthId = useAuthStore((s) => s.setAuthId);
  const t = useTranslations("sign-up")
  const tValidation = useTranslations("validation")
  const { mutate: registerMutate, isPending } = useRegister(locale);

  const form = useForm<SignupForm>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema(tValidation)),
    defaultValues: {
      emailOrPhone: "",
    },
  });

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
      <h2 className="auth-title">{t("title")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full" noValidate>
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem className="w-full gap-[3px]">
                <FormLabel className="text-[13px] text-textColor font-normal">
                  {t("label")}
                </FormLabel>
                <FormControl>
                  <EmailOrPhoneInput
                    {...field}
                    autoComplete="username"
                    placeholder={t("placeholder")}
                    className="h-12 py-[7.5px] px-4"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isValid || isPending}
            type="submit"
            className="mt-[43px] w-full h-12 rounded-[10px] font-semibold text-lg"
          >
            {isPending ? <SubmitLoader /> : t("button")}
          </Button>
        </form>
      </Form>
      <AuthBottom type="signup" />
      <AuthBrowser />
    </div>
  );
}
