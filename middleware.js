import withAuth from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(function middleware(req) {
  const { role } = req.nextauth.token.user
  const { pathname } = req.nextUrl
  const isAuthenticated = req.nextauth.token

  if (!isAuthenticated)
    return NextResponse.redirect(new URL("/users/login", req.url))

  if (pathname.startsWith("/admin") && role !== "admin")
    return NextResponse.redirect(new URL("/", req.url))
})

export const config = {
  matcher: ["/openrecruitment", "/votings/candidates", "/admin/:path*"],
}
