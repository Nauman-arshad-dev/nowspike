// E:\nauman\NowSpike\frontend\middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const canonicalDomain = "https://www.nowspike.com";

  // Domain canonicalization: Redirect to https://www.nowspike.com
  const currentUrl = `${protocol}://${host}${req.nextUrl.pathname}${req.nextUrl.search}`;
  const isNonCanonical = host !== "www.nowspike.com" || protocol !== "https";

  if (isNonCanonical) {
    const redirectUrl = `${canonicalDomain}${req.nextUrl.pathname}${req.nextUrl.search}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Apply CORS headers to API routes
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api")) {
    res.headers.set("Access-Control-Allow-Origin", "https://www.nowspike.com");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};