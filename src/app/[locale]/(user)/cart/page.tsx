import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getPosts } from "@/api/test";
import Posts from "@/components/Posts";
import { getQueryClient } from "@/lib/react-query";

export default async function CartPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts/>
    </HydrationBoundary>
  );
}
    