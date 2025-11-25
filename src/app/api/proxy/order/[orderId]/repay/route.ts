import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN)?.value ?? null;
    const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value ?? null;

    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/repay/`;

    const mainHeaders: Record<string, string> = {};
    if (accessToken) {
      mainHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    let response = await fetch(targetUrl, { headers: mainHeaders });

    // 401 bo‘lsa — token yangilaymiz
    if (response.status === 401 && refreshToken) {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (!refreshRes.ok) {
        const logout = NextResponse.redirect(new URL("/signin", req.url));
        logout.cookies.delete(ACCESS_TOKEN);
        logout.cookies.delete(REFRESH_TOKEN);
        return logout;
      }

      const data = await refreshRes.json();
      const newAccessToken = data?.data?.access_token ?? data?.access;
      if (!newAccessToken) {
        const logout = NextResponse.redirect(new URL("/signin", req.url));
        logout.cookies.delete(ACCESS_TOKEN);
        logout.cookies.delete(REFRESH_TOKEN);
        return logout;
      }

      const nextRes = NextResponse.next();
      nextRes.cookies.set(ACCESS_TOKEN, newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      const retryHeaders = {
        Authorization: `Bearer ${newAccessToken}`,
      };

      response = await fetch(targetUrl, { headers: retryHeaders });
    }

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("🔥 Repay Proxy Error:", err);
    return NextResponse.json(
      { error: "Failed to repay order", details: String(err) },
      { status: 500 }
    );
  }
}
