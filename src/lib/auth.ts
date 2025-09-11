import { REFRESH_TOKEN } from "@/constants";
import { cookies } from "next/headers";

export async function getAuthStatus() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;
  const isAuth = Boolean(refreshToken);
  return isAuth;
}
