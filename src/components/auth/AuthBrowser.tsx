"use client";
import { DOMAIN } from "@/constants";
import { browserData } from "@/data";
import { useLocale } from "next-intl";

export const AuthBrowser = () => {
  const locale = useLocale();
  const handleBrowserAuth = (browser: string) => {
    const url = new URL(`${DOMAIN}/${browser}`);
    url.searchParams.set("lang", locale);
    window.location.href = url.toString();
  };
  return (
    <div className="flex items-center justify-center gap-5 mt-[30px]">
      {browserData.map((item) => (
        <button
          key={item.name}
          onClick={() => handleBrowserAuth(item.name)}
          className="group py-[17px] px-[24px] xl:py-[21px] xl:px-[36px] "
        >
          <item.icon className="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all w-[32px] h-[32px] xl:w-[36px] xl:h-[36px] " />
        </button>
      ))}
    </div>
  );
};

export default AuthBrowser;
