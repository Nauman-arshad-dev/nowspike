// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Apply CORS headers to all API routes
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
  matcher: "/api/:path*",
};