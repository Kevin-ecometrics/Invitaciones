'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

export interface SubmitGalleryPhotoResult {
  ok: boolean
  error?: string
}

const MAX_FILE_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
const MAX_PHOTOS_PER_SUBMITTER = 5
const SUBMITTER_COOKIE = 'gallery_submitter'

async function getSubmitterToken() {
  const cookieStore = await cookies()
  const existing = cookieStore.get(SUBMITTER_COOKIE)?.value
  if (existing) return existing

  const token = randomUUID()
  cookieStore.set(SUBMITTER_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
  return token
}

export async function submitGalleryPhoto(
  _prevState: SubmitGalleryPhotoResult | null,
  formData: FormData
): Promise<SubmitGalleryPhotoResult> {
  const file = formData.get('photo')
  const submittedByName =
    typeof formData.get('submitted_by_name') === 'string'
      ? (formData.get('submitted_by_name') as string).trim().slice(0, 120)
      : ''
  const altText =
    typeof formData.get('alt_text') === 'string'
      ? (formData.get('alt_text') as string).trim().slice(0, 200)
      : ''

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Selecciona una foto para subir.' }
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: 'La foto es demasiado grande (máximo 8MB).' }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Formato de imagen no soportado.' }
  }

  const submitterToken = await getSubmitterToken()

  // RLS only lets anon select published photos, so the per-submitter count check
  // needs the admin client — the anon client is still used for the actual insert
  // so the normal public "insert pending" RLS policy keeps applying.
  const admin = createAdminClient()
  const { count } = await admin
    .from('gallery_photos')
    .select('id', { count: 'exact', head: true })
    .eq('submitter_token', submitterToken)

  if ((count ?? 0) >= MAX_PHOTOS_PER_SUBMITTER) {
    return { ok: false, error: `Ya subiste el máximo de ${MAX_PHOTOS_PER_SUBMITTER} fotos.` }
  }

  const supabase = await createClient()

  const ext = file.name.split('.').pop()?.toLowerCase().slice(0, 5) || 'jpg'
  const path = `submissions/${randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    return { ok: false, error: 'No se pudo subir la foto. Intenta de nuevo.' }
  }

  const { error: insertError } = await supabase.from('gallery_photos').insert({
    storage_path: path,
    alt_text: altText || null,
    submitted_by_name: submittedByName || null,
    submitter_token: submitterToken,
    status: 'pending',
    is_published: false,
  })

  if (insertError) {
    await supabase.storage.from('gallery').remove([path])
    return { ok: false, error: 'No se pudo registrar la foto. Intenta de nuevo.' }
  }

  return { ok: true }
}
