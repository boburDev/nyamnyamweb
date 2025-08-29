import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";

import { getCategories } from "@/api/category";
import { getQueryClient } from "@/lib/react-query";
import { BannerSwiper } from "@/components/swiper";
import ProductsSection from "@/components/ProductsSection";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mt-[100px]">
        <BannerSwiper />
      </div>
      <ProductsSection />
    </HydrationBoundary>
  );
}
