"use client";
import { z } from "zod";
import { useState } from "react";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function parseDate(value: string): Date | undefined {
  const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = value.match(regex);
  if (!match) return undefined;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const year = parseInt(match[3], 10);

  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? undefined : date;
}

const completeSchema = z
  .object({
    first_name: z.string().min(1, "Ism majburiy"),
    last_name: z.string().optional(),
    birth_date: z
      .date()
      .optional()
      .refine(
        (date) => {
          if (!date) return true;
          const minDate = new Date("1900-01-01");
          const maxDate = new Date();
          return date >= minDate && date <= maxDate;
        },
        { message: "Noto‘g‘ri  sana" }
      ),
    password: z
      .string()
      .min(5, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string().min(1, "Parolni tasdiqlash majburiy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmadi",
    path: ["confirmPassword"],
  });

type SignUpCompleteFormInputs = z.infer<typeof completeSchema>;
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import useAuthStore from "@/context/useAuth";
import axios, { AxiosError } from "axios";
import { showError } from "@/components/toast/Toast";
import useStore from "@/context/store";
import { useLocale } from "next-intl";
import { DOMAIN } from "@/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export default function SignUpCompletePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [birthDateInput, setBirthDateInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const authId = useAuthStore((s) => s.authId);
  const login = useStore((s) => s.login);
  const locale = useLocale();
  const clearId = useAuthStore((s) => s.clearAuthId);
  const clearTo = useAuthStore((s) => s.clearTo);

  const form = useForm<SignUpCompleteFormInputs>({
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

  const onSubmit = async (data: SignUpCompleteFormInputs) => {
    const { confirmPassword: _confirmPassword, ...payload } = data;
    setLoading(true);
    const apiPayload = {
      ...payload,
      birth_date: payload.birth_date
        ? format(new Date(payload.birth_date), "yyyy-MM-dd")
        : undefined,
    };
    try {
      const res = await axios.patch(
        `${DOMAIN}/auth/${authId}/update_detail/`,
        apiPayload,
        {
          headers: {
            "Accept-Language": locale,
          },
        }
      );
      form.reset();
      const data = res.data.data;
      console.log("res", data);
      login(data.tokens.access_token, data.tokens.refresh_token);
      router.push("/");
      clearId();
      clearTo();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.error_message;
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/signup");
  };

  return (
    <div>
      <h2 className="auth-title">Ma’lumotlaringizni kiriting</h2>
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
                <FormLabel className="auth-label">Ism*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="username"
                    type="text"
                    placeholder="Ismingizni kiriting"
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
                <FormLabel className="auth-label">Familiya</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Familiyangizni kiriting"
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
                  <FormLabel className="auth-label">Tug‘ilgan sana</FormLabel>
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

          {/* Parolni tasdiqlash */}
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
              disabled={!form.formState.isValid || loading}
              type="submit"
              className="h-12 flex-1 rounded-[12px]"
            >
              {loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
