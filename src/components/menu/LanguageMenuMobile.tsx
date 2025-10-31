import { LanguageIcon } from "@/assets/icons/LanguageIcon"
import { Button } from "../ui/button"
import { Sheet, SheetTrigger, SheetTitle, SheetContent, SheetHeader } from "../ui/sheet"
import { langData } from "@/data/lang-data"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

export const LanguageMenuMobile = ({className}: {className?: string}) => {
    const locale = useLocale();
    const router = useRouter();
    const pathName = usePathname();
  
    const changeLanguage = (newLanguage: string) => {
      router.push(pathName, { locale: newLanguage });
    };
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline" className={cn("rounded-full size-10.5 xl:size-12 focus-visible:ring-0", className)}>
                <LanguageIcon className="size-6" />
            </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="z-100 pb-5 border-none shadow-none rounded-t-[20px] [&_button[aria-label='Close']]:hidden">
            <SheetHeader>
                <SheetTitle>Language</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-[5px]">
                {langData.map((item) => (
                    <div key={item.value} className="text-sm rounded-[16px] cursor-pointer font-poppins focus:bg-mainColor/5 items-center justify-between px-5">
                        <div onClick={() => changeLanguage(item.value)} className={`flex items-center gap-2 border rounded-[16px] px-[16px] py-[14px] ${item.value === locale ? "bg-mainColor/10 border-mainColor" : "border-plasterColor"}`}>
                            <item.icon className="size-6" />
                            <span className={`text-sm ${item.value === locale ? "text-black" : "text-dolphin"}`}>{item.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </SheetContent>
    </Sheet>
  )
}

export default LanguageMenuMobile