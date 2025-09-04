import { DOMAIN, REFRESH_USER } from "@/constants";
import axios from "axios";
import { requestQueue } from "./requestQueue";
import { refreshTokens } from "./refreshService";
import useStore from "@/context/store";
import { getTokens } from "@/utils/token";

const request = axios.create({
  baseURL: DOMAIN,
  headers: { "Content-Type": "application/json" },
});

request.interceptors.request.use((config) => {
  const { access_token } = getTokens();
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url?.includes(REFRESH_USER)) {
      return Promise.reject(error);
    }
    if (
      
      error.response?.status === 401 ||
      (error.message === "Unauthorized" && !originalRequest._retry)
    ) {
      originalRequest._retry = true;
      console.log(error?.message);
      if (requestQueue.isRefreshing) {
        return requestQueue.add({
          config: originalRequest,
          retry: () => request(originalRequest),
        });
      }
      try {
        requestQueue.isRefreshing = true;
        const newAccessToken = await refreshTokens();

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        requestQueue.processAll(newAccessToken);
        return request(originalRequest);
      } catch (refreshError: unknown) {
        if (axios.isAxiosError(refreshError)) {
          requestQueue.rejectAll(refreshError);
          useStore.getState().logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } else {
          console.error("Error refreshing token:", refreshError);
          return Promise.reject(refreshError);
        }
      } finally {
        requestQueue.isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default request;
