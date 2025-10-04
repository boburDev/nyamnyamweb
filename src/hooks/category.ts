import { getCategories } from "@/api/category";
import { useQuery } from "@tanstack/react-query";

const useGetCategory = (locale: string) => {
  return useQuery({
    queryKey: ["categories", locale],
    queryFn: () => getCategories(locale),
  });
};

export { useGetCategory };
