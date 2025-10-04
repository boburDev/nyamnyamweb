import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getUsers } from "@/api";
import { ProfilePageClient } from "@/components/profile";
import Providers from "@/components/provider/Provider";

export default async function ProfilePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getUsers,
  });

  return (
    <Providers dehydratedState={dehydrate(queryClient)}>
      <ProfilePageClient />
    </Providers>
  );
}
