import { NotificationDetailClient } from "@/components/notification";
import PageHeader from "@/components/header/PageHeader";
import { useTranslations } from "next-intl";

interface NotificationDetailPageProps {
  params: {
    id: string;
    locale: string;
  };
}

const NotificationDetailPage = ({ params }: NotificationDetailPageProps) => {
  const t = useTranslations("notification");

  return (
    <>
      <PageHeader title={t("title")} />
      <NotificationDetailClient id={params.id} />
    </>
  );
};

export default NotificationDetailPage;