'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { VideoPlayer } from '@/components/VideoPlayer'
import type { PlaybackResponse } from '@/lib/api'

export default function WatchPage() {
  const params = useParams()
  const [playback, setPlayback] = useState<PlaybackResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('streamflow_token')
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const loadPlayback = async () => {
      if (!params.playbackId || typeof params.playbackId !== 'string') return

      const { getPlayback } = await import('@/lib/api')
      const { data, error: fetchError } = await getPlayback(params.playbackId)

      if (fetchError || !data) {
        setError(fetchError || 'Video no encontrado o es privado')
      } else {
        setPlayback(data)
      }
      setLoading(false)
    }

    loadPlayback()
  }, [params.playbackId])

  const handleBackNavigation = () => {
    if (isLoggedIn) {
      window.location.href = '/dashboard/videos'
    } else {
      window.location.href = '/'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !playback) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center relative p-6">
        <button
          onClick={handleBackNavigation}
          className="absolute top-8 left-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors z-50 text-white/60 hover:text-white border border-white/10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center bg-[#1c1c1e] border border-white/10 p-10 rounded-[2rem] animate-fade-in max-w-md shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Contenido no disponible</h2>
          <p className="text-white/40 mb-8 text-sm">{error}</p>
          <button onClick={handleBackNavigation} className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/10">
            Regresar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col selection:bg-purple-500/30">
      <main className="flex-1 flex flex-col w-full">

        <div className="relative w-full h-screen bg-black group overflow-hidden">

          {/* Header sin gradiente de fondo para no oscurecer el volumen */}
          <header className="absolute top-0 left-0 w-full z-50 flex items-start justify-between p-6 md:p-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">

            <div className="flex items-center gap-6">
              <button
                onClick={handleBackNavigation}
                className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors shrink-0 border border-white/10 text-white"
              >
                <svg className="w-6 h-6 translate-x-[-1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="pointer-events-auto hidden sm:block">
                <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold block mb-1">
                  Reproduciendo
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-lg line-clamp-1">
                  {playback.title}
                </h1>

                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs font-black tracking-tighter text-white/40 uppercase">
                    Stream<span className="text-purple-500/60">Flow</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Espacio derecho vacío para dejar libre el control de volumen del player */}
            <div className="w-32" />

          </header>

          <VideoPlayer
            src={playback.manifestUrl}
            poster={playback.thumbnailUrl}
            autoplay
          />
        </div>

        {!isLoggedIn && (
          <div className="w-full relative border-t border-white/5 bg-[#050505] py-32 md:py-40">
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">

              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                El control total de tu <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                  catálogo multimedia.
                </span>
              </h2>

              <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl font-medium leading-relaxed">
                Crea tu propia instancia de StreamFlow y obtén independencia tecnológica.
                Infraestructura autohospedada y transcodificación HLS en tiempo real.
              </p>

              <Link
                href="/register"
                className="inline-block bg-white text-black px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.15em] text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                Inicia tu Instancia Hoy
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 bg-[#050505] mt-auto border-t border-white/5">
        <div className="w-full px-4 text-center text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
          Powered by StreamFlow Engine
        </div>
      </footer>
    </div>
  )
}