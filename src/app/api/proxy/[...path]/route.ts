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

    console.log("➡️ Request to target:", targetUrl);
    console.log("📌 Current accessToken:", accessToken);
    console.log("📌 Current refreshToken:", refreshToken);

    let response = await fetch(targetUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

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
        console.error("🔴 Refresh token invalid, redirecting to signin");
        const logoutResponse = NextResponse.redirect(new URL("/signin", req.url));
        window.location.reload();
        logoutResponse.cookies.delete(ACCESS_TOKEN);
        logoutResponse.cookies.delete(REFRESH_TOKEN);
        return logoutResponse;
      }

      const json = await refreshRes.json();
      console.log("🟢 Refresh success, new tokens:", json);

      const newAT = json?.data?.access_token;
      const newRT = json?.data?.refresh_token;

      if (!newAT) {
        console.error("❌ Refresh response invalid:", json);
        const logoutResponse = NextResponse.redirect(new URL("/signin", req.url));
        logoutResponse.cookies.delete(ACCESS_TOKEN);
        logoutResponse.cookies.delete(REFRESH_TOKEN);
        return logoutResponse;
      }

      // Yangi tokenlarni cookie ga yozamiz
      const res = NextResponse.next();
      res.cookies.set(ACCESS_TOKEN, newAT, { httpOnly: true, path: "/" });
      if (newRT) {
        res.cookies.set(REFRESH_TOKEN, newRT, { httpOnly: true, path: "/" });
      }
      accessToken = newAT;

      // Qaytadan profile so‘rov yuboramiz
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
