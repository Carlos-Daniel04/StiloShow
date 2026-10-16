import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "stilshow_session";

export function middleware(request: NextRequest) {
  const protectedPath = ["/cuenta", "/empleado", "/admin"].some((path) => request.nextUrl.pathname.startsWith(path));
  if (protectedPath && !request.cookies.has(SESSION_COOKIE)) {
    const login = new URL("/iniciar-sesion", request.url);
    login.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/cuenta/:path*", "/empleado/:path*", "/admin/:path*"],
};
