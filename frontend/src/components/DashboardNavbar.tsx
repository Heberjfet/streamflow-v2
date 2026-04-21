'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export function DashboardNavbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b border-[var(--color-border)]/50 backdrop-blur-xl bg-[var(--color-bg-card)]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/30">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] bg-clip-text text-transparent">
              StreamFlow
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-sm text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-text-muted)]">Sesión:</span>
              <span className="ml-2 font-medium text-[var(--color-text-primary)]">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-all duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}