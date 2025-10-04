import { SURPRISE_BAG_ALL } from "@/constants";
import axios from "axios";

export const getSupriseBagAll = async ({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) => {
  try {
    const params = {
      ...(slug !== "all" && { category: slug }),
    };
    const res = await axios(`${SURPRISE_BAG_ALL}`, {
      params,
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
