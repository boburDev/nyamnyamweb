import { ACCESS_TOKEN, REFRESH_TOKEN, REFRESH_USER } from "@/constants";
import { cookieStorage } from "@/lib";
import { setTokens } from "@/utils/token";
import axios from "axios";

export const refreshTokens = async () => {
  const access_token = cookieStorage.getItem(ACCESS_TOKEN);
  const refresh_token = cookieStorage.getItem(REFRESH_TOKEN);

  if (!refresh_token) {
    throw new Error("No refresh token available");
  }
  try {
    const response = await axios.post(
      REFRESH_USER,
      { refresh: refresh_token },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log("Token refreshed:", response.data);

    const { access_token: newAccess, refresh_token: newRefresh } =
      response.data.data;
    setTokens({ access_token: newAccess, refresh_token: newRefresh });

    return newAccess;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};
