'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

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

      <div className="flex flex-1 overflow-hidden relative z-10">

        {isProfileOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
        )}

        <aside
          className={`
            transition-[width] duration-300 ease-in-out flex flex-col
            ${isSidebarOpen ? 'w-64' : 'w-28'} 
            relative border-r border-white/[0.03] bg-[var(--surface)]/30 backdrop-blur-md
            z-50
          `}
        >
          <div className="flex shrink-0 border-b border-white/[0.03] h-14 items-center px-4 overflow-hidden relative">

            <div className="flex items-center w-full min-w-max">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 mr-1 rounded-lg hover:bg-white/10 transition-colors text-[var(--text-secondary)] hover:text-white shrink-0"
                title={isSidebarOpen ? "Contraer menú" : "Expandir menú"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Link href="/dashboard" className="flex items-center gap-2 group shrink-0" title="Ir al inicio">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <span
                  className={`text-lg font-bold tracking-tight whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 overflow-hidden'
                    }`}
                >
                  StreamFlow
                </span>
              </Link>
            </div>
          </div>

          <div className={`pt-6 pb-2 ${isSidebarOpen ? 'px-6' : 'px-3'}`}>
            <p className={`text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
              Navegación
            </p>
            <nav className="space-y-2">
              <SidebarLink href="/dashboard" icon="home" active={pathname === '/dashboard'} isOpen={isSidebarOpen}>Inicio</SidebarLink>
              <SidebarLink href="/dashboard/videos" icon="video" active={pathname === '/dashboard/videos'} isOpen={isSidebarOpen}>Videos</SidebarLink>
              <SidebarLink href="/dashboard/catalogs" icon="folder" active={pathname === '/dashboard/catalogs'} isOpen={isSidebarOpen}>Catálogos</SidebarLink>
            </nav>
          </div>

          {user?.role === 'admin' && (
            <div className={`pt-4 pb-2 ${isSidebarOpen ? 'px-6' : 'px-3'}`}>
              <p className={`text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                Administración
              </p>
              <nav className="space-y-2">
                <SidebarLink href="/dashboard/users" icon="users" active={pathname === '/dashboard/users'} isOpen={isSidebarOpen}>Usuarios</SidebarLink>
                <SidebarLink href="/dashboard/logs" icon="log" active={pathname === '/dashboard/logs'} isOpen={isSidebarOpen}>Logs</SidebarLink>
              </nav>
            </div>
          )}

          <div className={`mt-auto p-4 border-t border-white/[0.03] bg-white/[0.01] flex flex-col ${isSidebarOpen ? 'items-stretch' : 'items-center'}`}>

            <div
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center ${isSidebarOpen ? 'justify-between px-2' : 'justify-center'} py-3 mb-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors group relative`}
              title="Ver Perfil"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-[var(--primary)]/30 to-transparent border border-[var(--primary)]/30 flex items-center justify-center font-bold text-[var(--primary)] overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'A'
                  )}
                </div>

                {isSidebarOpen && (
                  <span className="text-sm font-bold truncate max-w-[100px]">{user?.name || 'Admin'}</span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`flex items-center ${isSidebarOpen ? 'justify-start px-4 gap-3' : 'justify-center'} py-3 rounded-xl text-xs font-bold uppercase tracking-[0.1em] text-red-400 hover:bg-red-500/10 transition-colors w-full`}
              title="Cerrar Sesión"
            >
              <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isSidebarOpen && <span>Cerrar Sesión</span>}
            </button>
          </div>

          {isProfileOpen && (
            <div
              className={`fixed bottom-6 ${isSidebarOpen ? 'left-64 ml-4' : 'left-24 ml-4'} w-72 bg-black p-5 rounded-2xl border-b border-[var(--primary)]/30 z-50`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[var(--text-primary)] text-lg truncate pr-2">{user?.name}</h4>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-4 pb-4 border-b border-white/[0.08] break-all">
                {user?.email}
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Rol de Acceso</span>
                  <span className={`font-mono px-2 py-0.5 rounded-md text-xs  ${user?.role === 'admin' ? 'bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/30' : 'bg-white/5 text-[var(--text-secondary)] border-white/10'} capitalize`}>
                    {user?.role || 'Viewer'}
                  </span>
                </div>
              </div>
            </div>
          )}
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

function SidebarLink({ href, icon, children, active, isOpen }: { href: string, icon: string, children: React.ReactNode, active: boolean, isOpen: boolean }) {
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
      title={isOpen ? '' : children?.toString()}
      className={`
        relative flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center px-0'} 
        py-3 rounded-xl transition-colors cursor-pointer 
        ${active ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}
      `}
    >
      <svg className={`w-8 h-8 shrink-0 ${active ? 'opacity-100' : 'opacity-60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {getIcon()}
      </svg>

      {isOpen && (
        <span className={`text-sm font-medium tracking-wide ml-3 ${active ? 'font-bold' : ''} truncate`}>
          {children}
        </span>
      )}

      {active && isOpen && <div className="absolute right-3 w-1 h-4 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />}
      {active && !isOpen && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />}
    </Link>
  )
}

