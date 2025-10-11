import { getSurpriseBagsByCategory } from "@/api";
import SurpriseClient from "@/components/surprise-bag/SurpriseClient";
import { QueryClient } from "@tanstack/react-query";
interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Record<string, string>;
}
const SurpriseBagPage = async ({ params, searchParams }: Props) => {
  const queryClient = new QueryClient();
  const { locale } = await params;
  const { catalog, type } = searchParams;

  await queryClient.prefetchQuery({
    queryKey: ["surprise-bag"],
    queryFn: () => getSurpriseBagsByCategory({ catalog, type, locale }),
  });
  return (
    <div>
      <SurpriseClient catalog={catalog} type={type} locale={locale} />
    </div>
  );
};

export default SurpriseBagPage;
