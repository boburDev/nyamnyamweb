import { CATEGORY } from "@/constants";
import axios, { AxiosError } from "axios";
interface AxiosErrorResponse {
  error_message?: string;
  message?: string;
  detail?: string;
}

export const getCategories = async (locale: string) => {
  try {
    const res = await axios.get(CATEGORY, {
      headers: { "Accept-Language": locale },
    });
    return res.data.data || [];
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError & {
        response?: { data: unknown };
      };
      const respData = axiosErr.response?.data as AxiosErrorResponse;

      const backendMsg =
        respData?.error_message ||
        respData?.message ||
        JSON.stringify(respData) ||
        axiosErr.message;

      throw new Error(backendMsg);
    }
    return [];
  }
};
