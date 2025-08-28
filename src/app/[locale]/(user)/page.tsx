import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import BannerSwiper from "@/components/swiper/BannerSwiper";
import { getQueryClient } from "@/lib/react-query";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <BannerSwiper />
      </div>
    </HydrationBoundary>
  );
}
