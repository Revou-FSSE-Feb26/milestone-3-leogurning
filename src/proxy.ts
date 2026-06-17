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

  // Check for auth cookie
  const sessionCookie = request.cookies.get("session")?.value;
  const authCookie = request.cookies.get("auth_session")?.value;
  const isAuthenticated = !!authCookie;

  // If accessing admin page and not authenticated, redirect to login
  if (isAdminOnlyRoute && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // If accessing cart/checkout and not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated && !isAdminOnlyRoute) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Decode and parse the session payload from the cookie
    const sessionData: SessionData = JSON.parse(sessionCookie);
    const user = sessionData.user;

    // ==========================================
    // Parse session data and enforce RBAC rules:
    //   - Block non-admin users (role !== admin) from admin dashboard
    // ==========================================

    if (isAdminOnlyRoute && isAuthenticated && user.role !== "admin") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  } catch (error) {
    console.error("Proxy Auth Verification Error:", error);
    // In case of cookie corruption or parsing issues, flush the bad cookie
    // and redirect the user back to the sign-in screen to prevent loading loops.
    const loginRedirect = NextResponse.redirect(new URL("/login", request.url));
    loginRedirect.cookies.delete("session");
    loginRedirect.cookies.delete("auth_session");
    return loginRedirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cart", "/checkout"],
};
