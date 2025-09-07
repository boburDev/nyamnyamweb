import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const cookieStore = await cookies();
  let accessToken = cookieStore.get(ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

  const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path.join(
    "/"
  )}`;
  let response = await fetch(targetUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 401 && refreshToken) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!refreshRes.ok) {
      const logoutResponse = NextResponse.redirect(new URL("/signin", req.url));
      logoutResponse.cookies.delete(ACCESS_TOKEN);
      logoutResponse.cookies.delete(REFRESH_TOKEN);
      return logoutResponse;
    }

    const { accessToken: newAT, refreshToken: newRT } = await refreshRes.json();
    const res = NextResponse.next();
    res.cookies.set(ACCESS_TOKEN, newAT, { httpOnly: true, path: "/" });
    if (newRT)
      res.cookies.set(REFRESH_TOKEN, newRT, { httpOnly: true, path: "/" });
    accessToken = newAT;

    response = await fetch(targetUrl, {
      headers: { Authorization: `Bearer ${newAT}` },
    });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
