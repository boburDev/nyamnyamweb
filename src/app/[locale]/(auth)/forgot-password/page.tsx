"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
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
import { Input } from "@/components/ui/input";
import { AuthBottom } from "@/components/auth";
import { useLocale } from "next-intl";
import { ForgotForm } from "@/types";
import { forgotSchema } from "@/schema";
import useAuthStore from "@/context/useAuth";
import { useForgotPassword } from "@/hooks";
import { SubmitLoader } from "@/components/loader";
import { showError } from "@/components/toast/Toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const setTo = useAuthStore((s) => s.setTo);

  const form = useForm<ForgotForm>({
    mode: "onTouched",
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const emailOrPhoneValue = form.watch("emailOrPhone") ?? "";
  const firstChar = emailOrPhoneValue.charAt(0);
  const isPhoneIntent = firstChar === "+" || /^[0-9]$/.test(firstChar);
  const inputMode = isPhoneIntent ? "tel" : "email";

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
      <h2 className="auth-title ">Parolni tiklash</h2>
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
          <div className="flex gap-[27px] mt-20">
            <Button
              variant={"outline"}
              onClick={handleBack}
              type="button"
              className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
            >
              Bekor qilish
            </Button>
            <Button
              disabled={isPending}
              type="submit"
              className="h-12 flex-1 rounded-[12px]"
            >
              {isPending ? <SubmitLoader /> : "Davom etish"}
            </Button>
          </div>
        </form>
      </Form>
      <AuthBottom />
    </div>
  );
}
