import { Container } from "@/components/container"
import { Calendar, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation"

interface Notification {
  id: number;
  name: string;
  desc: string;
  createdAt: string;
}

async function getNotification(id: string): Promise<Notification | null> {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notification?id=${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch notification');
    }

    const data = await response.json();
    return data.notification || null;
  } catch (error) {
    console.error('Error fetching notification:', error);
    return null;
  }
}

interface NotificationDetailPageProps {
  params: {
    id: string;
    locale: string;
  };
}

const NotificationDetailPage = async ({ params }: NotificationDetailPageProps) => {
  const t = await getTranslations('notification')
  const notification = await getNotification(params.id);

  
  const date = new Date( );
  if (!date) {
    notFound();
  }

  const formattedDate = date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!notification) {
    notFound();
  }

  return (
    <Container>
      <div className="mt-[76px] ">
        <h2 className="font-medium text-4xl text-textColor">{t("title")}</h2>
      </div>
      <div className="mt-[30px] pb-[150px]">

        {/* Notification Content */}
        <div className="bg-white border border-plasterColor rounded-[20px] p-[30px]">
          <div className="mb-6">
            <h1 className="font-medium text-2xl text-textColor mb-[17px]">
              {notification.name}
            </h1>
          </div>
          <div className="prose max-w-none">
            <p className="text-[16px] leading-7 text-dolphin whitespace-pre-wrap">
              {notification.desc}
            </p>
          </div>
          <div className="mt-[29px] flex items-end justify-end">
            <div className="flex items-center gap-[10px] text-gray-500 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate.replaceAll("/", ".")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Container>
  );
};

export default NotificationDetailPage;