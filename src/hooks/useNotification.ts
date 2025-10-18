import { useQuery } from "@tanstack/react-query";
import { getNotifications, getNotificationById } from "@/api/notification";

export const useNotifications = (locale?: string) => {
    return useQuery({
        queryKey: ["notification", locale],
        queryFn: () => getNotifications(locale),
        retry: false,
    });
};

export const useNotificationById = (id: string | number, locale?: string) => {
    return useQuery({
        queryKey: ["notification", id, locale],
        queryFn: () => getNotificationById(id, locale),
        retry: false,
        enabled: !!id,
    });
};
