'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled ? 'glass-dark shadow-2xl shadow-purple-900/20' : 'bg-transparent'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group flex items-center gap-3.5">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-lg shadow-purple-500/40" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Stream</span>
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Flow</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/login"
              className={`
                relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                ${isActive('/login')
                  ? 'text-white bg-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }
                before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-purple-500/10 before:to-fuchsia-500/10 before:opacity-0 before:transition-opacity hover:before:opacity-100
              `}
            >
              <span className="relative z-10">Iniciar Sesión</span>
            </Link>
            
            <Link
              href="/register"
              className="
                relative ml-2 px-5 py-2.5 rounded-lg text-sm font-medium
                bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white
                shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]
                transition-all duration-300 active:scale-[0.98]
                overflow-hidden group
              "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                Comenzar Gratis
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-4">
              <span className={`absolute left-0 top-0 w-full h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 top-1/2' : ''}`} style={{ top: mobileOpen ? '50%' : '0', transform: mobileOpen ? 'translateY(-50%) rotate(45deg)' : 'none' }} />
              <span className={`absolute left-0 top-1/2 w-full h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} style={{ transform: 'translateY(-50%)' }} />
              <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 top-1/2' : ''}`} style={{ top: mobileOpen ? '50%' : 'auto', bottom: mobileOpen ? 'auto' : '0', transform: mobileOpen ? 'translateY(-50%) rotate(-45deg)' : 'none' }} />
            </div>
          </button>
        </div>
      </div>

      <div className={`
        md:hidden absolute top-full left-0 right-0 
        bg-gradient-to-b from-black/95 via-black/90 to-black/85
        backdrop-blur-xl border-t border-white/5
        transition-all duration-500 origin-top
        ${mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}
      `}>
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className={`
              block px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300
              ${isActive('/login')
                ? 'text-white bg-white/10'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            Iniciar Sesión
          </Link>
          
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="
              block px-4 py-3.5 rounded-xl text-base font-medium text-center
              bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white
              shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
              transition-all duration-300
            "
          >
            Comenzar Gratis
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-purple-500/10 blur-[100px] rounded-full" />
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-fuchsia-500/10 blur-[100px] rounded-full" />
      </div>
    </nav>
  )
}
