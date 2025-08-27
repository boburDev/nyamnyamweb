import { TOKEN } from "@/constants";
import { cookies } from "next/headers";

export async function getAuthStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN);
  return !!token;
}
