'use client'

import { useEffect, useState } from 'react'

interface Props {
  targetIso: string
}

function getRemaining(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, done: false }
}

export default function Countdown({ targetIso }: Props) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetIso))

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(targetIso)), 1000)
    return () => clearInterval(interval)
  }, [targetIso])

  const units = [
    { label: 'Días', value: remaining.days },
    { label: 'Horas', value: remaining.hours },
    { label: 'Min', value: remaining.minutes },
    { label: 'Seg', value: remaining.seconds },
  ]

  if (remaining.done) {
    return (
      <div className="glass-card inline-flex rounded-2xl px-5 py-4">
        <p className="holo-text text-xl font-semibold tracking-wide">¡Es la noche de la celebración!</p>
      </div>
    )
  }

  return (
    <div className="flex gap-3 sm:gap-5">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="glass-card flex flex-col items-center justify-center rounded-2xl px-3 py-3 sm:px-5 sm:py-4"
        >
          <span className="text-2xl font-bold tabular-nums text-silver sm:text-4xl">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-widest text-silver/70 sm:text-xs">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}
