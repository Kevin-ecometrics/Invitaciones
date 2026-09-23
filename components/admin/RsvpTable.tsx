'use client'

import { useState, useTransition } from 'react'
import { approveRsvp, rejectRsvp } from '@/app/admin/actions'
import type { Rsvp } from '@/lib/types'
import { CheckIcon, DownloadIcon, SearchIcon, TicketIcon, XIcon, HourglassIcon } from '@/components/Icons'

function toCsv(rows: Rsvp[]) {
  const header = ['Nombre', 'Teléfono', 'Correo', 'Pases', 'Acompañantes', 'Notas', 'Mensaje']
  const lines = rows.map((r) =>
    [
      r.full_name,
      r.phone ?? '',
      r.email ?? '',
      String(r.party_size),
      (r.companion_names ?? []).join('; '),
      r.dietary_notes ?? '',
      r.message ?? '',
    ]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(',')
  )
  return [header.join(','), ...lines].join('\n')
}

function downloadCsv(rows: Rsvp[]) {
  const csv = toCsv(rows)
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'confirmados.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const FILTERS = [
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'rejected', label: 'Rechazados' },
  { value: 'all', label: 'Todos' },
] as const

const STATUS_STYLES: Record<Rsvp['status'], string> = {
  approved: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30',
  rejected: 'bg-red-500/15 text-red-300 border border-red-400/30',
  pending: 'bg-amber-500/15 text-amber-300 border border-amber-400/30',
}

const STATUS_LABELS: Record<Rsvp['status'], string> = {
  approved: 'Aprobado',
  rejected: 'Rechazado',
  pending: 'Pendiente',
}

export default function RsvpTable({ rsvps }: { rsvps: Rsvp[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['value']>('pending')
  const [search, setSearch] = useState('')
  const [pending, startTransition] = useTransition()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  const approvedRsvps = rsvps.filter((r) => r.status === 'approved')
  const pendingCount = rsvps.filter((r) => r.status === 'pending').length
  const rejectedCount = rsvps.filter((r) => r.status === 'rejected').length
  const totalPasses = approvedRsvps.reduce((sum, r) => sum + (r.attendance === 'yes' ? r.party_size : 0), 0)

  const filtered = rsvps.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search && !r.full_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={CheckIcon} label="Confirmados" value={approvedRsvps.length} tone="text-emerald-300" />
        <Stat icon={TicketIcon} label="Pases totales" value={totalPasses} tone="text-moon" />
        <Stat icon={HourglassIcon} label="Pendientes" value={pendingCount} tone="text-amber-300" />
        <Stat icon={XIcon} label="Rechazados" value={rejectedCount} tone="text-red-300" />
      </div>

      <div className="glass-card flex flex-wrap items-center gap-2 rounded-2xl p-3">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              filter === f.value
                ? 'border border-violet/50 bg-violet/20 text-moon'
                : 'border border-transparent text-silver/60 hover:text-silver'
            }`}
          >
            {f.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver/40" />
            <input
              placeholder="Buscar por nombre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-silver/20 bg-white/5 py-1.5 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-violet"
            />
          </div>
          <button
            onClick={() => downloadCsv(approvedRsvps)}
            className="flex items-center gap-1.5 rounded-xl border border-silver/20 px-3 py-1.5 text-sm text-silver/80 transition hover:border-silver/40 hover:text-foreground"
          >
            <DownloadIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="glass-card rounded-2xl p-6 text-center text-sm text-silver/50">No hay solicitudes.</p>
        )}
        {filtered.map((r) => (
          <div key={r.id} className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{r.full_name}</p>
                <p className="mt-0.5 text-xs text-silver/50">
                  {r.attendance === 'yes' ? `Asiste · ${r.party_size} pase(s)` : 'No asiste'}
                  {r.phone ? ` · ${r.phone}` : ''}
                  {r.email ? ` · ${r.email}` : ''}
                </p>
                {r.companion_names && r.companion_names.length > 0 && (
                  <p className="mt-1 text-xs text-silver/50">Acompañantes: {r.companion_names.join(', ')}</p>
                )}
                {r.dietary_notes && <p className="mt-1 text-xs text-silver/50">Dieta: {r.dietary_notes}</p>}
                {r.message && <p className="mt-2 text-sm italic text-silver/80">&ldquo;{r.message}&rdquo;</p>}
                {r.status === 'rejected' && r.rejection_reason && (
                  <p className="mt-1 text-xs text-red-300">Motivo: {r.rejection_reason}</p>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                {STATUS_LABELS[r.status]}
              </span>
            </div>

            {r.status === 'pending' && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-silver/10 pt-4">
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => { approveRsvp(r.id) })}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4" />
                  Aprobar
                </button>
                {rejectingId === r.id ? (
                  <>
                    <input
                      autoFocus
                      placeholder="Motivo (opcional)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="rounded-xl border border-silver/20 bg-white/5 px-3 py-1.5 text-sm text-foreground outline-none focus:border-violet"
                    />
                    <button
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await rejectRsvp(r.id, reason)
                          setRejectingId(null)
                          setReason('')
                        })
                      }
                      className="rounded-xl bg-red-500/15 px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25"
                    >
                      Confirmar rechazo
                    </button>
                    <button onClick={() => setRejectingId(null)} className="text-sm text-silver/50 hover:text-silver">
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setRejectingId(r.id)}
                    className="flex items-center gap-1.5 rounded-xl border border-silver/20 px-3 py-1.5 text-sm text-silver/80 transition hover:border-red-400/40 hover:text-red-300"
                  >
                    <XIcon className="h-4 w-4" />
                    Rechazar
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: (props: { className?: string }) => React.ReactElement
  label: string
  value: number
  tone: string
}) {
  return (
    <div className="glass-card flex flex-col items-center gap-1.5 rounded-2xl p-4 text-center">
      <Icon className={`h-4 w-4 ${tone}`} />
      <p className="font-serif-display text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs uppercase tracking-wide text-silver/50">{label}</p>
    </div>
  )
}
