import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  const protectedRoutes = ['/my-projects', '/profile']
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/my-projects/:path*',
    '/profile/:path*',
  ],
}