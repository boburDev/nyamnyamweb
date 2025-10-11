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
      queryKey: ["favourites"],
      queryFn: getFavourites,
    });
  }
  return (
    <Container className=" mt-[76px] pb-[45px]">
      <div className="mb-10">
        <h1 className="text-4xl font-medium text-textColor">
          Saqlangan mahsulotlar
        </h1>
      </div>
      <Providers dehydratedState={dehydrate(queryClient)}>
        <FavouriteCart isAuth={isAuth} />
      </Providers>
    </Container>
  );
}
