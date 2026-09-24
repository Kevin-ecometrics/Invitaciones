'use server'

import { createAdminSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { createHash, timingSafeEqual } from 'node:crypto'

export interface LoginResult {
  ok: boolean
  error?: string
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export async function login(_prevState: LoginResult | null, formData: FormData): Promise<LoginResult> {
  const username = String(formData.get('username') || '').trim()
  const password = String(formData.get('password') || '')

  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD

  if (!expectedUser || !expectedPass) {
    return { ok: false, error: 'Configuración de admin incompleta.' }
  }

  const usernameMatches = timingSafeStringEqual(username, expectedUser)
  const passwordMatches = timingSafeStringEqual(password, expectedPass)

  if (!usernameMatches || !passwordMatches) {
    return { ok: false, error: 'Usuario o contraseña incorrectos.' }
  }

  await createAdminSession(username)
  redirect('/admin')
}
