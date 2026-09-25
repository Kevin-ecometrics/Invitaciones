'use client'

import { useState } from 'react'
import BentoGrid from '@/components/BentoGrid'
import { getGalleryPage } from '@/app/actions/gallery'

interface Photo {
  id: string
  url: string
  alt: string
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pageSet = new Set<number>([1, total, current - 1, current, current + 1])
  const pages = [...pageSet].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const p of pages) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

export default function GalleryGrid({ photos, totalPages }: { photos: Photo[]; totalPages: number }) {
  const [firstPage] = useState(photos)
  const [items, setItems] = useState(photos)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const goTo = async (page: number) => {
    if (loading || page < 1 || page > totalPages || page === currentPage) return
    setLoading(true)
    try {
      if (page === 1) {
        setItems(firstPage)
      } else {
        const { photos: next } = await getGalleryPage(page)
        setItems(next)
      }
      setCurrentPage(page)
      document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {
      // keep the current page on error
    } finally {
      setLoading(false)
    }
  }

  const navBase =
    'inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition active:scale-[0.97]'

  return (
    <div className="flex flex-col gap-4">
      <BentoGrid
        items={items}
        emptyText="Aún no hay fotos publicadas. ¡Sé el primero en compartir una!"
      />
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goTo(currentPage - 1)}
            disabled={loading || currentPage === 1}
            className={`${navBase} border border-violet/40 text-moon hover:bg-violet/10 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            ‹
          </button>
          {getPageNumbers(currentPage, totalPages).map((page, i) =>
            page === '…' ? (
              <span key={`e${i}`} className="px-1 text-sm text-silver/50">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => goTo(page)}
                disabled={loading || page === currentPage}
                className={`${navBase} ${
                  page === currentPage
                    ? 'bg-violet text-white shadow-lg shadow-violet/30'
                    : 'border border-violet/40 text-moon hover:bg-violet/10 disabled:cursor-default'
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => goTo(currentPage + 1)}
            disabled={loading || currentPage === totalPages}
            className={`${navBase} border border-violet/40 text-moon hover:bg-violet/10 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            ›
          </button>
        </div>
      )}
      {loading && <p className="text-center text-xs text-silver/60">Cargando...</p>}
    </div>
  )
}