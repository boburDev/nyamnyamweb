import { NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ACCESS_TOKEN);
  res.cookies.delete(REFRESH_TOKEN);
  return res;
}
