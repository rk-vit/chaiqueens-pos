import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Allow login pages without auth
  if (path === "/admin/login" || path === "/cashier/login" || path=== "/admin/register" || path==="/cashier/register") {
    return NextResponse.next();
  }

  // If no token, redirect to home
  if (!token) return NextResponse.redirect(new URL("/", req.url));

  console.log("check");
  console.log(token.role);

  if (path.startsWith("/admin") && token.role !== "admin") {
    console.log("Shop");
    return NextResponse.redirect(new URL("/cashier", req.url));
  }
  if (path.startsWith("/cashier") && token.role !== "cashier") {
    console.log("user");
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/cashier/:path*", "/admin/:path*"],
}
