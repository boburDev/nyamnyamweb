import CartComponent from "@/components/cart/CartComponent";
import { getAuthStatus } from "@/lib/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function CartPage() {
  const isAuth = await getAuthStatus();
  const queryClient = new QueryClient();

  if (isAuth) {
    await queryClient.prefetchQuery({
      queryKey: ["cart"],
      queryFn: async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cart`);
        if (!res.ok) throw new Error("Serverdan savatni olishda xatolik");
        return res.json();
      },
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartComponent isAuth={isAuth} />
    </HydrationBoundary>
  );
}
