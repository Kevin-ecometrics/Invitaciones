import type { GuestWallEntry } from '@/lib/data'

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function GuestWall({ entries }: { entries: GuestWallEntry[] }) {
  if (entries.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif-display holo-text text-2xl font-semibold sm:text-3xl">
        Muro de invitados
      </h2>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
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
    </section>
  )
}
