"use client";

import { Container } from "@/components/container";
import { Calendar, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { DataLoader } from "@/components/loader";
import { useState, useMemo } from "react";
import { useNotifications } from "@/hooks";
import { useLocale } from "next-intl";
import NotificationTabs from "../tabs/NotificationTabs";
import { Link } from "@/i18n/navigation";

export const NotificationPageClient = () => {
  const t = useTranslations("notification");
  const t2 = useTranslations("cards");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useNotifications(locale);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    } else if (activeTab === "unread") {
      return notifications.filter((notification) => !notification.is_read);
    } else {
      return notifications.filter((notification) => notification.is_read);
    }
  }, [notifications, activeTab]);

  // Mark notification as read when component mounts
  // useEffect(() => {
  //   if (notifications.length > 0) {
  //     // Update cache to mark all notifications as read
  //     queryClient.setQueryData(["notification"], (oldData: AppNotification[]) => {
  //       if (!oldData) return oldData;
  //       return oldData.map((notification: AppNotification) => ({
  //         ...notification,
  //         is_read: true,
  //       }));
  //     });
  //   }
  // }, [notifications, queryClient]);

  if (isLoading) {
    return (
      <Container>
        <div className="mt-[76px] pb-[150px]">
          <h2 className="hidden md:block font-medium text-4xl text-textColor">{t("title")}</h2>
          <div className="mt-10">
            <DataLoader />
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="mt-[76px] pb-[150px]">
          <h2 className="font-medium text-4xl text-textColor">{t("title")}</h2>
          <div className="mt-10 text-center text-red-500">
            {t("noNotifications")}
          </div>
        </div>
      </Container>
    );
  }



  return (
    <Container>
      <div className="md:mt-10 xl:mt-[76px]">
        <h2 className="font-medium text-4xl text-textColor hidden md:block">{t("title")}</h2>
        <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <NotificationTabs onTabChange={setActiveTab} />
        </div>
        <div className="mt-7.5 md:mt-10 space-y-4 xl:bg-white xl:p-[30px] rounded-[20px] xl:border border-plasterColor">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Link href={`/notification/${notification.id}`}
                key={notification.id}
                className={` ${notification.is_read ? "" : "!border-mainColor"} block border border-plasterColor rounded-[20px] px-4 py-3 xl:p-6 hover:border-mainColor group transition-all duration-300`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm line-clamp-1 sm:text-xl xl:text-2xl text-textColor mb-[15px]">
                        {notification.title}
                      </h3>
                      {
                        !notification.is_read && (
                          <span className="bg-mainColor text-white text-xs w-7 h-7 flex items-center justify-center rounded-full">1</span>
                        )
                      }
                    </div>
                    <p className="text-xs sm:text-sm xl:text-sm text-dolphin mb-[15px] line-clamp-2 group-hover:text-textColor transition-all duration-300">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-end sm:justify-between">
                      <div className="flex items-center gap-[10px] text-gray-500 text-xs xl:text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 hidden sm:block" />
                          <span>
                            {new Date(notification.created_at)
                              .toLocaleDateString("uz-UZ")
                              .replaceAll("/", ".")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 hidden sm:block" />
                          <span>
                            {new Date(notification.created_at).toLocaleTimeString(
                              "uz-UZ",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/notification/${notification.id}`}
                        className="text-sm text-mainColor hidden sm:block"
                      >
                        {t2("moreButton")}
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">
              {t("noNotifications")}
            </p>
          )}
        </div>

        {/* <NotificationSettings /> */}
      </div>
    </Container>
  );
};
