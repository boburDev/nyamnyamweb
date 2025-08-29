"use client";

import { Button } from "@/components/ui/button";
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
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { AuthBottom } from "@/components/auth";

const phoneWithCountryRegex = /^\+998\d{9}$/;
const phoneLocalRegex = /^\d{9}$/;

const formSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Telefon raqam yoki Email majburiy")
    .transform((val) => val.trim().replace(/\s/g, ""))
    .refine((val) => {
      if (val.includes("@")) {
        return z.string().email().safeParse(val).success;
      }
      if (phoneWithCountryRegex.test(val) || phoneLocalRegex.test(val)) {
        return true;
      }
      return false;
    }, "Yaroqsiz telefon raqam yoki email manzili"),
});

type LoginFormInputs = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const form = useForm<LoginFormInputs>({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const emailOrPhoneValue = form.watch("emailOrPhone") ?? "";
  const firstChar = emailOrPhoneValue.charAt(0);
  const isPhoneIntent = firstChar === "+" || /^[0-9]$/.test(firstChar);
  const inputMode = isPhoneIntent ? "tel" : "email";

  const normalizePhone = (raw: string) => {
    if (phoneWithCountryRegex.test(raw)) return raw;
    if (phoneLocalRegex.test(raw)) return `+998${raw}`;
    return raw;
  };

  const onSubmit = (data: LoginFormInputs) => {
    const isEmail = data.emailOrPhone.includes("@");
    const payload = isEmail
      ? { email: data.emailOrPhone }
      : { phone_number: normalizePhone(data.emailOrPhone) };
    console.log(payload);
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
            disabled={!form.formState.isValid}
            type="submit"
            className="mt-[43px] w-full h-12 rounded-[10px] font-semibold text-lg"
          >
            Ro'yxatdan o'tish
          </Button>
        </form>
      </Form>
      <AuthBottom type="signup" />
    </div>
  );
}
