'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard'
import { UploadForm } from '@/components/UploadForm'
import { useAssets } from '@/hooks/useAssets'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const { assets, loading, error, fetchAssets } = useAssets()
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-50" />

      <nav className="relative z-20 border-b border-[var(--color-border)]/50 backdrop-blur-xl bg-[var(--color-bg-card)]/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/30">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] bg-clip-text text-transparent">
                StreamFlow
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {user?.email}
              </span>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Cerrar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Bienvenido, <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] bg-clip-text text-transparent">{user?.name || 'Creador'}</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Gestiona tu contenido de video
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <Button onClick={() => setShowUpload(!showUpload)} size="lg">
            {showUpload ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Subir Video
              </>
            )}
          </Button>
        </div>

        {showUpload && (
          <Card variant="glass" className="mb-8 border border-[var(--color-border)]/50">
            <CardContent className="pt-6">
              <UploadForm onUploadComplete={() => {
                setShowUpload(false)
                fetchAssets()
              }} />
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 flex items-center gap-3">
            <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[var(--color-error)]">{error}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-6 text-[var(--color-text-primary)]">Tus Videos</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : assets.length === 0 ? (
            <Card variant="bordered" className="py-16">
              <CardContent className="text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">Sin videos aún</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  Sube tu primer video para comenzar
                </p>
                <Button onClick={() => setShowUpload(true)}>
                  Subir Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assets.map((asset) => (
                <VideoCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
