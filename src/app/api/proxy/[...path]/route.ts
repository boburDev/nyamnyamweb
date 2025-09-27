import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path.join("/")}`;

    let response = await fetch(targetUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("response", response);
    console.log("APIRUL", targetUrl);

    if (response.status === 401 && refreshToken) {
      console.warn("⚠️ Access token expired, trying refresh...");

      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (!refreshRes.ok) {
        const logoutResponse = NextResponse.redirect(
          new URL("/signin", req.url)
        );
        logoutResponse.cookies.delete(ACCESS_TOKEN);
        logoutResponse.cookies.delete(REFRESH_TOKEN);
        return logoutResponse;
      }

      const json = await refreshRes.json();

      const newAT = json?.data?.access_token;
      const newRT = json?.data?.refresh_token;

      if (!newAT) {
        const logoutResponse = NextResponse.redirect(
          new URL("/signin", req.url)
        );
        logoutResponse.cookies.delete(ACCESS_TOKEN);
        logoutResponse.cookies.delete(REFRESH_TOKEN);
        return logoutResponse;
      }

      const res = NextResponse.next();
      res.cookies.set(ACCESS_TOKEN, newAT, { httpOnly: false, path: "/" });
      if (newRT) {
        res.cookies.set(REFRESH_TOKEN, newRT, { httpOnly: false, path: "/" });
      }
      accessToken = newAT;

      response = await fetch(targetUrl, {
        headers: { Authorization: `Bearer ${newAT}` },
      });
    }

    const data = await response.json();
    console.log("✅ Final response data:", data);
    return NextResponse.json(data, { status: response.status });

  } catch (err) {
    console.error("🔥 Proxy error:", err);
    return NextResponse.json(
      { error: "Internal proxy error", details: String(err) },
      { status: 500 }
    );
  }
}
