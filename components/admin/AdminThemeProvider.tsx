'use client'

import { createContext, useContext, useReducer, useSyncExternalStore, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'admin-theme'

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  return () => window.removeEventListener('storage', onStoreChange)
}

function getSnapshot(): Theme {
  return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
  return 'light'
}

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null)

export function useAdminTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useAdminTheme must be used within AdminThemeProvider')
  return ctx
}

export default function AdminThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  const toggle = () => {
    localStorage.setItem(STORAGE_KEY, getSnapshot() === 'dark' ? 'light' : 'dark')
    forceUpdate()
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={`${
          theme === 'dark' ? 'admin-theme-dark' : 'admin-theme'
        } min-h-screen bg-background text-foreground`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}