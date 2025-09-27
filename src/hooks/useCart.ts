import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/components/toast/Toast";
import { AxiosError } from "axios";
import { deleteCartAll, updateCart, deleteCartItem, addToCart } from "@/api";

const useDeleteCartAll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCartAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
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
    mutationFn: ({ surprise_bag }: { id: string; surprise_bag: string }) =>
      deleteCartItem({ id: surprise_bag }),
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
  return useMutation({
    mutationFn: (items: Array<{ id: string; quantity: number }>) => addToCart(items),
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

export { useDeleteCartAll, useUpdateCart, useDeleteCartItem, useAddToCart };
