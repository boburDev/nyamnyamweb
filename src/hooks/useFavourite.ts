import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavourites, getFavourites, getFavouritesLatLon, removeFavourite } from "@/api/favourite";
import { showError } from "@/components/toast/Toast";
import { AxiosError } from "axios";

export const useFavouritesQuery = (enabled?: boolean) =>
  useQuery({
    queryKey: ["favourites"],
    queryFn: getFavourites,
    enabled,
  });
export const useFavouritesQueryLatLon = ({
  enabled,
  lat,
  lon,
  locale,
}: {
  enabled?: boolean;
  lat?: number;
  lon?: number;
  locale: string;
}) =>
  useQuery({
    queryKey: ["favourites", lat, lon, locale],
    queryFn: async ({ queryKey }) => {
      const [, lat, lon] = queryKey as [string, number?, number?];
      return getFavouritesLatLon({ lat, lon, locale });
    },
    enabled: enabled && lat !== undefined && lon !== undefined,
  });

export const useAddFavourites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => addFavourites({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (err: Error | AxiosError) => {
      const axiosErr = err as AxiosError & {
        response?: { data?: { backend?: string; message?: string } };
      };
      const data = axiosErr.response?.data as
        | { backend?: string; message?: string }
        | undefined;
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

export const useRemoveFavourites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string }) => removeFavourite(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (err: Error | AxiosError) => {
      const axiosErr = err as AxiosError & {
        response?: { data?: { backend?: string; message?: string } };
      };
      const data = axiosErr.response?.data as
        | { backend?: string; message?: string }
        | undefined;
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
