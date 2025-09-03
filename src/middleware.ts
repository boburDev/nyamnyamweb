import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { ACCESS_TOKEN, REFRESH_TOKEN, REFRESH_USER } from "./constants";
import axios from "axios";

const nextIntlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
});

// JWT expired check
function isTokenExpired(token: string) {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const exp = decoded.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

// refresh token funksiyasi
export const refreshTokens = async (
  refresh_token: string,
  access_token?: string
) => {
  if (!refresh_token) {
    throw new Error("No refresh token available");
  }
  try {
    const response = await axios.post(
      REFRESH_USER!,
      { refresh: refresh_token },
      {
        headers: {
          "Content-Type": "application/json",
          ...(access_token
            ? { Authorization: `Bearer ${access_token}` }
            : {}),
        },
      }
    );
    console.log("Token refreshed:", response.data);
    const { access_token: newAccess, refresh_token: newRefresh } = response.data;
    return { access_token: newAccess, refresh_token: newRefresh };
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(REFRESH_TOKEN);
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value
  const isProtectedRoute = pathname.includes("/cart") || pathname.includes("/order");

  const isAuthRoute =
    pathname.includes("/signin") ||
    pathname.includes("/signup") ||
    pathname.includes("/verify") ||
    pathname.includes("/reset-password") ||
    pathname.includes("/forgot-password");

  const isAuthenticated = !!token;

  if (!isAuthenticated && isProtectedRoute) {
    const locale = pathname.split("/")[1];
    const notFoundUrl = new URL(`/${locale}/not-found`, request.url);
    return NextResponse.rewrite(notFoundUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    const locale = pathname.split("/")[1];
    const userHomePage = new URL(`/${locale}/not-found`, request.url);
    return NextResponse.rewrite(userHomePage);
  }
  if (isAuthenticated && accessToken && isTokenExpired(accessToken)) {
    const locale = pathname.split("/")[1];
    const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;

    if (refreshToken) {
      const tokens = await refreshTokens(refreshToken, accessToken);
      if (tokens) {
        const response = nextIntlMiddleware(request);
        response.cookies.set(ACCESS_TOKEN, tokens.access_token, {
          httpOnly: true,
          secure: true,
        });
        response.cookies.set(REFRESH_TOKEN, tokens.refresh_token, {
          httpOnly: true,
          secure: true,
        });
        return response;
      } else {
        return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
      }
    }
  }
  const response = nextIntlMiddleware(request);
  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
