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
  const shouldBeEnabled =
    (lat === undefined && lon === undefined) ||
    (lat !== undefined && lon !== undefined);

  return useQuery({
    queryKey: ["surprise-bag", locale, slug, lat, lon],
    queryFn: () => getSupriseBagAll({ locale, slug, lat, lon }),
    enabled: shouldBeEnabled,
  });
};

export { useGetSupriseBag };
