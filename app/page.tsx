import type { Metadata } from 'next'
import Starfield from '@/components/Starfield'
import DressCodeInspiration from '@/components/DressCodeInspiration'
import { MdDinnerDining } from 'react-icons/md'
import {
  CheckIcon,
  ClockIcon,
  GiftIcon,
  MapPinIcon,
  MusicNoteIcon,
  ParkingIcon,
  SparkleIcon,
  StarIcon,
} from '@/components/Icons'
import Countdown from '@/components/Countdown'
import MusicToggle from '@/components/MusicToggle'
import RsvpForm from '@/components/RsvpForm'
import PhotoUploadForm from '@/components/PhotoUploadForm'
import GalleryGrid from '@/components/GalleryGrid'
import GuestWall from '@/components/GuestWall'
import InvitationCard from '@/components/InvitationCard'
import { getEventSettings, getGuestWallMessages, getPublishedGallery, getPublishedGalleryCount } from '@/lib/data'
import { publicStorageUrl } from '@/lib/storage-url'
import { GALLERY_PAGE_SIZE } from '@/lib/gallery-constants'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getEventSettings()
  const title = settings?.event_title || 'María Esther 60s'
  const description =
    settings?.hero_headline ||
    'Acompáñanos a celebrar los 60 años de María Esther, una noche galáctica bajo las estrellas.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

const MAPS_QUERY = encodeURIComponent(
  'Salón de Eventos CAIC, David Alfaro Siqueiros 2601, Zona Río, Tijuana'
)

const MAPS_EMBED_SRC = `https://maps.google.com/maps?q=${MAPS_QUERY}&z=16&output=embed`

