import { NotificationPageClient } from "@/components/notification";
import PageHeader from "@/components/header/PageHeader";
import { useTranslations } from "next-intl";

const NotificationPage = () => {
  const t = useTranslations("notification");

  return (
    <>
      <PageHeader title={t("title")} />
      <NotificationPageClient />
    </>
  );
};

export default NotificationPage;
