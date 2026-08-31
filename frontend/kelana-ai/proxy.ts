import { NextRequest, NextResponse } from "next/server"

// Routes that require authentication
const PROTECTED = ["/", "/trips"]

// Routes only for guests (redirect away if already logged in)
const GUEST_ONLY = ["/login", "/register"]

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("kelana_token")?.value

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  )
  const isGuestOnly = GUEST_ONLY.includes(pathname)

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isGuestOnly && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
}
