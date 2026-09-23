'use server'

import { createAdminSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export interface LoginResult {
  ok: boolean
  error?: string
}

export async function login(_prevState: LoginResult | null, formData: FormData): Promise<LoginResult> {
  const username = String(formData.get('username') || '').trim()
  const password = String(formData.get('password') || '')

  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD

  if (!expectedUser || !expectedPass) {
    return { ok: false, error: 'Configuración de admin incompleta.' }
  }

  if (username !== expectedUser || password !== expectedPass) {
    return { ok: false, error: 'Usuario o contraseña incorrectos.' }
  }

  await createAdminSession(username)
  redirect('/admin')
}
