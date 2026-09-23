'use client'

import { useActionState, useState } from 'react'
import { createRsvp, type CreateRsvpResult } from '@/app/actions/rsvp'
import { CheckIcon, XIcon } from '@/components/Icons'

const initialState: CreateRsvpResult | null = null

export default function RsvpForm() {
  const [state, formAction, pending] = useActionState(createRsvp, initialState)
  const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('')
  const [companions, setCompanions] = useState<string[]>([])

  if (state?.ok) {
    return (
      <div className="glass-card rounded-3xl p-6 text-center sm:p-8">
        <p className="font-serif-display holo-text text-2xl font-semibold">¡Gracias por confirmar!</p>
        <p className="mt-3 text-sm text-silver/80">
          Tu solicitud fue enviada. En breve la revisaremos y confirmaremos tu lugar bajo las estrellas.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="glass-card flex flex-col gap-5 rounded-3xl p-6 sm:p-8">
      <p className="text-center text-sm text-silver/70">¿Nos acompañas?</p>

      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { value: 'yes', label: 'Asistiré', Icon: CheckIcon },
            { value: 'no', label: 'No podré', Icon: XIcon },
          ] as const
        ).map((opt) => (
          <label
            key={opt.value}
            className={`glass-card flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl py-5 text-center transition ${
              attendance === opt.value
                ? 'border-violet bg-violet/15 text-moon'
                : 'text-silver/80 hover:border-silver/40'
            }`}
          >
            <input
              type="radio"
              name="attendance"
              value={opt.value}
              required
              className="sr-only"
              onChange={() => setAttendance(opt.value)}
            />
            <opt.Icon className="h-5 w-5" />
            <span className="text-sm font-semibold">{opt.label}</span>
          </label>
        ))}
      </div>

      {attendance !== '' && (
        <div className="flex flex-col gap-5 border-t border-silver/15 pt-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="full_name" className="text-sm text-silver/80">
              Nombre completo *
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              maxLength={120}
              className="rounded-xl border border-silver/20 bg-white/5 px-4 py-2.5 text-foreground outline-none transition focus:border-violet"
            />
          </div>

          {attendance === 'yes' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="party_size" className="text-sm text-silver/80">
                  Número de personas (incluyéndote)
                </label>
                <input
                  id="party_size"
                  name="party_size"
                  type="number"
                  min={1}
                  max={15}
                  defaultValue={1}
                  onChange={(e) => {
                    const n = Math.max(0, (parseInt(e.target.value, 10) || 1) - 1)
                    setCompanions((prev) => {
                      const next = [...prev]
                      next.length = n
                      return next.fill('', prev.length)
                    })
                  }}
                  className="rounded-xl border border-silver/20 bg-white/5 px-4 py-2.5 text-foreground outline-none transition focus:border-violet"
                />
              </div>

              {companions.map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <label htmlFor={`companion_${i}`} className="text-sm text-silver/80">
                    Nombre acompañante {i + 1}
                  </label>
                  <input
                    id={`companion_${i}`}
                    name="companion_names"
                    maxLength={120}
                    className="rounded-xl border border-silver/20 bg-white/5 px-4 py-2.5 text-foreground outline-none transition focus:border-violet"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="dietary_notes" className="text-sm text-silver/80">
                  Restricciones alimenticias
                </label>
                <input
                  id="dietary_notes"
                  name="dietary_notes"
                  maxLength={500}
                  className="rounded-xl border border-silver/20 bg-white/5 px-4 py-2.5 text-foreground outline-none transition focus:border-violet"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm text-silver/80">
              Mensaje para María Esther
            </label>
            <textarea
              id="message"
              name="message"
              maxLength={1000}
              rows={3}
              className="rounded-xl border border-silver/20 bg-white/5 px-4 py-2.5 text-foreground outline-none transition focus:border-violet"
            />
          </div>

          {state?.error && <p className="text-sm text-red-300">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="holo-text rounded-xl border border-violet/40 bg-violet/10 px-6 py-3 text-base font-semibold transition hover:bg-violet/20 disabled:opacity-50"
          >
            {pending ? 'Enviando…' : 'Confirmar asistencia'}
          </button>
        </div>
      )}
    </form>
  )
}
