import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getOrderHistory } from "@/api/order";
import { OrderHistoryClient } from "@/components/order-history/OrderHistoryClient";
import Providers from "@/components/provider/Provider";
import { getAuthStatus } from "@/lib/auth";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/header/PageHeader";

export default async function OrderHistoryPage() {
    const queryClient = new QueryClient();
    const locale = await getLocale();
    const isAuth = await getAuthStatus();
    const t = await getTranslations("UserMenu");

    if (isAuth) {
        await queryClient.prefetchQuery({
            queryKey: ["order-history", locale],
            queryFn: () => getOrderHistory(locale),
        });
    }

    return (
        <Providers dehydratedState={dehydrate(queryClient)}>
            <PageHeader title={t("order-history")} />
            <OrderHistoryClient />
        </Providers>
    );
}
