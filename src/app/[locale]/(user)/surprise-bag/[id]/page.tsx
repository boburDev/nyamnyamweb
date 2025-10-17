import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getSurpriseBagSingle } from "@/api";
import Providers from "@/components/provider/Provider";
import { SurpriseSingleClient } from "@/components/surprise-bag";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

const SurpriseBagSinglePage = async ({ params }: Props) => {
  const { id, locale } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["surprise-bag", id, locale, null, null],
    queryFn: async ({ queryKey }) => {
      const [_key, bagId, bagLocale, lat, lon] = queryKey as [
        string,
        string,
        string,
        number | null,
        number | null
      ];
      return getSurpriseBagSingle({
        id: bagId,
        locale: bagLocale,
        lat: lat ?? undefined,
        lon: lon ?? undefined,
      });
    },
  });

  return (
    <Providers dehydratedState={dehydrate(queryClient)}>
      <SurpriseSingleClient id={id} locale={locale} />
    </Providers>
  );
};

export default SurpriseBagSinglePage;
