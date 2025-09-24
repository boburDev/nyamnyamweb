import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import { getCategories } from "@/api/category";
import { prefetchAllProducts } from "@/api/product";
import { BannerSwiper } from "@/components/swiper";
import ProductsSection from "@/components/ProductsSection";
import Providers from "@/components/provider/Provider";

export default async function Home() {
  const queryClient = new QueryClient();

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
    <Providers dehydratedState={dehydrate(queryClient)}>
      <main>
        <BannerSwiper />
        <ProductsSection />
      </main>
    </Providers>
  );
}
