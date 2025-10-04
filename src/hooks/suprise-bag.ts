import { getSupriseBagAll } from "@/api";
import { useQuery } from "@tanstack/react-query";

const useGetSupriseBag = ({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) => {
  return useQuery({
    queryKey: ["surprise-bag", locale, slug],
    queryFn: () => getSupriseBagAll({ locale, slug }),
  });
};

export { useGetSupriseBag };
