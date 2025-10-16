import { getFavourites } from "@/api/favourite";
import { Container } from "@/components/container";
import FavouriteCart from "@/components/favourite/FavouriteCart";
import Providers from "@/components/provider/Provider";
import { getAuthStatus } from "@/lib/auth";
import { dehydrate, QueryClient } from "@tanstack/react-query";

export default async function FavouritePage() {
  const isAuth = await getAuthStatus();
  const queryClient = new QueryClient();

  if (isAuth) {
    await queryClient.prefetchQuery({
      queryKey: ["favourites", null, null],
      queryFn: async ({ queryKey }) => {
        const [, lat, lon] = queryKey as [string, number | null, number | null];
        return getFavourites({ lat: lat ?? undefined, lon: lon ?? undefined });
      },
    });
  }

  return (
    <Container>
      <Providers dehydratedState={dehydrate(queryClient)}>
        <FavouriteCart isAuth={isAuth} />
      </Providers>
    </Container>
  );
}
