import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const AUTH_PAGES = ["/login", "/register"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = AUTH_PAGES.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (!isLoggedIn && !isAuthPage) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)"],
};
