'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import {
  approveGalleryPhoto,
  rejectGalleryPhoto,
  publishGalleryPhoto,
  unpublishGalleryPhoto,
  deleteGalleryPhoto,
} from '@/app/admin/actions'
import type { GalleryPhoto } from '@/lib/types'
import { publicStorageUrl } from '@/lib/storage-url'
import { CheckIcon, EyeIcon, EyeOffIcon, SparkleIcon, TrashIcon, XIcon } from '@/components/Icons'

export default function GalleryPanel({ photos }: { photos: GalleryPhoto[] }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const approvedCount = photos.filter((p) => p.status === 'approved' && p.is_published).length
  const pendingPhotos = photos.filter((p) => p.status === 'pending')
  const approvedPhotos = photos.filter((p) => p.status === 'approved')
  const rejectedPhotos = photos.filter((p) => p.status === 'rejected')
  const submitterCount = new Set(photos.map((p) => p.submitter_token).filter(Boolean)).size

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card flex items-center gap-3 rounded-2xl p-4">
        <SparkleIcon className="h-5 w-5 shrink-0 text-moon" />
        <p className="text-sm text-silver/80">
          <strong className="text-foreground">{photos.length}</strong> fotos recibidas de{' '}
          <strong className="text-foreground">{submitterCount}</strong> personas ·{' '}
          <strong className="text-foreground">{approvedCount}</strong> publicadas ahora. Cada invitado puede subir
          hasta 5 fotos; no hay límite de cuántas puedes aprobar o publicar.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <Section title="Pendientes" count={pendingPhotos.length}>
        {pendingPhotos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo}>
            <button
              disabled={pending}
              onClick={() => startTransition(() => { approveGalleryPhoto(photo.id) })}
              className="flex items-center justify-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
            >
              <CheckIcon className="h-3.5 w-3.5" />
              Aprobar
            </button>
            <button
              disabled={pending}
              onClick={() => startTransition(() => { rejectGalleryPhoto(photo.id, '') })}
              className="flex items-center justify-center gap-1 rounded-lg bg-red-500/15 px-2.5 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/25 disabled:opacity-50"
            >
              <XIcon className="h-3.5 w-3.5" />
              Rechazar
            </button>
          </PhotoCard>
        ))}
        {pendingPhotos.length === 0 && <EmptyNote text="Sin fotos pendientes." />}
      </Section>

      <Section title="Aprobadas" count={approvedPhotos.length}>
        {approvedPhotos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} published={photo.is_published}>
            {photo.is_published ? (
              <button
                disabled={pending}
                onClick={() => startTransition(() => { unpublishGalleryPhoto(photo.id) })}
                className="flex items-center justify-center gap-1 rounded-lg border border-silver/20 px-2.5 py-1.5 text-xs text-silver/80 transition hover:border-silver/40 hover:text-foreground disabled:opacity-50"
              >
                <EyeOffIcon className="h-3.5 w-3.5" />
                Ocultar
              </button>
            ) : (
              <button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    setError(null)
                    const res = await publishGalleryPhoto(photo.id)
                    if (res && res.ok === false) setError(res.error ?? 'No se pudo mostrar la foto.')
                  })
                }
                className="flex items-center justify-center gap-1 rounded-lg border border-emerald-400/30 px-2.5 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-500/10 disabled:opacity-50"
              >
                <EyeIcon className="h-3.5 w-3.5" />
                Mostrar
              </button>
            )}
            <button
              disabled={pending}
              onClick={() => startTransition(() => { deleteGalleryPhoto(photo.id, photo.storage_path) })}
              className="flex items-center justify-center gap-1 rounded-lg border border-red-400/30 px-2.5 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Eliminar
            </button>
          </PhotoCard>
        ))}
        {approvedPhotos.length === 0 && <EmptyNote text="Sin fotos aprobadas." />}
      </Section>

      <Section title="Rechazadas" count={rejectedPhotos.length}>
        {rejectedPhotos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo}>
            <button
              disabled={pending}
              onClick={() => startTransition(() => { deleteGalleryPhoto(photo.id, photo.storage_path) })}
              className="col-span-2 flex items-center justify-center gap-1 rounded-lg border border-red-400/30 px-2.5 py-1.5 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Eliminar
            </button>
          </PhotoCard>
        ))}
        {rejectedPhotos.length === 0 && <EmptyNote text="Sin fotos rechazadas." />}
      </Section>
    </div>
  )
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-silver/70">
        {title}
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-silver/50">{count}</span>
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{children}</div>
    </div>
  )
}

function EmptyNote({ text }: { text: string }) {
  return <p className="col-span-full text-sm text-silver/40">{text}</p>
}

function PhotoCard({
  photo,
  published,
  children,
}: {
  photo: GalleryPhoto
  published?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="glass-card flex flex-col gap-2 rounded-xl p-2">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={publicStorageUrl('gallery', photo.storage_path)}
          alt={photo.alt_text || 'Foto'}
          fill
          sizes="200px"
          className="object-cover"
        />
        {published && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-medium text-white shadow">
            En galería
          </span>
        )}
      </div>
      {photo.submitted_by_name && <p className="truncate text-xs text-silver/50">{photo.submitted_by_name}</p>}
      <div className="grid grid-cols-2 gap-1.5">{children}</div>
    </div>
  )
}
