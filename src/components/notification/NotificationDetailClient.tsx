"use client";

import { Container } from "@/components/container";
import { Calendar, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppNotification, getNotificationById } from "@/api/notification";
import { DataLoader } from "@/components/loader";
import { useEffect } from "react";

interface NotificationDetailClientProps {
    id: string;
}

export const NotificationDetailClient = ({ id }: NotificationDetailClientProps) => {
    const t = useTranslations("notification");
    const queryClient = useQueryClient();

    const {
        data: notification,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["notification", id],
        queryFn: () => getNotificationById(id),
        retry: false,
    });

    // Mark notification as read when component mounts
    useEffect(() => {
        if (notification) {
            // Update the specific notification in the cache
            queryClient.setQueryData(["notification", id], (oldData: AppNotification) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    is_read: true,
                };
            });

            // Also update the notification in the list cache
            queryClient.setQueryData(["notification"], (oldData: AppNotification[]) => {
                if (!oldData) return oldData;
                return oldData.map((item: AppNotification) =>
                    item.id === id ? { ...item, is_read: true } : item
                );
            });
        }
    }, [notification, id, queryClient]);

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

    if (error || !notification) {
        return (
            <Container>
                <div className="mt-[76px] pb-[150px]">
                    <h2 className="font-medium text-4xl text-textColor">{t("title")}</h2>
                    <div className="mt-10 text-center text-red-500">
                        Bildirishnoma topilmadi
                    </div>
                </div>
            </Container>
        );
    }

    const created = new Date(notification.created_at);
    const formattedDate = created.toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const formattedTime = created.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Container>
            <div className="mt-[76px]">
                <h2 className="font-medium text-4xl text-textColor">{t("title")}</h2>
            </div>
            <div className="mt-[30px] pb-[150px]">
                {/* Notification Content */}
                <div className="bg-white border border-plasterColor rounded-[20px] p-[30px]">
                    <div className="mb-6">
                        <h1 className="font-medium text-2xl text-textColor mb-[17px]">
                            {notification.title}
                        </h1>
                    </div>
                    <div className="prose max-w-none">
                        <p className="text-[16px] leading-7 text-dolphin whitespace-pre-wrap">
                            {notification.description}
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
