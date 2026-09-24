'use client'

import { useRef, useState, useTransition } from 'react'
import { submitGalleryPhoto } from '@/app/actions/gallery'
import { CheckIcon, ImageIcon, SparkleIcon, UploadCloudIcon, XIcon } from '@/components/Icons'

const MAX_PHOTOS = 5
const MAX_ORIGINAL_FILE_BYTES = 25 * 1024 * 1024
const COMPRESS_TARGET_BYTES = 970 * 1024
const MAX_DIMENSION = 1920
const MIN_DIMENSION = 1024
const JPEG_QUALITY_START = 0.82
const QUALITY_STEP = 0.15
const QUALITY_FLOOR = 0.5
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/x-heic',
  'image/x-heif',
  'image/heic-sequence',
  'image/heif-sequence',
]
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']
const HEIC_EXTS = ['heic', 'heif']

function formatBytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileExt(f: File) {
  return f.name.split('.').pop()?.toLowerCase() ?? ''
}

function isAllowedType(f: File) {
  return ALLOWED_TYPES.includes(f.type) || ALLOWED_EXTS.includes(fileExt(f))
}

function isHeic(f: File) {
  return (
    ALLOWED_TYPES.includes(f.type) && (f.type.includes('heic') || f.type.includes('heif'))
  ) || HEIC_EXTS.includes(fileExt(f))
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen comprimida.'))),
      'image/jpeg',
      quality
    )
  })
}

async function decodeSource(source: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(source)
    } catch {
      // fall through to <img> decoding
    }
  }
  return await new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(source)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}

async function compressToJpeg(source: Blob): Promise<Blob> {
  const bitmap = await decodeSource(source)

  try {
    const initialScale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    let width = Math.max(1, Math.round(bitmap.width * initialScale))
    let height = Math.max(1, Math.round(bitmap.height * initialScale))

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No se pudo procesar la imagen.')

    let quality = JPEG_QUALITY_START
    let guard = 0

    const render = () => {
      canvas.width = width
      canvas.height = height
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(bitmap, 0, 0, width, height)
    }

    render()
    let blob = await canvasToJpeg(canvas, quality)

    while (blob.size > COMPRESS_TARGET_BYTES && guard < 10) {
      guard++
      if (quality > QUALITY_FLOOR) {
        quality = Math.max(QUALITY_FLOOR, quality - QUALITY_STEP)
      } else if (width > MIN_DIMENSION || height > MIN_DIMENSION) {
        const factor = 0.75
        width = Math.max(MIN_DIMENSION, Math.round(width * factor))
        height = Math.max(MIN_DIMENSION, Math.round(height * factor))
        quality = JPEG_QUALITY_START
        render()
      } else {
        break
      }
      blob = await canvasToJpeg(canvas, quality)
    }

    return blob
  } finally {
    if (typeof ImageBitmap !== 'undefined' && bitmap instanceof ImageBitmap) bitmap.close()
  }
}

async function processFile(f: File) {
  if (!isAllowedType(f)) {
    throw new Error('Formato no soportado. Usa JPG, PNG, WEBP o HEIC.')
  }
  if (f.size > MAX_ORIGINAL_FILE_BYTES) {
    throw new Error('La foto es demasiado grande (máximo 25MB).')
  }

  let source: Blob = f
  if (isHeic(f)) {
    try {
      const heic2any = (await import('heic2any')).default
      const converted = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.92 })
      source = Array.isArray(converted) ? converted[0] : converted
    } catch {
      throw new Error('No se pudo leer la foto en formato HEIC/HEIF. Intenta con JPG o PNG.')
    }
  }

  const jpeg = await compressToJpeg(source)
  const file = new File([jpeg], `gallery_${Date.now()}.jpg`, { type: 'image/jpeg' })
  return { file, previewUrl: URL.createObjectURL(file) }
}

export default function PhotoUploadForm() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [name, setName] = useState('')

  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reachedLimit = uploaded >= MAX_PHOTOS

  function clearFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function pickFile(f: File | null) {
    setError(null)
    if (!f) {
      clearFile()
      return
    }

    setProcessing(true)
    try {
      const processed = await processFile(f)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setFile(processed.file)
      setPreviewUrl(processed.previewUrl)
    } catch (err) {
      clearFile()
      setError(err instanceof Error ? err.message : 'No se pudo procesar la foto.')
    } finally {
      setProcessing(false)
    }
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
      try {
        const result = await submitGalleryPhoto(null, formData)
        if (result.ok) {
          setUploaded((n) => Math.min(n + 1, MAX_PHOTOS))
          clearFile()
          formRef.current?.reset()
        } else {
          setError(result.error ?? 'No se pudo subir la foto.')
        }
      } catch {
        setError('No se pudo subir la foto. Revisa tu conexión e inténtalo de nuevo.')
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
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
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
              <p className="text-xs text-silver/40">
                JPG, PNG, WEBP o HEIC · máx. 25MB · se comprimen a &lt;1MB antes de subir
              </p>
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
            disabled={pending || processing || !file}
            className="flex items-center justify-center gap-2 rounded-xl border border-violet/40 bg-violet/10 px-4 py-2.5 text-sm font-medium text-moon transition hover:bg-violet/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              'Procesando…'
            ) : pending ? (
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