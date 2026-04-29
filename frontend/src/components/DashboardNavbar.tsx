'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

interface NavbarProps {
  onMenuClick?: () => void
  user: User | null
  onLogout: () => void
}

export function DashboardNavbar({ onMenuClick, user, onLogout }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    onLogout()
    router.push('/login')
  }

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    editor: 'Editor',
    viewer: 'Espectador'
  }

  const roleColors: Record<string, string> = {
    admin: 'text-cyan-400',
    editor: 'text-purple-400',
    viewer: 'text-orange-400'
  }

  return (
    <nav className="border-b border-white/5 backdrop-blur-md bg-black/20">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-white">{user?.name || 'Usuario'}</span>
                  <span className={`text-xs ${roleColors[user?.role || 'viewer']}`}>{roleLabels[user?.role || 'viewer']}</span>
                </div>
                <svg className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl shadow-black/50 overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-4 border-b border-white/10 bg-zinc-800/50">
                    <p className="text-sm font-bold text-white">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-md font-bold border ${user?.role === 'admin' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' : user?.role === 'editor' ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' : 'border-orange-500/30 text-orange-400 bg-orange-500/5'}`}>
                      {roleLabels[user?.role || 'viewer']}
                    </span>
                  </div>
                  <div className="py-2">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Editar Perfil
                    </button>
                  </div>
                  <div className="py-2 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}