import { dehydrate, QueryClient } from "@tanstack/react-query";
import CartComponent from "@/components/cart/CartComponent";
import Providers from "@/components/provider/Provider";
import { getAuthStatus } from "@/lib/auth";
import { getCartLatLon } from "@/api";
import { getLocale } from "next-intl/server";
import { PageHeader } from "@/components/header";

export default async function CartPage() {
  const isAuth = await getAuthStatus();
  const queryClient = new QueryClient();
  const locale = await getLocale();

  if (isAuth) {
    await queryClient.prefetchQuery({
      queryKey: ["cart", null, null, locale],
      queryFn: async ({ queryKey }) => {
        const [, lat, lon, locale] = queryKey as [
          string,
          number | null,
          number | null | undefined,
          string
        ];

        return getCartLatLon({
          lat: lat ?? undefined,
          lon: lon ?? undefined,
          locale,
        });
      },
    });
  }

  return (
    <Providers dehydratedState={dehydrate(queryClient)}>
      <PageHeader title="Savatcha" />
      <CartComponent isAuth={isAuth} />
    </Providers>
  );
}
