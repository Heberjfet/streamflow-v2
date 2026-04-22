'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface NavbarProps {
  onMenuClick?: () => void
}

export function DashboardNavbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <nav className="border-b border-white/5 backdrop-blur-md bg-black/20">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-4">
            {/* Botón para colapsar sidebar */}
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

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-medium opacity-50">Usuario</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{user?.email?.split('@')[0]}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/1 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer group"
            >
              <span>Salir</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}