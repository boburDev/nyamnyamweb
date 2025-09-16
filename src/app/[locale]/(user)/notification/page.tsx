import { Container } from "@/components/container"
import { NotificationSettings } from "@/components/notification";
import { Calendar, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server"
import Link from "next/link"

interface Notification {
  id: number;
  name: string;
  desc: string;
  createdAt: string;
}

async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notification`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

const Notification = async () => {
  const t = await getTranslations('notification')
  const t2 = await getTranslations('cards')
  const notifications = await getNotifications();

  return (
    <Container>
      <div className="mt-[76px] pb-[150px]">
        <h2 className="font-medium text-4xl text-textColor">{t("title")}</h2>

        {/* Notifications List */}
        <div className="mt-10 space-y-4 bg-white p-[30px] rounded-[20px] border border-plasterColor">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              // href={`/notification/${notification.id}`}
              className="block  border border-plasterColor rounded-[20px] p-6 hover:border-mainColor gorup transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-2xl text-textColor mb-[15px]">
                    {notification.name}
                  </h3>
                  <p className="text-sm text-dolphin mb-[15px] line-clamp-2 group-hover:text-textColor transition-all duration-300">
                    {notification.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px] text-gray-500 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(notification.createdAt).toLocaleDateString('uz-UZ').replaceAll("/", ".")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(notification.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <Link href={`/notification/${notification.id}`} className="text-sm text-mainColor">
                      {t2("moreButton")}
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <NotificationSettings />
      </div>
    </Container>
  )
}

export default Notification