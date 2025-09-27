import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavourites, getFavourites, removeFavourites } from "@/api/favourite";
import { showError } from "@/components/toast/Toast";
import { AxiosError } from "axios";

export const useFavouritesQuery = (enabled: boolean) =>
    useQuery({
        queryKey: ["favourites"],
        queryFn: getFavourites,
        enabled,
    });

export const useAddFavourites = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (items: Array<string | number | { id?: string | number; surprise_bag?: string | number }>) =>
            addFavourites(items),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favourites"] });
        },
        onError: (err: Error | AxiosError) => {
            const axiosErr = err as AxiosError & { response?: { data?: { backend?: string; message?: string } } };
            const data = axiosErr.response?.data as { backend?: string; message?: string } | undefined;
            const errorMessage = data?.backend || data?.message || axiosErr.message || (err as Error)?.message || "Xato yuz berdi";
            showError(errorMessage);
        },
    });
};

export const useRemoveFavourites = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids?: Array<string | number>) => removeFavourites(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favourites"] });
        },
        onError: (err: Error | AxiosError) => {
            const axiosErr = err as AxiosError & { response?: { data?: { backend?: string; message?: string } } };
            const data = axiosErr.response?.data as { backend?: string; message?: string } | undefined;
            const errorMessage = data?.backend || data?.message || axiosErr.message || (err as Error)?.message || "Xato yuz berdi";
            showError(errorMessage);
        },
    });
};


