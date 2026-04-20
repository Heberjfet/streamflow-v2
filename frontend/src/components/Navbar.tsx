'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, loading, user, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[var(--color-border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-[var(--color-accent)] rounded-lg rotate-3 group-hover:rotate-6 transition-transform" />
              <div className="absolute inset-0 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold font-[var(--font-display)] tracking-tight">
              Stream<span className="text-[var(--color-accent)]">Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
              }`}
            >
              Home
            </Link>

            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname.startsWith('/dashboard')
                          ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                      }`}
                    >
                      Dashboard
                    </Link>

                    <div className="ml-2 pl-4 border-l border-[var(--color-border)] flex items-center gap-3">
                      <span className="text-sm text-[var(--color-text-muted)]">
                        {user?.name || user?.email}
                      </span>
                      <button
                        onClick={logout}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 ml-2 pl-4 border-l border-[var(--color-border)]">
                    <Link
                      href="/login"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/login')
                          ? 'text-[var(--color-text-primary)] bg-[var(--color-bg-elevated)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
