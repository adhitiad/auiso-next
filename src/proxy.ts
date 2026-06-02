import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")

  if (isApiAuthRoute) return NextResponse.next()
  if (isAdminRoute && !isAdmin) return NextResponse.redirect(new URL("/", nextUrl))
  if (isAuthRoute && isLoggedIn) return NextResponse.redirect(new URL("/", nextUrl))

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
