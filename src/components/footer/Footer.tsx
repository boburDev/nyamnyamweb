"use client";

import { links } from "@/data/footer-data";
import { Container } from "../container";
import { Button } from "../ui/button";
import { LogoIcon } from "@/assets/icons";
import { Link } from "@/i18n/navigation";
import { FooterData } from "@/data/footer-data";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export const Footer = () => {
  const t = useTranslations();
  const footer = FooterData(t);
  const pathname = usePathname();

  let cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  if (cleanPath === "" || cleanPath === "/") cleanPath = "/";

  return (
    <>
      <div className="hidden md:block w-full pt-[39px] mt-[150px] pb-[29px] bg-mainColor rounded-t-[45px]">
        <Container>
          <div className="flex items-center gap-[63px]">
            <div className="w-[433px] gap-[21px] flex flex-col">
              <Link href={"/"}>
                <LogoIcon className="h-10 xl:h-auto" />
              </Link>
              <p className="text-sm leading-[25px] text-white">
                SaveMeal – bu oziq-ovqat isrofiga qarshi kurashuvchi platforma.
                Yaroqlilik muddati yaqin mahsulotlarni arzon narxda toping.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-[155px] pt-[59px]">
              {links.map((item, index) => (
                <div key={index} className=" text-white">
                  <h3 className="pb-[23px]">{item.title}</h3>
                  <div className="flex flex-col gap-[10px] text-white w-[167px]">
                    {item.link?.map((item, index) => (
                      <Link
                        key={index}
                        href="/"
                        className="text-[14px] leading-[25px]"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center gap-[20px]">
                    {item.socials?.map((social) => (
                      <Link key={social.id ?? index} href={social.path}>
                        {typeof social.icon === "function"
                          ? social.icon()
                          : social.icon || ""}
                      </Link>
                    ))}
                  </div>
                  {index === 2 && (
                    <Button
                      variant="secondary"
                      className="mt-[26px] font-medium text-[12px] w-[140px]"
                    >
                      Biznes uchun kirish
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center pt-[18px]">
            <div className="w-full h-[1px] bg-white"></div>
            <p className="text-[16px] text-white pt-[31px]">
              2025 SaveMeal. Barcha huquqlar himoyalangan
            </p>
          </div>
        </Container>
      </div>

      <div className="md:hidden fixed z-59 bottom-0 w-full flex justify-between bg-white px-[22px] pt-2.5 pb-5 rounded-t-[20px]">
        {footer.map(({ name, path, icon: Icon }, index) => {
          const isActive =
            cleanPath === path || cleanPath.startsWith(path + "/");

          return (
            <Link
              key={index}
              href={path}
              className={classNames(
                "flex flex-col items-center gap-[5px] font-medium text-[12px] transition-colors duration-300 ease-in-out",
                isActive ? "text-mainColor" : "text-dolphin hover:text-mainColor"
              )}
            >
              {Icon && (
                <Icon
                  className={classNames(
                    "w-4.5 xl:w-6 h-4.5 xl:h-6 flex-shrink-0",
                  )}
                />
              )}
              <span className="flex-1">{name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Footer;
