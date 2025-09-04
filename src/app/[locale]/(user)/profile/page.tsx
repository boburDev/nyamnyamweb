import { Container } from "@/components/container";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  return (
    <div className="py-20">
      <Container>
        <h1 className="page-title mb-10">{t("title")}</h1>
        <div className="p-[30px] border border-plasterColor rounded-[20px]"></div>
      </Container>
    </div>
  );
}