export default async function Home() {
  const [settings, photos, photoCount, guestMessages] = await Promise.all([
    getEventSettings(),
    getPublishedGallery(),
    getPublishedGalleryCount(),
    getGuestWallMessages(),
  ])

  const eventDateIso = settings?.event_date ?? '2026-10-24T20:00:00-07:00'
  const musicUrl = settings?.music_storage_path
    ? publicStorageUrl('music', settings.music_storage_path)
    : null
  const giftRegistryLinks = settings?.gift_registry_links ?? []

  const galleryTotalPages = Math.ceil(photoCount / GALLERY_PAGE_SIZE)

  const galleryPhotos = photos.map((p) => ({
    id: p.id,
    url: publicStorageUrl('gallery', p.storage_path),
    alt: p.alt_text || 'Foto de la celebración',
  }))

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <MusicToggle src={musicUrl} />
      <a
        href="#rsvp"
        className="glass-card fixed bottom-5 left-5 z-20 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-moon shadow-lg transition hover:scale-105 lg:hidden"
      >
        <CheckIcon className="h-4 w-4" />
        RSVP
      </a>

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center px-5 pt-8 sm:px-10">
        <span className="font-serif-display holo-text flex items-center gap-2 text-lg font-semibold tracking-wide">
          <StarIcon className="h-4 w-4" />
          María Esther
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
          {/* Left column */}
          <div className="flex flex-col gap-14">
            {/* Hero */}
            <section className="flex flex-col gap-4">
              <h1 className="font-serif-display holo-text text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                María Esther
              </h1>
              <p className="font-serif-display text-2xl text-moon sm:text-3xl">
                60 años entre las estrellas
              </p>
              <p className="max-w-lg text-silver/80">
                {settings?.hero_headline || 'Celebremos juntos bajo las estrellas'}
              </p>
              <p className="text-sm uppercase tracking-widest text-silver/60">
                Sábado 24 de octubre · Tijuana, B.C.
              </p>
              <div className="mt-2">
                <Countdown targetIso={eventDateIso} />
              </div>
            </section>

            {/* Right column content on mobile only (shows invitation + RSVP before details) */}
            <div id="rsvp" className="flex scroll-mt-20 flex-col gap-6 lg:hidden">
              <InvitationCard />
              <RsvpForm />
            </div>

            {/* Location */}
            <section className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2 font-serif-display text-xl font-semibold text-silver">
                <MapPinIcon className="h-5 w-5 text-moon" />
                {settings?.venue_name || 'Salón de Eventos CAIC'}
              </h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-silver/70 underline decoration-silver/30 underline-offset-4 hover:text-moon"
              >
                {settings?.venue_address || 'David Alfaro Siqueiros 2601, Zona Río, Tijuana'}
              </a>
              <div className="map-frame relative overflow-hidden rounded-2xl">
                <div className="map-dark h-64 w-full sm:h-72">
                  <iframe
                    title="Ubicación del evento en Google Maps"
                    src={MAPS_EMBED_SRC}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="map-vignette pointer-events-none absolute inset-0" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-silver/15" />
                <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 backdrop-blur">
                  <MapPinIcon className="h-3.5 w-3.5 text-moon" />
                  <span className="text-xs font-medium text-white">
                    {settings?.venue_name || 'Salón de Eventos CAIC'}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:border-violet/50 hover:text-moon"
                >
                  <MapPinIcon className="h-3.5 w-3.5" />
                  Abrir en Google Maps
                </a>
              </div>
            </section>

            {/* Detail rows */}
            <section className="flex flex-col gap-4">
              <h2 className="flex items-center gap-2 font-serif-display text-xl font-semibold text-silver">
                <ClockIcon className="h-5 w-5 text-moon" />
                Detalles del evento
              </h2>
              <div className="flex flex-col divide-y divide-silver/10 overflow-hidden rounded-2xl border border-silver/10">
              <div className="flex items-center gap-3 px-5 py-4">
                <ClockIcon className="h-5 w-5 shrink-0 text-moon" />
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-silver/50">Bienvenida</span>
                  <span className="text-sm text-silver/90">{settings?.welcome_time || '8:00 PM'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <MdDinnerDining className="h-5 w-5 shrink-0 text-moon" />
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-silver/50">Cena</span>
                  <span className="text-sm text-silver/90">{settings?.dinner_time || '9:00 PM'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <ParkingIcon className="h-5 w-5 shrink-0 text-moon" />
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-silver/50">Estacionamiento</span>
                  <span className="text-sm text-silver/90">Disponible en el salón</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <SparkleIcon className="h-5 w-5 shrink-0 text-moon" />
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-silver/50">Dress code</span>
                  <span className="text-sm font-medium text-silver/90">
                    {settings?.dress_code_title || 'Disfraz Galáctico'}
                  </span>
                  <span className="text-sm text-silver/70">
                    {settings?.dress_code_description ||
                      'Ven vestido con tu mejor atuendo inspirado en el cosmos: brillos, plata, holográfico y color del espacio profundo.'}
                  </span>
                </div>
              </div>
              {musicUrl && (
                <div className="flex items-center gap-3 px-5 py-4">
                  <MusicNoteIcon className="h-5 w-5 shrink-0 text-moon" />
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-silver/50">Música</span>
                    <span className="text-sm text-silver/90">
                      Usa el botón flotante para reproducir la música de la noche
                    </span>
                  </div>
                </div>
              )}
              {giftRegistryLinks.length > 0 && (
                <div className="flex items-center gap-3 px-5 py-4">
                  <GiftIcon className="h-5 w-5 shrink-0 text-moon" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wide text-silver/50">Mesa de regalos</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {giftRegistryLinks.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-silver/90 underline decoration-silver/30 underline-offset-4 hover:text-moon"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 px-5 py-4">
                <GiftIcon className="h-5 w-5 shrink-0 text-moon" />
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-silver/50">Regalos</span>
                  <span className="text-sm text-silver/90">
                    Un regalo o un sobre para la cumpleañera.
                  </span>
                </div>
              </div>
              </div>
            </section>

            {/* Dress code reference gallery */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif-display holo-text text-2xl font-semibold sm:text-3xl">
                  Inspiración para tu disfraz galáctico
                </h2>
                <p className="text-sm text-silver/60">Brilla, atrévete y viaja a otra galaxia.</p>
              </div>
              <DressCodeInspiration />
            </section>

            {/* Guest wall */}
            <GuestWall entries={guestMessages} />

            {/* Photo upload */}
            <section className="flex flex-col gap-4">
              <h2 className="font-serif-display holo-text text-2xl font-semibold sm:text-3xl">
                Comparte tus fotos
              </h2>
              <PhotoUploadForm />
            </section>

            {/* Gallery */}
            <section id="galeria" className="flex scroll-mt-20 flex-col gap-4">
              <h2 className="font-serif-display holo-text text-2xl font-semibold sm:text-3xl">
                Galería
              </h2>
              <GalleryGrid photos={galleryPhotos} totalPages={galleryTotalPages} />
            </section>
          </div>

          {/* Right column — sticky on desktop */}
          <div className="hidden flex-col gap-6 lg:sticky lg:top-10 lg:flex">
            <InvitationCard />
            <RsvpForm />
          </div>
        </div>
      </main>
    </div>
  )
}
