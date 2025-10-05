import { getSupriseBagAll } from "@/api";
import { useQuery } from "@tanstack/react-query";

const useGetSupriseBag = ({
  locale,
  slug,
  lat,
  lon,
}: {
  locale: string;
  slug: string;
  lat?: number;
  lon?: number;
}) => {
  return useQuery({
    queryKey: ["surprise-bag", locale, slug, lat, lon],
    queryFn: () => getSupriseBagAll({ locale, slug, lat, lon }),
    enabled: !!locale, // faqat locale mavjud bo‘lsa fetch qiladi
  });
};

export { useGetSupriseBag };
