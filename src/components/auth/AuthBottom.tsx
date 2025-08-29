import { Link } from "@/i18n/navigation";
import { Separator } from "@radix-ui/react-dropdown-menu";
import AuthBrowser from "./AuthBrowser";
interface AuthBottomProps {
  type?: "signin" | "signup";
}
export default function AuthBottom({ type = "signin" }: AuthBottomProps) {
  const link = type === "signin" ? "/signup" : "/signin";
  const linkText = type === "signin" ? "Ro'yxatdan o'tish" : "Kirish";
  const yesText =
    type === "signin" ? "Hisobingiz yo’qmi?" : "Hisobingiz bormi?";
  return (
    <div className="mt-[30px]">
      <div className="flex items-center">
        <Separator className="flex-1  h-[1px] bg-orochimaru" />
        <span className="mx-[10px] text-base text-iron">yoki</span>
        <Separator className="flex-1  h-[1px] bg-orochimaru" />
      </div>
      <div className="mt-[30px] flex gap-[5px] justify-center">
        <p className="font-normal text-lg text-textColor">{yesText}</p>
        <Link href={link} className="font-semibold text-mainColor text-lg">
          {linkText}
        </Link>
      </div>
      <AuthBrowser />
    </div>
  );
}
