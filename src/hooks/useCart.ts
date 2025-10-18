import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/components/toast/Toast";
import { AxiosError } from "axios";
import {
  deleteCartAll,
  updateCart,
  deleteCartItem,
  addToCart,
  getCartLatLon,
} from "@/api";
import { useRouter } from "@/i18n/navigation";

export const useGetCart = ({
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
    queryKey: ["cart", lat, lon, locale],
    queryFn: async ({ queryKey }) => {
      const [, lat, lon] = queryKey as [string, number?, number?];
      return getCartLatLon({ lat, lon, locale });
    },
    enabled: enabled && lat !== undefined && lon !== undefined,
  });
const useDeleteCartAll = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: deleteCartAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.refresh();
    },
    onError: (error: Error | AxiosError) => {
      const errorMessage =
        error instanceof Error ? error.message : "Xato yuz berdi";
      showError(errorMessage);
    },
  });
};

const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      surprise_bag,
      quantity,
    }: {
      id: string;
      surprise_bag: string;
      quantity: number;
    }) => updateCart({ surprise_bag, quantity, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: Error | AxiosError) => {
      let errorMessage = "Xato yuz berdi";
      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError & {
          response?: { data?: { backend?: string; message?: string } };
        };
        const data = axiosErr.response?.data;
        errorMessage =
          data?.backend || data?.message || axiosErr.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      showError(errorMessage);
    },
  });
};

const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: Error | AxiosError) => {
      let errorMessage = "Xato yuz berdi";
      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError & {
          response?: { data?: { backend?: string; message?: string } };
        };
        const data = axiosErr.response?.data;
        errorMessage =
          data?.backend || data?.message || axiosErr.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      showError(errorMessage);
    },
  });
};

const useAddToCart = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (items: Array<{ id: string; quantity: number }>) =>
      addToCart(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.refresh();
    },
    onError: (err: Error | AxiosError) => {
      let errorMessage = "Xato yuz berdi";
      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError & {
          response?: { data?: { backend?: string; message?: string } };
        };
        const data = axiosErr.response?.data;
        errorMessage =
          data?.backend || data?.message || axiosErr.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      showError(errorMessage);
    },
  });
};

export { useDeleteCartAll, useUpdateCart, useDeleteCartItem, useAddToCart };
