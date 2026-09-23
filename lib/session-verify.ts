import { jwtVerify } from 'jose'

export const ADMIN_SESSION_COOKIE = 'admin_session'

function getSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload
  } catch {
    return null
  }
}
