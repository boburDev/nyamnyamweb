import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_TOKEN)?.value ?? null;
    const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value ?? null;

    const currentUrl = new URL(req.url);
    const itemNumber = currentUrl.searchParams.get("item_number");

    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/${params.orderId}/download-qr/?item_number=${itemNumber}`;

    const mainHeaders: Record<string, string> = {};
    if (accessToken) mainHeaders["Authorization"] = `Bearer ${accessToken}`;

    // 1) Try main request
    let response = await fetch(targetUrl, { headers: mainHeaders });

    // 2) If 401 → try refresh
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
      const newAT = data?.data?.access_token ?? data?.access;

      if (!newAT) {
        const logout = NextResponse.redirect(new URL("/signin", req.url));
        logout.cookies.delete(ACCESS_TOKEN);
        logout.cookies.delete(REFRESH_TOKEN);
        return logout;
      }

      // Save new tokens in cookies
      const nextRes = NextResponse.next();
      nextRes.cookies.set(ACCESS_TOKEN, newAT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      // Retry request
      accessToken = newAT;
      const retryHeaders = { Authorization: `Bearer ${accessToken}` };

      response = await fetch(targetUrl, { headers: retryHeaders });
    }

    // 3) Return binary file (PNG/PDF)
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": response.headers.get("Content-Disposition") || "",
      },
    });
  } catch (err) {
    console.error("🔥 Download QR Proxy Error:", err);
    return NextResponse.json(
      { error: "Failed to download QR", details: String(err) },
      { status: 500 }
    );
  }
}
