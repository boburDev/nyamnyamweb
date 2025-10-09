// app/api/auth/status/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/constants";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN)?.value;
    const isAuthenticated = Boolean(token);
    const res = NextResponse.json({ isAuthenticated });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}
