import { getCategories } from "@/api/category";
import { useQuery } from "@tanstack/react-query";

const useGetCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export { useGetCategory };
