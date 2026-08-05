import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight edge proxy:
 * - request id for logs
 * - block obvious junk paths
 * - no auth gate (local-first; remote auth wired later via provider)
 */
export function proxy(request: NextRequest) {
  const requestId =
    request.headers.get("x-request-id") ||
    `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  const { pathname } = request.nextUrl;

  // Cheap bot/noise rejection
  if (
    pathname.startsWith("/wp-") ||
    pathname.startsWith("/.env") ||
    pathname.includes("phpmyadmin")
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const res = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });
  res.headers.set("x-request-id", requestId);
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
