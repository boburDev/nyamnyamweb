// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const access = url.searchParams.get("access");
  const refresh = url.searchParams.get("refresh");

  console.log("🔹 Callback endpoint triggered");
  console.log("📥 Full URL:", url.toString());
  console.log("📥 Access Token (query):", access);
  console.log("📥 Refresh Token (query):", refresh);

  if (!access || !refresh) {
    console.error("❌ Tokens not found in query params");
    return NextResponse.json({ error: "Tokens not found" }, { status: 400 });
  }

  console.log("✅ Tokens found, setting cookies...");

  const res = NextResponse.redirect(new URL("/", req.url));

  res.cookies.set(ACCESS_TOKEN, access, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
  });
  res.cookies.set(REFRESH_TOKEN, refresh, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
  });

  console.log("🍪 Cookies set successfully, redirecting to homepage...");

  return res;
}
