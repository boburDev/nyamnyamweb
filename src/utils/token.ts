import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import type { Tokens } from "@/types";
import { cookieStorage } from "../lib/cookieStorage";

export function setTokens({ access_token, refresh_token }: Tokens) {
  cookieStorage.setItem(ACCESS_TOKEN, access_token);
  cookieStorage.setItem(REFRESH_TOKEN, refresh_token);
}

export function getTokens() {
  return {
    access_token: cookieStorage.getItem(ACCESS_TOKEN),
    refresh_token: cookieStorage.getItem(REFRESH_TOKEN),
  };
}

export function clearTokens() {
  cookieStorage.removeItem(ACCESS_TOKEN);
  cookieStorage.removeItem(REFRESH_TOKEN);
}
