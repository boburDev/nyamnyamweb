import { SURPRISE_BAG_ALL } from "@/constants";
import axios from "axios";



export const getSupriseBagAll = async ({
  locale,
  slug,
  lat,
  lon,
}: {
  locale: string;
  slug: string;
  lat?: number;
  lon?: number;
}) => {
  try {
    const params = new URLSearchParams();

    // 🎯 faqat category "all" bo‘lmasa qo‘shiladi
    if (slug !== "all") params.append("category", slug);

    // 📍 lat / lon mavjud bo‘lsa qo‘shamiz
    if (lat) params.append("lat", lat.toString());
    if (lon) params.append("lon", lon.toString());

    // ✅ yakuniy URL: /surprise-bag/?lat=111.11&lon=3333.333
    const url = `${SURPRISE_BAG_ALL}?${params.toString()}`;

    const res = await axios.get(url, {
      headers: { "Accept-Language": locale },
    });

    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching surprise bags:", error);
    return [];
  }
};



export const getSurpriseBagByCategory = async ({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) => {
  try {
    const res = await axios.get(SURPRISE_BAG_ALL, {
      params: { category: slug },
      headers: { "Accept-Language": locale },
    });
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching surprise bags by category:", error);
    return [];
  }
};

export const getSurpriseBagById = async ({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) => {
  try {
    const url = `${SURPRISE_BAG_ALL}/${id}`;
    const res = await axios.get(url, {
      headers: { "Accept-Language": locale },
    });
    return res.data.data || null;
  } catch (error) {
    console.error("Error fetching surprise bag by ID:", error);
    return null;
  }
};