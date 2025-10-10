import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { REFRESH_TOKEN } from "./constants";

const nextIntlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(REFRESH_TOKEN);

  const isProtectedRoute =
    pathname.includes("/order") ||
    pathname.includes("/profile") ||
    pathname.includes("/favourites");

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

  const response = nextIntlMiddleware(request);
  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
