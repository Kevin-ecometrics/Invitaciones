'use client'

import { useState, useTransition } from 'react'
import { updateEventSettings } from '@/app/admin/actions'
import type { EventSettings, GiftRegistryLink } from '@/lib/types'
import { CheckIcon, GiftIcon, TrashIcon } from '@/components/Icons'

function toLocalInputValue(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function SettingsForm({ settings }: { settings: EventSettings | null }) {
  const [form, setForm] = useState({
    event_title: settings?.event_title ?? '',
    event_date: toLocalInputValue(settings?.event_date ?? null),
    welcome_time: settings?.welcome_time ?? '',
    dinner_time: settings?.dinner_time ?? '',
    venue_name: settings?.venue_name ?? '',
    venue_address: settings?.venue_address ?? '',
    dress_code_title: settings?.dress_code_title ?? '',
    dress_code_description: settings?.dress_code_description ?? '',
    hero_headline: settings?.hero_headline ?? '',
  })
  const [giftLinks, setGiftLinks] = useState<GiftRegistryLink[]>(
    settings?.gift_registry_links?.length ? settings.gift_registry_links : []
  )
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function field(key: keyof typeof form, label: string, type = 'text') {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-silver/70">{label}</label>
        {type === 'textarea' ? (
          <textarea
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            rows={3}
            className="rounded-xl border border-silver/20 bg-white/5 px-3.5 py-2.5 text-foreground outline-none transition focus:border-violet"
          />
        ) : (
          <input
            type={type}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="rounded-xl border border-silver/20 bg-white/5 px-3.5 py-2.5 text-foreground outline-none transition focus:border-violet"
          />
        )}
      </div>
    )
  }

  return (
    <div className="glass-card flex flex-col gap-6 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-silver/50">General</p>
        {field('event_title', 'Título del evento')}
        {field('hero_headline', 'Frase principal (hero)', 'textarea')}
        {field('event_date', 'Fecha y hora del evento', 'datetime-local')}
      </div>

      <div className="flex flex-col gap-4 border-t border-silver/10 pt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-silver/50">Horarios y lugar</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {field('welcome_time', 'Hora de bienvenida')}
          {field('dinner_time', 'Hora de cena')}
        </div>
        {field('venue_name', 'Nombre del salón')}
        {field('venue_address', 'Dirección')}
      </div>

      <div className="flex flex-col gap-4 border-t border-silver/10 pt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-silver/50">Dress code</p>
        {field('dress_code_title', 'Título dress code')}
        {field('dress_code_description', 'Descripción dress code', 'textarea')}
      </div>

      <div className="flex flex-col gap-4 border-t border-silver/10 pt-5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-silver/50">
            <GiftIcon className="h-4 w-4 text-moon" />
            Mesa de regalos / lista de deseos
          </p>
          <button
            type="button"
            onClick={() => setGiftLinks((links) => [...links, { label: '', url: '' }])}
            className="text-xs font-medium text-moon hover:underline"
          >
            + Agregar link
          </button>
        </div>
        {giftLinks.length === 0 && (
          <p className="text-sm text-silver/40">
            Pendiente — agrega aquí los links de Amazon, Liverpool, etc. cuando los tengas listos.
          </p>
        )}
        {giftLinks.map((link, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <input
              placeholder="Nombre (ej. Amazon)"
              value={link.label}
              onChange={(e) =>
                setGiftLinks((links) => links.map((l, idx) => (idx === i ? { ...l, label: e.target.value } : l)))
              }
              className="rounded-xl border border-silver/20 bg-white/5 px-3.5 py-2.5 text-foreground outline-none transition focus:border-violet"
            />
            <input
              placeholder="https://..."
              value={link.url}
              onChange={(e) =>
                setGiftLinks((links) => links.map((l, idx) => (idx === i ? { ...l, url: e.target.value } : l)))
              }
              className="rounded-xl border border-silver/20 bg-white/5 px-3.5 py-2.5 text-foreground outline-none transition focus:border-violet"
            />
            <button
              type="button"
              onClick={() => setGiftLinks((links) => links.filter((_, idx) => idx !== i))}
              className="flex items-center justify-center rounded-xl border border-red-400/30 px-3 text-red-300 transition hover:bg-red-500/10"
              aria-label="Eliminar link"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-silver/10 pt-5">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const eventDateIso = form.event_date ? new Date(form.event_date).toISOString() : ''
              await updateEventSettings({ ...form, event_date: eventDateIso, gift_registry_links: giftLinks })
              setSaved(true)
              setTimeout(() => setSaved(false), 2000)
            })
          }
          className="holo-text rounded-xl border border-violet/40 bg-violet/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet/20 disabled:opacity-50"
        >
          {pending ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-300">
            <CheckIcon className="h-4 w-4" />
            Guardado
          </span>
        )}
      </div>
    </div>
  )
}
