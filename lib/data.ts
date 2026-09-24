import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { EventSettings, GalleryPhoto, Rsvp } from '@/lib/types'

export const getEventSettings = cache(async (): Promise<EventSettings | null> => {
  const supabase = await createClient()
  const { data } = await supabase.from('event_settings').select('*').eq('id', 1).maybeSingle()
  return data
})

export const getPublishedGallery = cache(async (): Promise<GalleryPhoto[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('status', 'approved')
    .eq('is_published', true)
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
})

export type GuestWallEntry = Pick<Rsvp, 'id' | 'full_name' | 'message' | 'created_at'>

/** Approved RSVP messages only — uses the service-role client since anon cannot select `rsvps`. */
export const getGuestWallMessages = cache(async (): Promise<GuestWallEntry[]> => {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('rsvps')
    .select('id, full_name, message, created_at')
    .eq('status', 'approved')
    .not('message', 'is', null)
    .neq('message', '')
    .order('created_at', { ascending: false })
    .limit(20)
  return data ?? []
})
