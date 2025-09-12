import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUsers } from "@/api";
import { ProfilePageClient } from "@/components/profile";

export default async function ProfilePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageClient />
    </HydrationBoundary>
  );
}
