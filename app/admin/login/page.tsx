'use client'

import { useActionState } from 'react'
import { login, type LoginResult } from './actions'
import { StarIcon } from '@/components/Icons'
import Starfield from '@/components/Starfield'

const initialState: LoginResult | null = null

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <form
          action={formAction}
          className="glass-card w-full max-w-sm rounded-3xl p-8 sm:p-10"
        >
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <StarIcon className="h-6 w-6 text-moon" />
            <h1 className="font-serif-display holo-text text-2xl font-semibold">María Esther</h1>
            <p className="text-xs uppercase tracking-widest text-silver/50">Panel de administración</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm text-silver/70">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                required
                autoComplete="username"
                className="rounded-xl border border-silver/20 bg-white/5 px-4 py-2.5 text-foreground outline-none transition focus:border-violet"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm text-silver/70">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="rounded-xl border border-silver/20 bg-white/5 px-4 py-2.5 text-foreground outline-none transition focus:border-violet"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="holo-text mt-2 rounded-xl border border-violet/40 bg-violet/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet/20 disabled:opacity-50"
            >
              {pending ? 'Entrando…' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
