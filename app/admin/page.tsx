import { createAdminClient } from '@/lib/supabase/admin'
import type { Rsvp, GalleryPhoto, EventSettings } from '@/lib/types'
import RsvpTable from '@/components/admin/RsvpTable'
import GalleryPanel from '@/components/admin/GalleryPanel'
import SettingsForm from '@/components/admin/SettingsForm'
import { StarIcon, ExternalLinkIcon, LogoutIcon, UsersIcon, ImageIcon, SlidersIcon } from '@/components/Icons'
import { logout } from './actions'

export const dynamic = 'force-dynamic'

async function getData() {
  const supabase = createAdminClient()

  const [{ data: rsvps }, { data: photos }, { data: settings }] = await Promise.all([
    supabase.from('rsvps').select('*').order('created_at', { ascending: false }),
    supabase.from('gallery_photos').select('*').order('created_at', { ascending: false }),
    supabase.from('event_settings').select('*').eq('id', 1).maybeSingle(),
  ])

  return {
    rsvps: (rsvps ?? []) as Rsvp[],
    photos: (photos ?? []) as GalleryPhoto[],
    settings: (settings ?? null) as EventSettings | null,
  }
}

export default async function AdminPage() {
  const { rsvps, photos, settings } = await getData()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_-10%,#241a4d_0%,#0b0720_45%,#05040f_100%)]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-10">
        <header className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-2.5">
            <StarIcon className="h-5 w-5 shrink-0 text-moon" />
            <div className="flex flex-col leading-tight">
              <span className="font-serif-display holo-text text-lg font-semibold">María Esther 60s</span>
              <span className="text-xs uppercase tracking-widest text-silver/50">Panel admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-silver/20 px-3 py-1.5 text-sm text-silver/80 transition hover:border-silver/40 hover:text-foreground"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              Ver sitio público
            </a>
            <form action={logout}>
              <button className="flex items-center gap-1.5 rounded-xl border border-silver/20 px-3 py-1.5 text-sm text-silver/80 transition hover:border-red-400/40 hover:text-red-300">
                <LogoutIcon className="h-4 w-4" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </header>

        <nav className="glass-card sticky top-4 z-10 flex flex-wrap gap-2 rounded-2xl p-2">
          {[
            { href: '#rsvps', label: 'Confirmaciones', icon: UsersIcon },
            { href: '#gallery', label: 'Galería', icon: ImageIcon },
            { href: '#settings', label: 'Configuración', icon: SlidersIcon },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-silver/70 transition hover:bg-white/5 hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>

        <section id="rsvps" className="flex scroll-mt-20 flex-col gap-4">
          <h2 className="flex items-center gap-2 font-serif-display text-xl font-semibold text-silver">
            <UsersIcon className="h-5 w-5 text-moon" />
            Confirmaciones (RSVP)
          </h2>
          <RsvpTable rsvps={rsvps} />
        </section>

        <section id="gallery" className="flex scroll-mt-20 flex-col gap-4">
          <h2 className="flex items-center gap-2 font-serif-display text-xl font-semibold text-silver">
            <ImageIcon className="h-5 w-5 text-moon" />
            Galería — moderación
          </h2>
          <GalleryPanel photos={photos} />
        </section>

        <section id="settings" className="flex scroll-mt-20 flex-col gap-4">
          <h2 className="flex items-center gap-2 font-serif-display text-xl font-semibold text-silver">
            <SlidersIcon className="h-5 w-5 text-moon" />
            Configuración del evento
          </h2>
          <SettingsForm settings={settings} />
        </section>
      </div>
    </div>
  )
}
