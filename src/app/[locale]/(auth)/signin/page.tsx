"use client";

import { useLocale, useTranslations } from "next-intl";
import { FieldValues, useForm } from "react-hook-form";
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
import { showError, showSuccess } from "@/components/toast/Toast";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/schema";
import useStore from "@/context/store";
import { LoginForm } from "@/types";
import { useLogin } from "@/hooks";
import { SubmitLoader } from "@/components/loader";
import { PasswordInput } from "@/components/form";
import { EmailOrPhoneInput } from "@/components/form/EmailOrPhoneInput";

export default function SigninPage() {
  const login = useStore((s) => s.login);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("sign-in");
  const tValidation = useTranslations("validation");

  const form = useForm<LoginForm & FieldValues>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema(tValidation)),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const { mutate: loginMutate, isPending } = useLogin(locale);

  const onSubmit = (data: LoginForm) => {
    loginMutate(data, {
      onSuccess: (res) => {
        login(res.tokens.access_token, res.tokens.refresh_token);
        showSuccess("Muvaffaqiyatli kirdingiz");
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
    <div className="w-full">
      <h2 className="auth-title ">{t("title")}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
          noValidate
        >
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem className="w-full gap-[3px]">
                <FormLabel className="text-[13px] text-textColor font-normal">
                  {t("label-1")}
                </FormLabel>
                <FormControl>
                  <EmailOrPhoneInput
                    {...field}
                    autoComplete="username"
                    placeholder={t("placeholder-1")}
                    className="h-12 py-[7.5px] px-4 rounded-[12px]"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem className="gap-[3px]">
                  <FormLabel className="text-[13px] text-textColor font-normal">
                    {t("label-2")}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("placeholder-2")}
                      {...field}
                    />
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
              {t("forgot-pass")}
            </Link>
          </div>
          <Button
            disabled={!form.formState.isValid || isPending}
            type="submit"
            className="mt-[10px] w-full h-12 rounded-[10px] font-semibold text-lg"
          >
            {isPending ? <SubmitLoader /> : t("button")}
          </Button>
        </form>
      </Form>
      <AuthBottom />
      <AuthBrowser />
    </div>
  );
}
