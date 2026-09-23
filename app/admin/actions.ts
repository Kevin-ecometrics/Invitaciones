'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminSession, destroyAdminSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
}

export async function logout() {
  await destroyAdminSession()
  redirect('/admin/login')
}

export async function approveRsvp(id: string) {
  const session = await requireAdmin()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('rsvps')
    .update({
      status: 'approved',
      reviewed_by: String(session.sub || 'admin'),
      reviewed_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin')
  return { ok: true }
}

export async function rejectRsvp(id: string, reason: string) {
  const session = await requireAdmin()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('rsvps')
    .update({
      status: 'rejected',
      reviewed_by: String(session.sub || 'admin'),
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason?.trim().slice(0, 300) || null,
    })
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin')
  return { ok: true }
}

export async function approveGalleryPhoto(id: string) {
  const session = await requireAdmin()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('gallery_photos')
    .update({
      status: 'approved',
      is_published: true,
      reviewed_by: String(session.sub || 'admin'),
      reviewed_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq('id', id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin')
  revalidatePath('/')
  return { ok: true }
}

export async function rejectGalleryPhoto(id: string, reason: string) {
  const session = await requireAdmin()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('gallery_photos')
    .update({
      status: 'rejected',
      is_published: false,
      reviewed_by: String(session.sub || 'admin'),
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason?.trim().slice(0, 300) || null,
    })
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin')
  revalidatePath('/')
  return { ok: true }
}

export async function unpublishGalleryPhoto(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('gallery_photos')
    .update({ is_published: false })
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin')
  revalidatePath('/')
  return { ok: true }
}

export async function publishGalleryPhoto(id: string) {
  await requireAdmin()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('gallery_photos')
    .update({ is_published: true })
    .eq('id', id)
    .eq('status', 'approved')

  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin')
  revalidatePath('/')
  return { ok: true }
}

export async function deleteGalleryPhoto(id: string, storagePath: string) {
  await requireAdmin()
  const supabase = createAdminClient()

  await supabase.storage.from('gallery').remove([storagePath])
  const { error } = await supabase.from('gallery_photos').delete().eq('id', id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin')
  revalidatePath('/')
  return { ok: true }
}

export interface UpdateEventSettingsInput {
  event_title: string
  event_date: string
  welcome_time: string
  dinner_time: string
  venue_name: string
  venue_address: string
  dress_code_title: string
  dress_code_description: string
  hero_headline: string
  gift_registry_links: { label: string; url: string }[]
}

export async function updateEventSettings(input: UpdateEventSettingsInput) {
  await requireAdmin()
  const supabase = createAdminClient()

  const cleanLinks = input.gift_registry_links
    .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
    .filter((l) => l.label && l.url)

  const { error } = await supabase
    .from('event_settings')
    .update({
      event_title: input.event_title || null,
      event_date: input.event_date || null,
      welcome_time: input.welcome_time || null,
      dinner_time: input.dinner_time || null,
      venue_name: input.venue_name || null,
      venue_address: input.venue_address || null,
      dress_code_title: input.dress_code_title || null,
      dress_code_description: input.dress_code_description || null,
      hero_headline: input.hero_headline || null,
      gift_registry_links: cleanLinks,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin')
  revalidatePath('/')
  return { ok: true }
}
