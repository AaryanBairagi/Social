import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/tokens";

const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/features",
  "/contact-us",
  "/learn-more",
  "/whats-next",
];

const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/me",
  "/api/auth/logout",
  "/api/contact",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public pages
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow auth APIs
  if (PUBLIC_API_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("sc_access_token")?.value;

  // No token
  if (!accessToken) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json( { success: false, message: "Unauthorized" }, { status: 401 } );
    }

    return NextResponse.redirect( new URL("/sign-in", req.url) );
  }

  try {
    await verifyAccessToken(accessToken);
    return NextResponse.next();
  } 
  catch {
    if (pathname.startsWith("/api")) {
      return NextResponse.json( { success: false, message: "Unauthorized" }, { status: 401 } );
    }

    return NextResponse.redirect( new URL("/sign-in", req.url) );
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};