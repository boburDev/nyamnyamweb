import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getBanners } from "@/api/banner";
import { getQueryClient } from "@/lib/react-query";
import { BannerSwiper } from "@/components/swiper";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mt-[100px]">
        <BannerSwiper />
      </div>
    </HydrationBoundary>
  );
}
