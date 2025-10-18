"use client";

import { Container } from "@/components/container";
import { NotificationSettings } from "@/components/notification";
import { Calendar, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { AppNotification } from "@/api/notification";
import { DataLoader } from "@/components/loader";
import { useEffect } from "react";
import { useNotifications } from "@/hooks";
import { useLocale } from "next-intl";

export const NotificationPageClient = () => {
    const t = useTranslations("notification");
    const t2 = useTranslations("cards");
    const queryClient = useQueryClient();
    const locale = useLocale();

    const {
        data: notifications = [],
        isLoading,
        error,
    } = useNotifications(locale);

    // Mark notification as read when component mounts
    useEffect(() => {
        if (notifications.length > 0) {
            // Update cache to mark all notifications as read
            queryClient.setQueryData(["notification"], (oldData: AppNotification[]) => {
                if (!oldData) return oldData;
                return oldData.map((notification: AppNotification) => ({
                    ...notification,
                    is_read: true,
                }));
            });
        }
    }, [notifications, queryClient]);

    if (isLoading) {
        return (
            <Container>
                <div className="mt-[76px] pb-[150px]">
                    <h2 className="font-medium text-4xl text-textColor">{t("title")}</h2>
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
                        Bildirishnomalar yuklanmadi
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="mt-[76px] pb-[150px]">
                <h2 className="font-medium text-4xl text-textColor">{t("title")}</h2>

                <div className="mt-10 space-y-4 bg-white p-[30px] rounded-[20px] border border-plasterColor">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={` ${notification.is_read ? "" : "!border-mainColor"} block border border-plasterColor rounded-[20px] p-6 hover:border-mainColor group transition-all duration-300`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium text-2xl text-textColor mb-[15px]">
                                                {notification.title}
                                            </h3>
                                            {
                                                !notification.is_read && (
                                                    <span className="bg-mainColor text-white text-xs w-7 h-7 flex items-center justify-center rounded-full">1</span>
                                                )
                                            }
                                        </div>
                                        <p className="text-sm text-dolphin mb-[15px] line-clamp-2 group-hover:text-textColor transition-all duration-300">
                                            {notification.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-[10px] text-gray-500 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(notification.created_at)
                                                            .toLocaleDateString("uz-UZ")
                                                            .replaceAll("/", ".")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4" />
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
                                                className="text-sm text-mainColor"
                                            >
                                                {t2("moreButton")}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">
                            {t("noNotifications")}
                        </p>
                    )}
                </div>

                <NotificationSettings />
            </div>
        </Container>
    );
};
