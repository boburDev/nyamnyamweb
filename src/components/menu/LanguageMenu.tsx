"use client";
import { CheckIcon, LanguageIcon } from "@/assets/icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { langData } from "@/data";
export const LanguageMenu = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();

  const changeLanguage = (newLanguage: string) => {
    router.push(pathName, { locale: newLanguage });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="h-12 rounded-full w-12 focus-visible:ring-0"
        >
          <LanguageIcon className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-borderColor">
        <div className="flex flex-col gap-[5px]">
          {langData.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className={`bg-white text-sm rounded-[5px] cursor-pointer font-poppins focus:bg-mainColor/5 items-center px-[5px] h-[32px] justify-between ${
                item.value === locale ? "text-black" : "text-dolphin"
              }`}
              onClick={() => changeLanguage(item.value)}
            >
              {item.name}
              {item.value === locale && <CheckIcon />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageMenu;
