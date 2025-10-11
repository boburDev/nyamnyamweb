import { getSurpriseBagsByCategory } from "@/api";
import { getCategories } from "@/api/category";
import SurpriseClient from "@/components/surprise-bag/SurpriseClient";
import { QueryClient } from "@tanstack/react-query";
interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Record<string, string>;
}
const SurpriseBagPage = async ({ params, searchParams }: Props) => {
  const queryClient = new QueryClient();
  const { locale } = await params;
  const sp = await searchParams;
  const { catalog, type } = sp;

  await queryClient.prefetchQuery({
    queryKey: ["surprise-bag"],
    queryFn: () => getSurpriseBagsByCategory({ catalog, type, locale }),
  });
  await queryClient.prefetchQuery({
    queryKey: ["category"],
    queryFn: () => getCategories(locale),
  });
  return (
    <div>
      <SurpriseClient catalog={catalog} type={type} locale={locale} />
    </div>
  );
};

export default SurpriseBagPage;
