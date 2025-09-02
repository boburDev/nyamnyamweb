import { REFRESH_TOKEN } from "@/constants";
import { cookies } from "next/headers";

export async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFRESH_TOKEN);
  return !!token;
}
