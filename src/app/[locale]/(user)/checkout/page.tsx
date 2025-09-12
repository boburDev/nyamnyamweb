import CheckoutClient from "@/components/checkout/CheckoutClient";
import { Container } from "@/components/container";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function CheckoutPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["checkout"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Checkoutlarni olishda xatolik");
      return res.json();
    },
  });
  return (
    <div className="pt-20 pb-[150px]">
      <Container>
        <h2 className="page-title mb-10">To‘lov tafsilotlari</h2>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CheckoutClient />
        </HydrationBoundary>
      </Container>
    </div>
  );
}
