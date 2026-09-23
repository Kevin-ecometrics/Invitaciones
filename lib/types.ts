export type RsvpStatus = 'pending' | 'approved' | 'rejected'
export type GalleryStatus = 'pending' | 'approved' | 'rejected'

export interface GiftRegistryLink {
  label: string
  url: string
}

export interface EventSettings {
  id: number
  event_title: string | null
  event_date: string | null
  welcome_time: string | null
  dinner_time: string | null
  venue_name: string | null
  venue_address: string | null
  dress_code_title: string | null
  dress_code_description: string | null
  music_storage_path: string | null
  hero_headline: string | null
  rsvp_deadline: string | null
  gift_registry_links: GiftRegistryLink[]
  updated_at: string
}

export interface Rsvp {
  id: string
  guest_id: string | null
  full_name: string
  email: string | null
  phone: string | null
  party_size: number
  companion_names: string[] | null
  attendance: 'yes' | 'no'
  dietary_notes: string | null
  message: string | null
  status: RsvpStatus
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
}

export interface GalleryPhoto {
  id: string
  storage_path: string
  alt_text: string | null
  submitted_by_name: string | null
  submitter_token: string
  sort_order: number
  status: GalleryStatus
  is_published: boolean
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
}
