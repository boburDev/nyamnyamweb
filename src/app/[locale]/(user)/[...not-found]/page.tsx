import { Container } from "@/components/container";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function Notfound() {
  const t = await getTranslations("404")
  return (
    <div className="pt-[145px] pb-[117px]">
      <Container className="flex flex-col items-center">
        <h1 className="text-mainColor text-[54px] md:text-[70px] xl:text-[100px] font-semibold xl:mb-[30px]">
          404
        </h1>
        <h3 className="text-textColor text-[20px] font-medium xl:text-[40px] mb-[15px]">
          {t("title")}
        </h3>
        <p className="flex flex-col items-center text-dolphin text-sm text-center xl:text-lg gap-[5px]">
          {t("desc-1")}
          <span>
            {t("desc-2")}
          </span>
        </p>
        <Link
          href="/"
          className="mt-5 xl:mt-[30px] bg-mainColor py-[9px] px-[10px] w-[214px] xl:w-[267px] h-[48px] flex items-center justify-center rounded-[20px] text-white"
        >
          {t("button")}
        </Link>
      </Container>
    </div>
  );
}
