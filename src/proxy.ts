import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["en", "id", "th", "vi", "ja", "zh", "my", "ru", "ko"];
const countryToLocale: Record<string, string> = {
  ID: "id",
  TH: "th",
  VN: "vi",
  JP: "ja",
  CN: "zh",
  TW: "zh",
  MM: "my",
  RU: "ru",
  KR: "ko",
};

const getPathSegments = (pathname: string) =>
  pathname.split("/").filter(Boolean);

const hasFileExtension = (pathname: string) => /\.[^/]+$/.test(pathname);

const getPreferredLocale = (req: Pick<NextRequest, "headers">) => {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "";
  const countryLocale = countryToLocale[country.toUpperCase()];
  if (countryLocale) return countryLocale;

  const acceptLanguage = req.headers.get("accept-language");
  const preferredLanguage = acceptLanguage
    ?.split(",")[0]
    ?.split("-")[0]
    ?.toLowerCase();
  if (preferredLanguage && locales.includes(preferredLanguage))
    return preferredLanguage;

  return "id";
};

export const proxy = auth((req: any) => {
  const { nextUrl } = req;
  const segments = getPathSegments(nextUrl.pathname);
  const firstSegment = segments[0];
  const hasLocale = firstSegment ? locales.includes(firstSegment) : false;

  if (
    !hasLocale &&
    nextUrl.pathname !== "/" &&
    !hasFileExtension(nextUrl.pathname)
  ) {
    const url = nextUrl.clone();
    url.pathname = `/${getPreferredLocale(req)}${nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }

  const pathWithoutLocale = hasLocale
    ? `/${segments.slice(1).join("/")}`
    : nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";
  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isAuthRoute = ["/login", "/register"].includes(pathWithoutLocale);
  const isApiAuthRoute = pathWithoutLocale.startsWith("/api/auth");

  if (isApiAuthRoute) return NextResponse.next();
  if (isAdminRoute && !isAdmin)
    return NextResponse.redirect(
      new URL(hasLocale ? `/${firstSegment}` : "/", nextUrl),
    );
  if (isAuthRoute && isLoggedIn)
    return NextResponse.redirect(
      new URL(hasLocale ? `/${firstSegment}` : "/", nextUrl),
    );

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
