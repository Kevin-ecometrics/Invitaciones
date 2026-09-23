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
  const [expanded, setExpanded] = useState(false)

  if (entries.length === 0) return null

  const visible = expanded ? entries : entries.slice(0, VISIBLE_COUNT)
  const remaining = entries.length - VISIBLE_COUNT

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif-display holo-text text-2xl font-semibold sm:text-3xl">
        Muro de invitados
      </h2>
      <div
        className={`flex flex-col gap-3 ${
          expanded ? 'max-h-[28rem] overflow-y-auto pr-1' : ''
        }`}
      >
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
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="self-start text-sm font-medium text-moon hover:underline"
        >
          {expanded ? 'Mostrar menos' : `Mostrar ${remaining} más`}
        </button>
      )}
    </section>
  )
}
