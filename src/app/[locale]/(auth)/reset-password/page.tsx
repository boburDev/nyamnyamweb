"use client";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { showError } from "@/components/toast/Toast";
import { SubmitLoader } from "@/components/loader";
import { ResetForm, ResetPayload } from "@/types";
import { PasswordInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import { useResetPassword } from "@/hooks";
import { resetSchema } from "@/schema";

export default function ResetPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const clearTo = useAuthStore((s) => s.clearTo);
  const confirm = useAuthStore((s) => s.confirm);
  const deleteConfirm = useAuthStore((s) => s.deleteConfirm);
  const { mutate: resetPassword, isPending } = useResetPassword(locale);
  const t = useTranslations("forgot-password-step");
  const tToast = useTranslations("toast");
  const tValidation = useTranslations("validation");

  const form = useForm<ResetForm>({
    mode: "onTouched",
    resolver: zodResolver(resetSchema(tValidation)),
    defaultValues: {
      new_password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetForm) => {
    const apiPayload: ResetPayload = {
      new_password: data.new_password,
      confirm_token: confirm ?? "",
    };
    resetPassword(apiPayload, {
      onSuccess: (res) => {
        form.reset();
        if (res.time_status) {
          router.push({ pathname: "/verify-reset", query: { reset: true } });
        } else {
          router.push("/signin");
          deleteConfirm();
          clearTo();
        }
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.error_message || tToast("error-unknown-error");
        showError(errorMessage);
      },
    });
  };

  const handleBack = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="w-full h-full sm:h-auto flex flex-col pt-12.5 sm:pt-0">
      <h2 className="auth-title">{t("title")}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[30px] w-full h-full sm:h-auto"
        >
          {/* Parol */}
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="auth-label">{t("newpass-label")}*</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder={t("newpass-placeholder")} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="auth-label">
                  {t("confirmpass-label")}*
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder={t("confirmpass-label")}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] sm:gap-[27px] mt-auto sm:mt-20">
            <Button
              variant={"outline"}
              onClick={handleBack}
              type="button"
              className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
            >
              {t("cancel-buttton")}
            </Button>
            <Button
              disabled={!form.formState.isValid || isPending}
              type="submit"
              className="h-12 flex-1 rounded-[12px]"
            >
              {isPending ? <SubmitLoader /> : t("next-button")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
