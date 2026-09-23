'use client'

import { useRef, useState, useTransition } from 'react'
import { submitGalleryPhoto } from '@/app/actions/gallery'
import { CheckIcon, ImageIcon, SparkleIcon, UploadCloudIcon, XIcon } from '@/components/Icons'

const MAX_PHOTOS = 5
const MAX_FILE_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

function formatBytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PhotoUploadForm() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [name, setName] = useState('')

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reachedLimit = uploaded >= MAX_PHOTOS

  function pickFile(f: File | null) {
    setError(null)
    if (!f) {
      setFile(null)
      setPreviewUrl(null)
      return
    }
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Formato no soportado. Usa JPG, PNG, WEBP o HEIC.')
      return
    }
    if (f.size > MAX_FILE_BYTES) {
      setError('La foto es demasiado grande (máximo 8MB).')
      return
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  function clearFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) pickFile(dropped)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) {
      setError('Selecciona una foto para subir.')
      return
    }
    const formData = new FormData()
    formData.set('photo', file)
    formData.set('submitted_by_name', name)

    setError(null)
    startTransition(async () => {
      const result = await submitGalleryPhoto(null, formData)
      if (result.ok) {
        setUploaded((n) => Math.min(n + 1, MAX_PHOTOS))
        clearFile()
        formRef.current?.reset()
      } else {
        setError(result.error ?? 'No se pudo subir la foto.')
      }
    })
  }

  return (
    <div className="glass-card flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-silver/80">
          Comparte hasta {MAX_PHOTOS} fotos para la galería (quedan en revisión antes de publicarse).
        </p>
        <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
          {Array.from({ length: MAX_PHOTOS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-4 rounded-full transition-colors ${
                i < uploaded ? 'bg-violet' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {uploaded > 0 && (
        <p className="flex items-center gap-2 text-sm text-emerald-300">
          <SparkleIcon className="h-4 w-4" />
          {uploaded} de {MAX_PHOTOS} fotos enviadas
        </p>
      )}

      {reachedLimit ? (
        <p className="text-sm text-silver/60">Ya enviaste tus {MAX_PHOTOS} fotos. ¡Gracias por compartir!</p>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="sr-only"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />

          {previewUrl ? (
            <div className="glass-card relative flex items-center gap-3 rounded-xl p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Vista previa" className="h-full w-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm text-foreground">{file?.name}</span>
                <span className="text-xs text-silver/50">{file && formatBytes(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={clearFile}
                aria-label="Quitar foto"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-silver/20 text-silver/70 transition hover:border-red-400/40 hover:text-red-300"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
              }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                dragOver ? 'border-violet bg-violet/10' : 'border-silver/20 hover:border-silver/40'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet/15 text-moon">
                {dragOver ? <ImageIcon className="h-5 w-5" /> : <UploadCloudIcon className="h-5 w-5" />}
              </div>
              <p className="text-sm text-silver/80">
                <span className="font-medium text-moon">Toca para elegir</span> o arrastra tu foto aquí
              </p>
              <p className="text-xs text-silver/40">JPG, PNG, WEBP o HEIC · máx. 8MB</p>
            </div>
          )}

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            maxLength={120}
            className="rounded-xl border border-silver/20 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-violet"
          />

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={pending || !file}
            className="flex items-center justify-center gap-2 rounded-xl border border-violet/40 bg-violet/10 px-4 py-2.5 text-sm font-medium text-moon transition hover:bg-violet/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              'Subiendo…'
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Subir foto
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
