import { NotificationDetailClient } from "@/components/notification";

interface NotificationDetailPageProps {
  params: {
    id: string;
    locale: string;
  };
}

const NotificationDetailPage = ({ params }: NotificationDetailPageProps) => {
  return <NotificationDetailClient id={params.id} />;
};

export default NotificationDetailPage;