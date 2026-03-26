import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow auth API routes through
  if (isApiAuth) return NextResponse.next();

  // Redirect logged-in users away from login page
  if (isLoginPage && session === process.env.AUTH_SECRET) {
    return NextResponse.redirect(new URL("/posts", req.url));
  }

  // Redirect unauthenticated users to login
  if (!isLoginPage && session !== process.env.AUTH_SECRET) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
