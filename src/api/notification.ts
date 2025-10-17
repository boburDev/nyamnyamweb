export interface AppNotification {
    id: string;
    type: string;
    is_read: boolean;
    created_at: string;
    receiver_type: "user" | "business";
    title: string;
    description: string;
    name?: string;
    desc?: string;
    createdAt?: string;
}

export async function getNotifications(): Promise<AppNotification[]> {
    try {
        const res = await fetch(`/api/proxy/notification`, {
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Notifications olishda xatolik");

        const raw = await res.json();
        const list = (raw?.data ?? raw ?? []) as AppNotification[];
        return Array.isArray(list) ? list : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getNotificationsServer(): Promise<AppNotification[]> {
    try {
        const { cookies } = await import("next/headers");
        const { ACCESS_TOKEN, REFRESH_TOKEN } = await import("@/constants");

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN)?.value ?? null;
        const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value ?? null;

        if (!accessToken && !refreshToken) {
            console.log("No auth tokens found for server-side notification fetch");
            return [];
        }

        const mainHeaders: Record<string, string> = {};
        if (accessToken) mainHeaders["Authorization"] = `Bearer ${accessToken}`;

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification`, {
            headers: mainHeaders,
            cache: "no-store"
        });

        if (response.status === 401 && refreshToken) {
            console.warn("⚠️ Access token expired, attempting refresh...");

            const refreshRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refreshToken }),
                }
            );

            if (!refreshRes.ok) {
                console.error("❌ Refresh token invalid or expired");
                return [];
            }

            const refreshJson = await refreshRes.json();
            const newAT = refreshJson?.data?.access_token ?? refreshJson?.access ?? null;

            if (!newAT) {
                console.error("❌ No new access token received");
                return [];
            }

            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification`, {
                headers: { "Authorization": `Bearer ${newAT}` },
                cache: "no-store"
            });
        }

        if (!response.ok) {
            console.error("Server-side notification fetch failed:", response.status);
            return [];
        }

        const raw = await response.json();
        const list = (raw?.data ?? raw ?? []) as AppNotification[];
        return Array.isArray(list) ? list : [];
    } catch (error) {
        console.error("Server-side notification fetch error:", error);
        return [];
    }
}

export async function getNotificationById(id: string | number): Promise<AppNotification | null> {
    try {
        const res = await fetch(`/api/proxy/notification/${id}`, {
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error("Notification olishda xatolik");
        }

        const raw = await res.json();
        const notification = (raw?.data ?? raw) as AppNotification | null;
        return notification ?? null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getNotificationByIdServer(id: string | number): Promise<AppNotification | null> {
    try {
        const { cookies } = await import("next/headers");
        const { ACCESS_TOKEN, REFRESH_TOKEN } = await import("@/constants");

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN)?.value ?? null;
        const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value ?? null;

        if (!accessToken && !refreshToken) {
            console.log("No auth tokens found for server-side notification fetch");
            return null;
        }

        const mainHeaders: Record<string, string> = {};
        if (accessToken) mainHeaders["Authorization"] = `Bearer ${accessToken}`;

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification/${id}`, {
            headers: mainHeaders,
            cache: "no-store"
        });

        if (response.status === 401 && refreshToken) {
            console.warn("⚠️ Access token expired, attempting refresh...");

            const refreshRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refreshToken }),
                }
            );

            if (!refreshRes.ok) {
                console.error("❌ Refresh token invalid or expired");
                return null;
            }

            const refreshJson = await refreshRes.json();
            const newAT = refreshJson?.data?.access_token ?? refreshJson?.access ?? null;

            if (!newAT) {
                console.error("❌ No new access token received");
                return null;
            }

            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification/${id}`, {
                headers: { "Authorization": `Bearer ${newAT}` },
                cache: "no-store"
            });
        }

        if (!response.ok) {
            if (response.status === 404) return null;
            console.error("Server-side notification fetch failed:", response.status);
            return null;
        }

        const raw = await response.json();
        const notification = (raw?.data ?? raw) as AppNotification | null;
        return notification ?? null;
    } catch (error) {
        console.error("Server-side notification fetch error:", error);
        return null;
    }
}
