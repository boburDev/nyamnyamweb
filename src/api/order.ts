export async function getOrderHistory(locale?: string) {
    const params = new URLSearchParams();
    if (locale) {
        params.append('locale', locale);
    }

    const url = `/api/proxy/order/my_orders${params.toString() ? `?${params.toString()}` : ''}`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message =
            errorData?.error ||
            errorData?.message ||
            `Failed to fetch order history (status ${res.status})`;
        const err = new Error(message) as Error & { status: number };
        err.status = res.status;
        throw err;
    }

    const data = await res.json();
    return data.data;
}

