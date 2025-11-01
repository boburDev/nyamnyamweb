import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getOrderHistory } from "@/api/order";
import { OrderHistoryClient } from "@/components/order-history/OrderHistoryClient";
import Providers from "@/components/provider/Provider";
import { getAuthStatus } from "@/lib/auth";
import { getLocale } from "next-intl/server";

export default async function OrderHistoryPage() {
    const queryClient = new QueryClient();
    const locale = await getLocale();
    const isAuth = await getAuthStatus();

    if (isAuth) {
        await queryClient.prefetchQuery({
            queryKey: ["order-history", locale],
            queryFn: () => getOrderHistory(locale),
        });
    }

    return (
        <Providers dehydratedState={dehydrate(queryClient)}>
            <OrderHistoryClient />
        </Providers>
    );
}
