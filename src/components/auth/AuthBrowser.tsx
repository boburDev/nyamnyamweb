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
    // console.log(`${DOMAIN}/${browser}?lang=${locale}`);
    
  };
  return (
    <div className="flex items-center justify-center gap-5 mt-[30px]">
      {browserData.map((item) => (
        <button
          key={item.name}
          onClick={() => handleBrowserAuth(item.name)}
          className="bg-borderColor/50 border border-plasterColor rounded-[20px] py-[21px] px-[36px]"
        >
          <item.icon />
        </button>
      ))}
    </div>
  );
};

export default AuthBrowser;
