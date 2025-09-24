import { GET_BANNERS } from "@/constants";
import axios from "axios";

export async function getBanners() {
  try {
    const { data } = await axios.get(GET_BANNERS);
    return data.data ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
