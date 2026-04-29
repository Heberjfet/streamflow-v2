'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { DashboardNavbar } from '@/components/DashboardNavbar'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center relative">
      <div className="noise-overlay" />
      <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin relative z-10" />
    </div>
  )

  if (!isAuthenticated) return null

  return (
    <div className="h-screen bg-[var(--background)] flex flex-col overflow-hidden relative text-[var(--text-primary)]">
      <div className="noise-overlay" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] gradient-radial-primary pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] gradient-radial-secondary pointer-events-none" />

      <div className="relative z-30">
        <DashboardNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <aside
          className={`
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-64' : 'w-0'} 
            relative border-r border-white/[0.03] 
            flex flex-col bg-transparent backdrop-blur-sm
            overflow-hidden
          `}
        >
          {/* Navegación Superior */}
          <div className="p-6 min-w-[256px]">
            <p className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6">
              Navegación
            </p>
            <nav className="space-y-1">
              <SidebarLink href="/dashboard" icon="home" active={pathname === '/dashboard'}>Inicio</SidebarLink>
              <SidebarLink href="/dashboard/videos" icon="video" active={pathname === '/dashboard/videos'}>Videos</SidebarLink>
              <SidebarLink href="/dashboard/catalogs" icon="folder" active={pathname === '/dashboard/catalogs'}>Catálogos</SidebarLink>
            </nav>
          </div>

          {user?.role === 'admin' && (
            <div className="p-6 min-w-[256px]">
              <p className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6">
                Administración
              </p>
              <nav className="space-y-1">
                <SidebarLink href="/dashboard/users" icon="users" active={pathname === '/dashboard/users'}>Usuarios</SidebarLink>
                <SidebarLink href="/dashboard/logs" icon="log" active={pathname === '/dashboard/logs'}>Logs</SidebarLink>
              </nav>
            </div>
          )}

          {/* SECCIÓN INFERIOR: USUARIO Y LOGOUT */}
          <div className="mt-auto p-4 border-t border-white/[0.03] min-w-[256px] bg-white/[0.01]">
            <div className="flex items-center gap-3 px-2 py-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--primary)]/20 to-transparent border border-[var(--primary)]/20 flex items-center justify-center font-bold text-[var(--primary)]">
                {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">{user?.name || 'Administrador'}</span>
                <span className="text-[10px] text-[var(--text-secondary)] truncate opacity-60">{user?.email}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.1em] text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto w-full bg-transparent">
          <div className="h-full p-6 lg:p-8 animate-fade-in relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ href, icon, children, active }: { href: string, icon: string, children: React.ReactNode, active: boolean }) {
  // ... (Tu componente SidebarLink se mantiene igual)
  const getIcon = () => {
    switch (icon) {
      case 'home': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      case 'video': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      case 'folder': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      case 'users': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      case 'log': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      default: return null
    }
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer ${active ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]'}`}
    >
      <svg className={`w-5 h-5 ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {getIcon()}
      </svg>
      <span className={`text-sm font-medium tracking-wide ${active ? 'font-bold' : ''}`}>{children}</span>
      {active && <div className="ml-auto w-1 h-4 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />}
    </Link>
  )
}