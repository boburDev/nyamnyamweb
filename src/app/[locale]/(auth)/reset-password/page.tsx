"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import { showError } from "@/components/toast/Toast";
import { useLocale } from "next-intl";
import { ResetForm, ResetPayload } from "@/types";
import { resetSchema } from "@/schema";
import { useResetPassword } from "@/hooks";
import { SubmitLoader } from "@/components/loader";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const clearTo = useAuthStore((s) => s.clearTo);
  const confirm = useAuthStore((s) => s.confirm);
  const { mutate: resetPassword, isPending } = useResetPassword(locale);

  const form = useForm<ResetForm>({
    mode: "onTouched",
    resolver: zodResolver(resetSchema),
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
          clearTo();
        }
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.error_message || "Noma'lum xatolik yuz berdi";
        showError(errorMessage);
      },
    });
  };

  const handleBack = () => {
    router.push("/forgot-password");
  };

  return (
    <div>
      <h2 className="auth-title">Parolni tiklash </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[30px] w-full"
        >
          {/* Parol */}
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="w-full">
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
              <FormItem className="w-full">
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

          {/* Tugmalar */}
          <div className="flex gap-[27px]">
            <Button
              variant={"outline"}
              onClick={handleBack}
              type="button"
              className="flex-1 !bg-hoverColor h-12 rounded-[12px] hover:!bg-white"
            >
              Bekor qilish
            </Button>
            <Button
              disabled={!form.formState.isValid || isPending}
              type="submit"
              className="h-12 flex-1 rounded-[12px]"
            >
              {isPending ? <SubmitLoader /> : "Yuborish"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
