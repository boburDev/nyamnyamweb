import { SURPRISE_BAG_ALL, SURPRISE_BAG_ALL_CATEGORY } from "@/constants";
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

    if (slug !== "all") params.append("category", slug);

    if (lat) params.append("lat", lat.toString());
    if (lon) params.append("lon", lon.toString());

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

export async function getSurpriseBagsByCategory({
  catalog,
  type,
  locale,
}: {
  catalog?: string;
  type?: string;
  locale?: string;
}) {
  try {
    const params = {
      ...(catalog && { slug: catalog }),
      type,
    };
    const res = await axios.get(SURPRISE_BAG_ALL_CATEGORY, {
      params,
      headers: {
        "Accept-Language": locale,
      },
    });

    return res.data?.data ?? [];
  } catch (err) {
    console.error("getSurpriseBagsByCategory error:", err);
    return [];
  }
}

export const getSurpriseBagSingle = async ({
  id,
  locale,
  lat,
  lon,
}: {
  id: string;
  locale: string;
  lat?: number;
  lon?: number;
}) => {
  try {
    const params = { lat, lon };
    const res = await axios.get(`${SURPRISE_BAG_ALL}${id}/`, {
      headers: { "Accept-Language": locale },
      params,
    });
    return res.data.data || null;
  } catch (error) {
    console.error("Error fetching surprise bag by id:", error);
    return null;
  }
};

export const surpriseSearch = async (search: string) => {
  try {
    const res = await axios.get(`${SURPRISE_BAG_ALL}?search=${search}`);
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching surprise bag by id:", error);
    return [];
  }
};
