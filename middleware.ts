import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;

  if ((pathname.startsWith("/register") || pathname.startsWith("/dashboard")) && !isAuth) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/register/:path*", "/dashboard/:path*"],
};
