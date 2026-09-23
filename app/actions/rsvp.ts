'use server'

import { createClient } from '@/lib/supabase/server'

export interface CreateRsvpResult {
  ok: boolean
  error?: string
}

function cleanString(value: FormDataEntryValue | null, max = 500) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export async function createRsvp(
  _prevState: CreateRsvpResult | null,
  formData: FormData
): Promise<CreateRsvpResult> {
  const fullName = cleanString(formData.get('full_name'), 120)
  const email = cleanString(formData.get('email'), 160)
  const phone = cleanString(formData.get('phone'), 40)
  const attendance = cleanString(formData.get('attendance'), 3)
  const dietaryNotes = cleanString(formData.get('dietary_notes'), 500)
  const message = cleanString(formData.get('message'), 1000)
  const partySizeRaw = cleanString(formData.get('party_size'), 3)

  if (!fullName) {
    return { ok: false, error: 'El nombre es obligatorio.' }
  }
  if (attendance !== 'yes' && attendance !== 'no') {
    return { ok: false, error: 'Indica si asistirás.' }
  }

  let partySize = parseInt(partySizeRaw, 10)
  if (!Number.isFinite(partySize) || partySize < 1) partySize = 1
  if (partySize > 15) partySize = 15

  const companionNames = formData
    .getAll('companion_names')
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter(Boolean)
    .slice(0, 14)

  const supabase = await createClient()

  const { error } = await supabase.from('rsvps').insert({
    full_name: fullName,
    email: email || null,
    phone: phone || null,
    party_size: attendance === 'yes' ? partySize : 1,
    companion_names: companionNames.length ? companionNames : null,
    attendance,
    dietary_notes: dietaryNotes || null,
    message: message || null,
    status: 'pending',
  })

  if (error) {
    return { ok: false, error: 'No se pudo enviar tu confirmación. Intenta de nuevo.' }
  }

  return { ok: true }
}
