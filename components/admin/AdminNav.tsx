'use client'

import { UsersIcon, ImageIcon, SlidersIcon, SunIcon, MoonIcon } from '@/components/Icons'
import { useAdminTheme } from './AdminThemeProvider'

const ITEMS = [
  { href: '#rsvps', label: 'Confirmaciones', icon: UsersIcon },
  { href: '#gallery', label: 'Galería', icon: ImageIcon },
  { href: '#settings', label: 'Configuración', icon: SlidersIcon },
]

export default function AdminNav() {
  const { theme, toggle } = useAdminTheme()

  return (
    <nav className="glass-card sticky top-4 z-10 flex flex-wrap items-center gap-2 rounded-2xl p-2">
      {ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-silver/70 transition hover:bg-silver/10 hover:text-foreground"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </a>
      ))}
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className="ml-auto flex items-center gap-1.5 rounded-xl border border-silver/30 px-3 py-1.5 text-sm text-silver/70 transition hover:border-silver/60 hover:text-foreground"
      >
        {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
        <span className="hidden sm:inline">{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
      </button>
    </nav>
  )
}