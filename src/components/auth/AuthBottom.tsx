import { Link } from "@/i18n/navigation";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useTranslations } from "next-intl";
interface AuthBottomProps {
  type?: "signin" | "signup";
}
export default function AuthBottom({ type = "signin" }: AuthBottomProps) {
  const t = useTranslations("sign-up")
  const t2 = useTranslations("sign-in")
  const link = type === "signin" ? "/signup" : "/signin";
  const linkText = type === "signin" ? t2("sign-link") : t("sign-link");
  const yesText =
    type === "signin" ? t2("sign") : t("already-sign");
  return (
    <div className="mt-[30px]">
      <div className="flex items-center">
        <Separator className="flex-1  h-[1px] bg-orochimaru" />
        <span className="mx-[10px] text-base text-iron">{t("or")}</span>
        <Separator className="flex-1  h-[1px] bg-orochimaru" />
      </div>
      <div className="mt-[30px] flex gap-[5px] justify-center">
        <p className="font-normal text-lg text-textColor">{yesText}</p>
        <Link href={link} className="font-semibold text-mainColor text-lg">
          {linkText}
        </Link>
      </div>
    </div>
  );
}
