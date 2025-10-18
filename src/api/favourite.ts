import { ProductData } from "@/types";
import axios from "axios";

export async function getFavourites() {
  try {
    const res = await fetch(`/api/proxy/favourites`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Favourites olishda xatolik");

    const raw = await res.json();

    const finalData = raw?.data ?? (Array.isArray(raw) ? raw : []);

    return finalData as ProductData[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getFavouritesLatLon({
  lat,
  lon,
  locale,
}: {
  lat?: number;
  lon?: number;
  locale: string;
}) {
  try {
    const params = { lat, lon, locale };
    const res = await axios(`/api/proxy/favourites`, {
      withCredentials: true,
      params,
    });

    const raw = await res.data;

    const finalData = raw?.data ?? (Array.isArray(raw) ? raw : []);

    return finalData as ProductData[];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const addFavourites = async ({ id }: { id: string }) => {
  try {
    const res = await axios.post(`/api/favourites`, {
      id,
    });
    return res.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as
        | { backend?: string; message?: string; error_message?: string }
        | undefined;
      const errorMessage =
        data?.backend ||
        data?.message ||
        data?.error_message ||
        error.message ||
        "Xato yuz berdi";
      throw new Error(errorMessage);
    }
    throw new Error((error as Error)?.message || "Xato yuz berdi");
  }
};

export const removeFavourite = async ({ id }: { id: string }) => {
  try {
    const res = await axios.delete(`/api/favourites/${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as
        | { backend?: string; message?: string; error_message?: string }
        | undefined;
      const errorMessage =
        data?.backend ||
        data?.message ||
        data?.error_message ||
        error.message ||
        "Xato yuz berdi";
      throw new Error(errorMessage);
    }
    throw new Error((error as Error)?.message || "Xato yuz berdi");
  }
};
