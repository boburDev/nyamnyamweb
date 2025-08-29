import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import { getCategories } from "@/api/category";
import { prefetchAllProducts } from "@/api/product";
import { getQueryClient } from "@/lib/react-query";
import { BannerSwiper } from "@/components/swiper";
import ProductsSection from "@/components/ProductsSection";

export default async function Home() {
  const queryClient = getQueryClient();

  // Prefetch all product data
  await queryClient.prefetchQuery({
    queryKey: ["products", "all"],
    queryFn: prefetchAllProducts,
  });

  // Prefetch banners
  await queryClient.prefetchQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  // Prefetch categories
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <BannerSwiper />
        <ProductsSection />
      </main>
    </HydrationBoundary>
  );
}
