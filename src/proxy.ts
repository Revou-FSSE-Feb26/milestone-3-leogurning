import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SessionData } from "./types";

// Protected routes that require authentication
const protectedRoutes = ["/admin", "/cart", "/checkout"];
const adminOnlyRoutes = ["/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if route is admin-only
  const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check for auth cookie (auth_session is set by /api/auth/login)
  const authCookie = request.cookies.get("auth_session")?.value;
  const isAuthenticated = !!authCookie;

  // If accessing protected route and not authenticated, redirect to login with redirect param
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // For admin routes, check the session cookie if available for role verification
  const sessionCookie = request.cookies.get("session")?.value;

  if (isAdminOnlyRoute && isAuthenticated) {
    // Try to get role from session cookie (set by /api/auth/me)
    let userRole: string | undefined;

    if (sessionCookie) {
      try {
        const sessionData: SessionData = JSON.parse(sessionCookie);
        userRole = sessionData.user?.role;
      } catch {
        // Invalid session cookie, user needs to refresh
        userRole = undefined;
      }
    }

    // If no session cookie yet (race condition), allow through - the frontend will handle it
    // The user will be redirected to /unauthorized after /api/auth/me completes if not admin
    if (userRole !== undefined && userRole !== "admin") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

// Protected routes: /admin, /cart, /checkout (and their sub-paths).
// All three are enforced here via the proxy middleware using the auth_session cookie.
export const config = {
  matcher: ["/admin/:path*", "/cart/:path*", "/checkout/:path*"],
};
