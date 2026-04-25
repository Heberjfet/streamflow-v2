'use client'

import Link from 'next/link'

interface NavbarProps {
  onMenuClick?: () => void
}

export function DashboardNavbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="border-b border-white/5 backdrop-blur-md bg-black/20">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Toggle Sidebar */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[var(--text-secondary)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">StreamFlow</span>
            </Link>
          </div>

          {/* El lado derecho ahora queda vacío o para notificaciones futuras */}
          <div className="flex items-center gap-4">
            {/* Aquí podrías poner un botón de notificaciones o dejarlo vacío */}
          </div>
        </div>
      </div>
    </nav>
  )
}