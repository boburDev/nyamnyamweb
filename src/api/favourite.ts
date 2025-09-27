import axios from "axios";

export const getFavourites = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/favourite`);
    if (!res.ok) throw new Error("Favourites olishda xatolik");
    return res.json();
};

export const addFavourites = async (items: Array<string | number | { id?: string | number; surprise_bag?: string | number }>) => {
    try {
        const res = await axios.post(`/api/favourite`, {
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
        const res = await axios.delete(`/api/favourite${query}`);
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


