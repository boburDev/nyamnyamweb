"use client";

import { links } from "@/data/footer-data";
import { Container } from "../container";
import { Button } from "../ui/button";
import { LogoIcon } from "@/assets/icons";
import { Link } from "@/i18n/navigation";
import { FooterData } from "@/data/footer-data";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export const Footer = () => {
  // const t = useTranslations();
  const footer = FooterData();
  const pathname = usePathname();

  let cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  if (cleanPath === "" || cleanPath === "/") cleanPath = "/";

  return (
    <>
      <div className="hidden md:block w-full pt-7.5 xl:pt-[59px] mt-25 2xl:mt-[150px] pb-[15px] xl:pb-7.5 bg-mainColor rounded-t-[30px] xl:rounded-t-[45px]">
        <Container>
          <div className="flex items-center justify-between">
            <div className="w-[325px] xl:w-[433px] gap-2.5 xl:gap-[21px] flex flex-col xl:-mt-10">
              <Link href={"/"} className="w-max">
                <LogoIcon className="h-10 xl:h-auto"/>
              </Link>
              <p className="text-xs xl:text-sm leading-[25px] text-white">
                SaveMeal – bu oziq-ovqat isrofiga qarshi kurashuvchi platforma.
                Yaroqlilik muddati yaqin mahsulotlarni arzon narxda toping.
              </p>
            </div>
            <div className="flex gap-10 xl:gap-30 2xl:gap-[150px]">
              {links.map((item, index) => (
                <div key={index} className="text-white">
                  <h3 className="pb-2.5 xl:pb-[23px] text-sm lg:text-base">{item.title}</h3>
                  <div className="flex flex-col gap-2 lg:gap-1 xl:gap-[10px] text-white">
                    {item.link?.map((item, index) => (
                      <Link
                        key={index}
                        href="/"
                        className="text-[11px] lg:text-xs xl:text-sm lg:leading-[25px]"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    {item.socials?.map((social) => (
                      <Link key={social.id ?? index} href={social.path} className="[&_svg]:size-7 xl:[&_svg]:size-8">
                        {typeof social.icon === "function"
                          ? social.icon()
                          : social.icon || ""}
                      </Link>
                    ))}
                  </div>
                  {index === 2 && (
                    <Button
                      variant="secondary"
                      className="mt-5 xl:mt-[26px] font-medium text-[10px] xl:text-[12px] w-30 xl:w-[140px] !rounded-[10px] xl:!rounded-[12px]"
                    >
                      Biznes uchun kirish
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center pt-5 xl:pt-[18px]">
            <div className="w-full h-[1px] bg-white/50 xl:bg-white"></div>
            <p className="text-xs xl:text-base text-white pt-[15px] xl:pt-[31px]">
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
                "flex flex-col items-center gap-[5px] font-medium text-xs transition-colors duration-300 ease-in-out",
                isActive ? "text-mainColor" : "text-dolphin hover:text-mainColor"
              )}
            >
              {Icon && (
                <Icon
                  className={classNames(
                    "size-6 flex-shrink-0",
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
