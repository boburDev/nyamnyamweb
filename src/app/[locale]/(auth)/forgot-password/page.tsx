"use client";

import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { EmailOrPhoneInput } from "@/components/form";
import { showError } from "@/components/toast/Toast";
import { SubmitLoader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { AuthBottom } from "@/components/auth";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import { useForgotPassword } from "@/hooks";
import { forgotSchema } from "@/schema";
import { ForgotForm } from "@/types";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const setTo = useAuthStore((s) => s.setTo);
  const t = useTranslations("forgot-password-step")

  const form = useForm<ForgotForm>({
    mode: "onTouched",
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      emailOrPhone: "",
    },
  });


  const { mutate: forgotMutate, isPending } = useForgotPassword(locale);

  const onSubmit = (data: ForgotForm) => {
    forgotMutate(data, {
      onSuccess: () => {
        setTo(data.emailOrPhone);
        router.push({
          pathname: "/verify-reset",
        });
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

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="w-full ">
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
                    className="h-12 py-[7.5px] px-4"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="flex gap-[27px] mt-20">
            <Button
              variant={"outline"}
              onClick={handleBack}
              type="button"
              className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
            >
              {t("cancel-buttton")}
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="h-12 flex-1 rounded-[12px]"
            >
              {isPending ? <SubmitLoader /> : t("next-button")}
            </Button>
          </div>
        </form>
      </Form>
      <AuthBottom />
    </div>
  );
}
