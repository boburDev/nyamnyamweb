import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/api/user";
import { UserData } from "@/types";

export function useUpdateUser(locale: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserData) => updateUser(data, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
