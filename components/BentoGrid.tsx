'use client'

import { useState } from 'react'
import Image from 'next/image'

export interface BentoItem {
  id: string
  url: string
  alt: string
}

const GROUP_SIZE = 5

// Group of 5: one big square + a 2x2 of small squares, alternating sides
// so the pattern reads "big | 2x2" then "2x2 | big" for the next five, etc.
const LAYOUT_A = '"big big s1 s2" "big big s3 s4"'
const LAYOUT_B = '"s1 s2 big big" "s3 s4 big big"'

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function Tile({
  item,
  area,
  onOpen,
}: {
  item: BentoItem
  area: string
  onOpen: (item: BentoItem) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      style={{ gridArea: area }}
      className="glass-card group relative overflow-hidden rounded-2xl border border-silver/10"
    >
      <Image
        src={item.url}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 50vw, 25vw"
        className="object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
    </button>
  )
}

export default function BentoGrid({ items, emptyText }: { items: BentoItem[]; emptyText?: string }) {
  const [active, setActive] = useState<BentoItem | null>(null)

  if (items.length === 0) {
    return emptyText ? <p className="text-center text-silver/60">{emptyText}</p> : null
  }

  const groups = chunk(items, GROUP_SIZE)

  return (
    <>
      <div className="flex flex-col gap-3">
        {groups.map((group, gi) => {
          if (group.length === 1) {
            // Single leftover photo: one big square.
            return (
              <div key={gi} className="grid grid-cols-4 gap-2 sm:gap-3" style={{ aspectRatio: '2 / 1' }}>
                <Tile item={group[0]} area="1 / 1 / 3 / 3" onOpen={setActive} />
              </div>
            )
          }

          // 2–5 photos: big square + as many small squares as are available,
          // alternating which side the big square sits on per group of 5.
          const layout = gi % 2 === 0 ? LAYOUT_A : LAYOUT_B
          const [big, ...smalls] = group
          const smallAreas = ['s1', 's2', 's3', 's4']

          return (
            <div
              key={gi}
              className="grid gap-2 sm:gap-3"
              style={{
                aspectRatio: '2 / 1',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gridTemplateAreas: layout,
              }}
            >
              <Tile item={big} area="big" onOpen={setActive} />
              {smalls.map((item, i) => (
                <Tile key={item.id} item={item} area={smallAreas[i]} onOpen={setActive} />
              ))}
            </div>
          )
        })}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/85 p-6"
          onClick={() => setActive(null)}
        >
          <div className="relative h-[65vh] w-full max-w-lg">
            <Image src={active.url} alt={active.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <p className="max-w-md text-center text-sm text-silver/70">{active.alt}</p>
        </div>
      )}
    </>
  )
}
