import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const pathname = request.nextUrl.pathname

  const authRoutes = ['/signin', '/signup']
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const protectedRoutes = ['/my-projects', '/profile']
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/my-projects/:path*',
    '/profile/:path*',
  ],
}