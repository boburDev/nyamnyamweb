import axios from "axios";

export const getFavourites = async () => {
    const res = await fetch(`/api/proxy/favourites`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Favourites olishda xatolik");
    const raw = await res.json();
    // Normalize to { success: true, data: [] }
    const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.items)
                ? raw.items
                : Array.isArray(raw?.data?.items)
                    ? raw.data.items
                    : [];
    return { success: true, data: list };
};

export const addFavourites = async (items: Array<string | number | { id?: string | number; surprise_bag?: string | number }>) => {
    try {
        const res = await axios.post(`/api/proxy/favourites`, {
            items,
        });
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            const data = error.response.data as { backend?: string; message?: string; error_message?: string } | undefined;
            const errorMessage = data?.backend || data?.message || data?.error_message || error.message || "Xato yuz berdi";
            throw new Error(errorMessage);
        }
        throw new Error((error as Error)?.message || "Xato yuz berdi");
    }
};

export const removeFavourites = async (ids?: Array<string | number>) => {
    try {
        // If ids provided, send as query params, otherwise remove all
        const query = ids && ids.length ? `?${ids.map((id) => `id=${encodeURIComponent(String(id))}`).join("&")}` : "";
        const res = await axios.delete(`/api/proxy/favourites${query}`);
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            const data = error.response.data as { backend?: string; message?: string; error_message?: string } | undefined;
            const errorMessage = data?.backend || data?.message || data?.error_message || error.message || "Xato yuz berdi";
            throw new Error(errorMessage);
        }
        throw new Error((error as Error)?.message || "Xato yuz berdi");
    }
};


