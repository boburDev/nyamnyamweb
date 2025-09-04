import { REFRESH_USER } from "@/constants";
import { getTokens, setTokens } from "@/utils/token";
import axios from "axios";

export const refreshTokens = async () => {
  const { access_token, refresh_token } = getTokens();

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
    
    const { access_token: newAccess, refresh_token: newRefresh } = response.data;
    setTokens({ access_token: newAccess, refresh_token: newRefresh });

    return newAccess;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};
