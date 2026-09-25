'use client'

import { useState } from 'react'
import type { GuestWallEntry } from '@/lib/data'

const VISIBLE_COUNT = 3

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function GuestWall({ entries }: { entries: GuestWallEntry[] }) {
  const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT)

  if (entries.length === 0) return null

  const visible = entries.slice(0, visibleCount)
  const remaining = entries.length - visible.length
  const canCollapse = visibleCount > VISIBLE_COUNT

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif-display holo-text text-2xl font-semibold sm:text-3xl">
        Muro de invitados
      </h2>
      <div className="flex flex-col gap-3">
        {visible.map((entry) => (
          <div key={entry.id} className="glass-card flex gap-3 rounded-2xl p-4 sm:p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet/40 bg-violet/10 text-sm font-semibold text-moon">
              {initials(entry.full_name)}
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-silver">{entry.full_name}</p>
              <p className="text-sm text-silver/80">{entry.message}</p>
            </div>
          </div>
        ))}
      </div>
      {(remaining > 0 || canCollapse) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setVisibleCount((v) => v + VISIBLE_COUNT)}
              className="inline-flex items-center gap-2 rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet/30 transition hover:brightness-110 active:scale-[0.98]"
            >
              Ver más mensajes
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{remaining}</span>
            </button>
          )}
          {canCollapse && (
            <button
              type="button"
              onClick={() => setVisibleCount(VISIBLE_COUNT)}
              className="inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-6 py-3 text-sm font-semibold text-moon transition hover:bg-violet/20 active:scale-[0.98]"
            >
              Ver menos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  )
}