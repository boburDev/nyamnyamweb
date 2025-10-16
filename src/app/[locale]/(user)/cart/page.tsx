import { dehydrate, QueryClient } from "@tanstack/react-query";
import CartComponent from "@/components/cart/CartComponent";
import Providers from "@/components/provider/Provider";
import { getAuthStatus } from "@/lib/auth";
import { getCart } from "@/api";

export default async function CartPage() {
  const isAuth = await getAuthStatus();
  const queryClient = new QueryClient();

  if (isAuth) {
    await queryClient.prefetchQuery({
      queryKey: ["favourites", null, null],
      queryFn: async ({ queryKey }) => {
        const [, lat, lon] = queryKey as [string, number | null, number | null];
        return getCart({ lat: lat ?? undefined, lon: lon ?? undefined });
      },
    });
  }

  return (
    <Providers dehydratedState={dehydrate(queryClient)}>
      <CartComponent isAuth={isAuth} />
    </Providers>
  );
}
