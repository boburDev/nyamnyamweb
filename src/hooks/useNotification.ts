import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, getNotificationById } from "@/api/notification";
import axios, { AxiosError } from "axios";
import { showError, showSuccess } from "@/components/toast/Toast";

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

const markAllRead = async ({ locale }: { locale?: string }) => {
    try {
        const params = new URLSearchParams();
        if (locale) {
            params.append('locale', locale);
        }

        const url = `/api/notification/mark-all-read/`;

        const res = await axios.post(url, {}, {
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
            },
            params,
        });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const useMarkAllRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { locale?: string }) =>
            markAllRead(variables),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["notification"] });
            showSuccess(res?.data?.data?.message || "All notifications marked as read");
        },
        onError: (err: Error | AxiosError) => {
            const axiosErr = err as AxiosError & {
                response?: { data?: { backend?: string; message?: string } };
            };
            const data = axiosErr.response?.data;
            const errorMessage =
                data?.backend ||
                data?.message ||
                axiosErr.message ||
                (err as Error)?.message ||
                "Xato yuz berdi";
            showError(errorMessage);
        },
    });
};