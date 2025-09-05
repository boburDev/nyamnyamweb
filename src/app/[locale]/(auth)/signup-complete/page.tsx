"use client";
import { useState } from "react";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CompleteForm, CompletePayload } from "@/types";
import { showError } from "@/components/toast/Toast";
import { Calendar } from "@/components/ui/calendar";
import { SubmitLoader } from "@/components/loader";
import { PasswordInput } from "@/components/form";
import { formatDate, parseDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import { useUpdateDetail } from "@/hooks";
import { completeSchema } from "@/schema";
import useStore from "@/context/store";
import { useQueryClient } from "@tanstack/react-query";

export default function SignUpCompletePage() {
  const [birthDateInput, setBirthDateInput] = useState<string>("");
  const router = useRouter();
  const authId = useAuthStore((s) => s.authId);
  const login = useStore((s) => s.login);
  const locale = useLocale();
  const clearId = useAuthStore((s) => s.clearAuthId);
  const clearTo = useAuthStore((s) => s.clearTo);
  const t = useTranslations("sign-up.enter-details");
  const queryClient = useQueryClient();
  const form = useForm<CompleteForm>({
    mode: "onTouched",
    resolver: zodResolver(completeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      birth_date: undefined,
      password: "",
      confirmPassword: "",
    },
  });
  const { mutate: updateDetail, isPending } = useUpdateDetail(
    authId as string,
    locale
  );

  const onSubmit = (data: CompleteForm) => {
    const { confirmPassword: _confirmPassword, ...payload } = data;

    const apiPayload: CompletePayload = {
      ...payload,
      birth_date: payload.birth_date
        ? format(new Date(payload.birth_date), "yyyy-MM-dd")
        : undefined,
    };

    updateDetail(apiPayload, {
      onSuccess: (res) => {
        form.reset();
        const data = res.data;
        console.log("res", data);
        login(data.tokens.access_token, data.tokens.refresh_token);
        queryClient.invalidateQueries({ queryKey: ["user"]});
        router.push("/");
        clearId();
        clearTo();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.error_message;
          showError(errorMessage);
        }
      },
    });
  };

  const handleBack = () => {
    router.push("/signup");
  };

  return (
    <div>
      <h2 className="auth-title">{t("title")}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-[30px] w-full"
        >
          {/* Ism */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="auth-label">{t("name")}*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="username"
                    type="text"
                    placeholder={t("placeholder-1")}
                    className="h-12 py-[7.5px] px-4"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Familiya */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="auth-label">{t("surname")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("placeholder-2")}
                    className="h-12 py-[7.5px] px-4"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => {
              const handleChange = (value: string) => {
                let val = value.replace(/\D/g, "");
                if (val.length > 8) val = val.slice(0, 8);
                if (val.length > 4) {
                  val = val.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, "$1.$2.$3");
                } else if (val.length > 2) {
                  val = val.replace(/^(\d{2})(\d{0,2}).*/, "$1.$2");
                }
                setBirthDateInput(val);
                const parsed = parseDate(val);
                if (parsed) {
                  field.onChange(parsed);
                } else {
                  field.onChange(undefined);
                }
              };

              return (
                <FormItem className="flex flex-col">
                  <FormLabel className="auth-label">{t("born")}</FormLabel>
                  <div className="relative">
                    <Input
                      value={birthDateInput}
                      onChange={(e) => handleChange(e.target.value)}
                      placeholder="01.01.2000"
                      className="h-12 py-[7.5px] pl-4 pr-10"
                      maxLength={10}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                          <CalendarIcon className="size-4 opacity-60" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            if (date) setBirthDateInput(formatDate(date));
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {/* Parol */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="auth-label">{t("password")}*</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder={t("placeholder-4")} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Parolni tasdiqlash */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="auth-label">
                  {t("confirm-password")}*
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder={t("placeholder-5")} />
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
              {t("close-button")}
            </Button>
            <Button
              disabled={!form.formState.isValid || isPending}
              type="submit"
              className="h-12 flex-1 rounded-[12px]"
            >
              {isPending ? <SubmitLoader /> : t("sign-button")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
