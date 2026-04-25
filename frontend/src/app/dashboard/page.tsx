'use client'

import { useEffect, useState } from 'react'
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard'
import { UploadForm } from '@/components/UploadForm'
import { useAssets } from '@/hooks/useAssets'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()
  const { assets, loading, error, fetchAssets } = useAssets()
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8 animate-fade-in-up stagger-1">
        <h1 className="text-4xl font-bold mb-2">
          Bienvenido, <span className="gradient-text">{user?.name || 'Admin'}</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Gestiona el contenido de video, catálogo y configuración general.
        </p>
      </div>

      {/* Grid de Videos */}
      <div className="animate-fade-in-up stagger-3">
        <h2 className="text-xl font-semibold mb-6">Catálogo de Videos</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : assets.length === 0 ? (
          <div className="glass-card rounded-2xl py-16 text-center border border-[var(--border)]">
            <div className="w-20 h-20 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 gradient-radial-primary rounded-full opacity-50" />
              <svg className="w-10 h-10 text-[var(--primary)] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Sin videos aún</h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              El catálogo está vacío. Sube el primer video al sistema para comenzar a poblar tu plataforma.
            </p>
            <button onClick={() => setShowUpload(true)} className="btn-primary">
              Subir mi primer video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <VideoCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}