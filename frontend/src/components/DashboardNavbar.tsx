'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from './ui/Input'

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
  onProfileUpdate?: (name: string, email?: string, password?: string) => void
}

export function DashboardNavbar({ onMenuClick, user, onLogout, onProfileUpdate }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  const [profilePassword, setProfilePassword] = useState('')
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setProfileName(user.name)
      setProfileEmail(user.email)
    }
  }, [user])

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

  const handleEditProfile = () => {
    setIsDropdownOpen(false)
    setIsEditModalOpen(true)
    setProfileName(user?.name || '')
    setProfileEmail(user?.email || '')
    setProfilePassword('')
  }

  const handleSaveProfile = () => {
    if (profileName.trim() && onProfileUpdate) {
      onProfileUpdate(profileName.trim(), profileEmail.trim(), profilePassword || undefined)
    }
    setIsEditModalOpen(false)
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
    <>
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
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-150"
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
                    <div className="py-2 border-t border-white/5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
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

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="glass-card rounded-3xl border border-white/10 p-8 w-full max-w-md">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">
              Editar Perfil
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-all duration-300 ${nameFocused ? 'text-purple-500' : 'text-[var(--text-secondary)]'}`}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  className="w-full bg-zinc-900 border-2 border-white/10 rounded-xl py-3 px-4 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/20 transition-all text-white"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-all duration-300 ${emailFocused ? 'text-purple-500' : 'text-[var(--text-secondary)]'}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full bg-zinc-900 border-2 border-white/10 rounded-xl py-3 px-4 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/20 transition-all text-white"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-all duration-300 ${passwordFocused ? 'text-purple-500' : 'text-[var(--text-secondary)]'}`}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Dejar en blanco para no cambiar"
                  className="w-full bg-zinc-900 border-2 border-white/10 rounded-xl py-3 px-4 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/20 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-6 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-black font-bold rounded-xl transition-all"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}