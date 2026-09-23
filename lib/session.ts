import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from './session-verify'

const MAX_AGE_SECONDS = 60 * 60 * 8 // 8h

function getSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function createAdminSession(username: string) {
  const token = await new SignJWT({ sub: username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey())

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(token)
}

export { ADMIN_SESSION_COOKIE, verifyAdminSessionToken }
