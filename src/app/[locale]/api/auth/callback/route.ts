import { NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const url = new URL(req.url);

  let access = url.searchParams.get("access") ?? undefined;
  let refresh = url.searchParams.get("refresh") ?? undefined;
  let lang = url.searchParams.get("lang") ?? locale;

  if ((!access || !refresh) && url.pathname.includes("/callback/")) {
    const tail = url.pathname.split("/callback/")[1] ?? "";
    if (tail) {
      try {
        const p = new URLSearchParams(tail);
        access = access ?? p.get("access") ?? undefined;
        refresh = refresh ?? p.get("refresh") ?? undefined;
        lang = lang ?? p.get("lang") ?? locale;
      } catch (err) {
        console.error("❌ failed parsing tail params:", err);
      }
    }
  }

  if (!access || !refresh) {
    console.error(
      "❌ Tokens not found (server cannot read hash fragments). Full URL:",
      url.toString()
    );
    return NextResponse.json({ error: "Tokens not found" }, { status: 400 });
  }
  const redirectBaseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const res = NextResponse.redirect(new URL(`/${lang}`, redirectBaseUrl));

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

  return res;
}
