import { UPDATE_ME } from "@/constants";
import request from "@/services";
import { UserData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = (locale: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserData) => {
      return await request.patch(UPDATE_ME, data, {
        headers: {
          "Accept-Language": locale,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
