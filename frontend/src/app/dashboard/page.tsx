'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAssets } from '@/hooks/useAssets'
import { getCategories, Category } from '@/lib/api'
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard'

// Helper para arreglar la URL de S3 en desarrollo
const fixS3Url = (url?: string): string | undefined => {
  if (!url) return undefined
  if (typeof window === 'undefined') return url
  const hostname = window.location.hostname
  if (url.includes('localhost:9000') || url.includes('minio:9000')) {
    return url.replace(/localhost:9000|minio:9000/, `${hostname}:9000`)
  }
  return url
}

export default function DashboardHome() {
  const { user } = useAuth()
  const { assets, loading, fetchAssets } = useAssets()
  const [catalogs, setCatalogs] = useState<Category[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchAssets()

    // Obtenemos los catálogos para mostrarlos en el inicio sin tocar backend
    getCategories().then(res => {
      if (res.data) setCatalogs(res.data)
    }).catch(err => console.error("Error fetching catalogs:", err))
  }, [fetchAssets])

  // Segmentación de contenido para las diferentes secciones editoriales
  const heroVideo = assets.length > 0 ? assets[0] : null
  const recentVideos = assets.length > 1 ? assets.slice(1, 5) : []
  const editorialPicks = assets.length > 5 ? assets.slice(5, 7) : [] // Para la sección premium

  const heroThumbUrl = heroVideo?.thumbnailKey ? fixS3Url(`http://localhost:9000/streamflow/${heroVideo.thumbnailKey}`) : null

  if (!mounted) return null

  return (
    <div className="min-h-full pb-20 animate-fade-in bg-[#050505]">

      {loading ? (
        <div className="space-y-10">
          <div className="w-full aspect-video md:aspect-[21/9] bg-white/[0.02] rounded-[2rem] border border-white/5 animate-pulse mt-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <VideoCardSkeleton key={i} />)}
          </div>
        </div>
      ) : (
        <>
          {heroVideo && (
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden mt-6 mb-12 border border-white/5 shadow-2xl group">
              {heroThumbUrl ? (
                <img
                  src={heroThumbUrl}
                  alt={heroVideo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-900/30 to-black flex items-center justify-center">
                  <svg className="w-20 h-20 text-white/10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/20 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 md:p-14 w-full max-w-4xl z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white mb-4">
                  Vídeo Reciente
                </span>

                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight drop-shadow-xl">
                  {heroVideo.title}
                </h2>

                {heroVideo.duration && (
                  <div className="flex items-center gap-3 text-white/70 text-sm font-semibold mb-8 tracking-wide">
                    <span>
                      {Math.floor(heroVideo.duration / 60)}:{String(Math.floor(heroVideo.duration % 60)).padStart(2, '0')} MIN
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    <span className="uppercase text-purple-400">{heroVideo.status}</span>
                  </div>
                )}

                <Link
                  href={`/dashboard/video/${heroVideo.id}`}
                  className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold transition-all hover:bg-white/90 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Reproducir
                </Link>
              </div>
            </div>
          )}

          {/* 2. MENSAJE DE BIENVENIDA NEUTRAL */}
          <div className="mb-14 px-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Hola, {user?.name?.split(' ')[0] || 'Usuario'}
            </h1>
            <p className="text-white/40 text-base font-medium tracking-wide">
              Esto es lo más destacado en tu biblioteca hoy.
            </p>
          </div>

          {/* 3. COLECCIONES (CATÁLOGOS) - Carrusel Horizontal Estilo iOS */}
          {catalogs.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">Explorar Colecciones</h2>
                <Link href="/dashboard/catalogs" className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                  Ver todas
                </Link>
              </div>

              <div className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 snap-x snap-mandatory hide-scrollbar">
                {catalogs.map(catalog => (
                  <Link
                    href={`/dashboard/catalogs?id=${catalog.id}`}
                    key={catalog.id}
                    className="shrink-0 w-72 snap-start group relative bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-1 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-inner">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-white mb-1 group-hover:text-purple-400 transition-colors truncate">
                      {catalog.name}
                    </h3>
                    <p className="text-xs text-white/40 line-clamp-2">
                      {catalog.description || 'Colección de contenido'}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 4. GRID DE VIDEOS RECIENTES */}
          {assets.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-white/5 rounded-[2rem]">
              <div className="w-16 h-16 bg-white/[0.02] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sin videos aún</h3>
              <p className="text-white/40 text-sm max-w-sm mb-6">El catálogo está vacío. Inicia la ingesta de activos para poblar la plataforma.</p>
              <Link href="/dashboard/videos" className="px-6 py-3 bg-white text-black rounded-xl font-bold text-sm transition-all active:scale-95">
                Subir primer video
              </Link>
            </div>
          ) : (
            recentVideos.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Últimos Agregados</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                  {recentVideos.map((asset) => (
                    <VideoCard key={asset.id} asset={asset} />
                  ))}
                </div>
              </div>
            )
          )}

          {/* 5. SECCIÓN EDITORIAL (Selección Exclusiva) */}
          {editorialPicks.length > 0 && (
            <div className="pt-8 border-t border-white/5 px-2">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Selección Exclusiva</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {editorialPicks.map((asset) => {
                  const thumbUrl = asset.thumbnailKey ? fixS3Url(`http://localhost:9000/streamflow/${asset.thumbnailKey}`) : null

                  return (
                    <Link href={`/dashboard/video/${asset.id}`} key={asset.id} className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.01] aspect-[21/9]">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={asset.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />

                      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors truncate">
                          {asset.title}
                        </h3>
                        <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                          StreamFlow Original
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* CSS inline para ocultar la barra de scroll en el carrusel pero permitir el toque/arrastre */}
      <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </div>
  )
}