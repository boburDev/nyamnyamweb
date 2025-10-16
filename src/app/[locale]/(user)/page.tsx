import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import { BannerSwiper } from "@/components/swiper";
import Providers from "@/components/provider/Provider";
import ProductTabs from "@/components/tabs/ProductTabs";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  return (
    <Providers dehydratedState={dehydrate(queryClient)}>
      <main>
        <BannerSwiper />
        <ProductTabs />
      </main>
    </Providers>
  );
}
