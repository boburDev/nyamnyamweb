import { NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function GET(
  req: Request,
  { params }: { params: { locale: string } }
) {
  const locale = params?.locale ?? "uz";
  const url = new URL(req.url);


  let access = url.searchParams.get("access") ?? undefined;
  let refresh = url.searchParams.get("refresh") ?? undefined;
  let lang = url.searchParams.get("lang") ?? locale;

  if ((!access || !refresh) && url.pathname.includes("/callback/")) {
    const tail = url.pathname.split("/callback/")[1] ?? "";
    console.log("🔍 parsing tail from pathname:", tail);
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
    console.error("❌ Tokens not found (server cannot read hash fragments). Full URL:", url.toString());
    return NextResponse.json({ error: "Tokens not found" }, { status: 400 });
  }

  const secureFlag = process.env.NODE_ENV === "production";

  const res = NextResponse.redirect(new URL(`/${lang}`, req.url));

  res.cookies.set(ACCESS_TOKEN, access, {
    // httpOnly: true,
    secure: secureFlag,
    path: "/",
    sameSite: "lax",
  });

  res.cookies.set(REFRESH_TOKEN, refresh, {
    // httpOnly: true,
    secure: secureFlag,
    path: "/",
    sameSite: "lax",
  });

  return res;
}
