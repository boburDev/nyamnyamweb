import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;
    const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

    if (!refreshToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (accessToken) {
      return NextResponse.json({ authenticated: true }, { status: 200 });
    }

    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (!refreshRes.ok) {
      const res = NextResponse.json({ authenticated: false }, { status: 401 });
      res.cookies.delete(ACCESS_TOKEN);
      res.cookies.delete(REFRESH_TOKEN);
      return res;
    }

    const json = await refreshRes.json();
    const newAT = json?.data?.access_token ?? json?.access ?? null;
    const newRT = json?.data?.refresh_token ?? json?.refresh ?? null;

    if (!newAT) {
      const res = NextResponse.json({ authenticated: false }, { status: 401 });
      res.cookies.delete(ACCESS_TOKEN);
      res.cookies.delete(REFRESH_TOKEN);
      return res;
    }

    const res = NextResponse.json({ authenticated: true }, { status: 200 });
    res.cookies.set(ACCESS_TOKEN, newAT, { httpOnly: true, path: "/" });
    if (newRT) res.cookies.set(REFRESH_TOKEN, newRT, { httpOnly: true, path: "/" });
    return res;
  } catch (err) {
    console.error("refresh-check error:", err);
    return NextResponse.json({ authenticated: false, error: "internal_error" }, { status: 500 });
  }
}
