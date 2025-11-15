import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Public UI routes + API routes
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/google",
  "/auth/google/callback",

  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/google",
  "/api/auth/google/callback",

  "/api/search/courses",
  "/api/recommendations",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(" Middleware Hit:", pathname);

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Allow explicitly public routes first
  if (isPublicRoute) {
    console.log("Public route → allowing:", pathname);
    return NextResponse.next();
  }

  // Treat course listing (GET /api/courses) as public, but protect other /api/courses routes
  if (pathname.startsWith("/api/courses")) {
    if (request.method === "GET") {
      console.log("Public GET /api/courses route → allowing:", pathname);
      return NextResponse.next();
    }
    // For non-GET (POST/PUT/DELETE) require auth and header injection
  }

  const tokenCookie = request.cookies.get("auth-token");
  console.log(" Cookie object:", tokenCookie);

  const token = tokenCookie?.value;
  console.log(" Extracted token:", token);

  if (!token) {
    console.log(" No token — redirecting to login");

    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const decoded = verifyToken(token);
  console.log(" Token decoded:", decoded);

  if (!decoded) {
    console.log(" Invalid token — redirecting to login");

    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  console.log(" Token valid. User:", decoded.email);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", decoded.userId);
  requestHeaders.set("x-user-email", decoded.email);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
  runtime: "nodejs",
};
