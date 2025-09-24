import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/components/toast/Toast";
import { AxiosError } from "axios";
import { deleteCartAll } from "@/api";

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

export { useDeleteCartAll };
