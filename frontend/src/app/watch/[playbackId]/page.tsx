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
        <div className="w-8 h-8 border-2 border-[var(--text-secondary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !playback) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center relative">
        <Link
          href="/"
          className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)] transition-colors"
          aria-label="Volver"
        >
          <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="text-center bg-[var(--surface)] border border-[var(--border)] p-8 animate-fade-in">
          <p className="text-[var(--text-secondary)] mb-4">{error}</p>
          <Link href="/" className="btn-secondary inline-block">
            Ir a StreamFlow
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--border)] transition-colors shrink-0"
            aria-label="Volver al inicio"
          >
            <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="flex-1 text-center overflow-hidden">
            <h1 className="text-lg font-bold text-[var(--text-primary)] truncate px-4">
              {playback.title}
            </h1>
          </div>

          <div className="shrink-0 hidden sm:block">
            <span className="text-lg font-bold font-[var(--font-display)] text-[var(--text-primary)]">
              Stream<span className="text-[var(--primary)]">Flow</span>
            </span>
          </div>

        </div>
      </header>

      <main className="pt-16 flex-1 flex flex-col items-center w-full">
        <div className="w-full animate-fade-in-up">
          <div className="bg-black border border-[var(--border)] w-full aspect-video relative">
            <VideoPlayer
              src={playback.manifestUrl}
              poster={playback.thumbnailUrl}
              autoplay
            />
          </div>
        </div>

        {/* Sección de Promoción Restaurada */}
        <div className="w-full mt-12">
          <div className="bg-[var(--surface)] border border-[var(--border)] p-8 text-center flex flex-col items-center">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              ¿Quieres alojar tus propios videos?
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Crea tu propia instancia de StreamFlow y obtén el control total de tu contenido.
            </p>
            <Link href="/register" className="btn-secondary">
              Comenzar ahora
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Restaurado */}
      <footer className="border-t border-[var(--border)] py-6 bg-[var(--surface)] mt-auto">
        <div className="w-full px-4 text-center text-sm text-[var(--text-secondary)]">
          Powered by StreamFlow
        </div>
      </footer>

    </div>
  )
}