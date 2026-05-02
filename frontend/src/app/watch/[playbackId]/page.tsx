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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !playback) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center relative">
        <Link
          href="/dashboard/videos"
          className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full glass-card hover:bg-white/5 transition-colors z-50"
          aria-label="Volver a videos"
        >
          <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="text-center bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl animate-fade-in max-w-md">
          <p className="text-[var(--text-secondary)] mb-4">{error}</p>
          <Link href="/dashboard/videos" className="btn-secondary inline-block">
            Volver a Videos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">

      <main className="flex-1 flex flex-col w-full">
        <div className="relative w-full h-screen bg-black animate-fade-in-up">
          <header className="absolute top-6 left-6 z-50 flex flex-col items-start gap-3 pointer-events-none">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/videos"
                className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full glass-card hover:bg-white/10 transition-colors shrink-0"
                aria-label="Volver a videos"
              >
                <svg className="w-5 h-5 text-[var(--text-primary)] translate-x-[-1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>

              <div className="pointer-events-auto h-12 px-6 flex items-center justify-center rounded-full glass-card max-w-xs sm:max-w-md">
                <h1 className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {playback.title}
                </h1>
              </div>
            </div>

            <div className="pointer-events-auto px-2">
              <span className="text-xl font-bold font-[var(--font-display)] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Stream<span className="text-[var(--primary)] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">Flow</span>
              </span>
            </div>
          </header>

          <VideoPlayer
            src={playback.manifestUrl}
            poster={playback.thumbnailUrl}
            autoplay
          />
        </div>

        <div className="w-full relative overflow-hidden border-y border-[var(--border)] py-24 sm:py-32">
          <div className="absolute inset-0 gradient-radial-primary opacity-20 pointer-events-none" />
          <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">

            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              ¿Quieres alojar tus <span className="gradient-text">propios videos?</span>
            </h2>

            <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
              Crea tu propia instancia de StreamFlow y obtén el control total de tu catálogo.
              Infraestructura autohospedada, transcodificación HLS y cero límites.
            </p>

            <Link href="/register" className="btn-primary text-base px-8 py-4 uppercase tracking-wider font-bold shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              Iniciar Ahora
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-[var(--background)] mt-auto">
        <div className="w-full px-4 text-center text-sm font-mono text-[var(--text-secondary)]/50 uppercase tracking-widest">
          Powered by StreamFlow
        </div>
      </footer>

    </div>
  )
}