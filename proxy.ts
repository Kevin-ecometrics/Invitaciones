import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/session-verify'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  const session = await verifyAdminSessionToken(token)

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
