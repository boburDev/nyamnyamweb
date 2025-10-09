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
    let accessToken = cookieStore.get(ACCESS_TOKEN)?.value ?? null;
    const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value ?? null;
    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path.join("/")}`;

    console.log("🌍 Target URL:", targetUrl);

    const mainHeaders: Record<string, string> = {};
    if (accessToken) mainHeaders["Authorization"] = `Bearer ${accessToken}`;

    let response = await fetch(targetUrl, { headers: mainHeaders });
    console.log("📡 Main response status:", response.status);

    if (response.status === 401 && refreshToken) {
      console.warn("⚠️ Access token expired, attempting refresh...");

      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      console.log("📡 Refresh response status:", refreshRes.status);
      const rawRefresh = await refreshRes.text();
      console.log(
        "📦 Raw refresh response (preview):",
        rawRefresh.slice(0, 500)
      );

      if (!refreshRes.ok) {
        console.error(
          "❌ Refresh token invalid or expired -> redirect to /signin"
        );
        const logoutResponse = NextResponse.redirect(
          new URL("/signin", req.url)
        );
        logoutResponse.cookies.delete(ACCESS_TOKEN);
        logoutResponse.cookies.delete(REFRESH_TOKEN);
        return logoutResponse;
      }

      interface RefreshResponse {
        data?: {
          access_token?: string;
          refresh_token?: string;
        };
        access?: string;
        refresh?: string;
      }
      let refreshJson: RefreshResponse = {};
      try {
        refreshJson = JSON.parse(rawRefresh);
      } catch (e) {
        console.error("⚠️ Failed to parse refresh JSON:", e);
      }

      const newAT =
        refreshJson?.data?.access_token ?? refreshJson?.access ?? null;
      const newRT =
        refreshJson?.data?.refresh_token ?? refreshJson?.refresh ?? null;

      if (!newAT) {
        console.error("❌ No new access token received -> redirect to /signin");
        const logoutResponse = NextResponse.redirect(
          new URL("/signin", req.url)
        );
        logoutResponse.cookies.delete(ACCESS_TOKEN);
        logoutResponse.cookies.delete(REFRESH_TOKEN);
        return logoutResponse;
      }

      accessToken = newAT;
      const retryHeaders: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
      };

      response = await fetch(targetUrl, { headers: retryHeaders });
      console.log("📡 Retry response status:", response.status);

      const rawText = await response.text();
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        console.error("⚠️ Failed to parse JSON:", e);
        parsed = null;
      }

      if (parsed !== null) {
        const nr = NextResponse.json(parsed, { status: response.status });
        nr.cookies.set(ACCESS_TOKEN, newAT, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
        if (newRT) {
          nr.cookies.set(REFRESH_TOKEN, newRT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
        console.log("✅ Returning JSON response with Set-Cookie headers");
        return nr;
      } else {
        const nr = new NextResponse(rawText, { status: response.status });
        nr.cookies.set(ACCESS_TOKEN, newAT, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
        if (newRT) {
          nr.cookies.set(REFRESH_TOKEN, newRT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
        console.log("✅ Returning text response with Set-Cookie headers");
        return nr;
      }
    }

    const raw = await response.text();
    try {
      const data = JSON.parse(raw);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return new NextResponse(raw, { status: response.status });
    }
  } catch (err) {
    console.error("🔥 Proxy error (GET):", err);
    return NextResponse.json(
      { error: "Internal proxy error", details: String(err) },
      { status: 500 }
    );
  }
}
