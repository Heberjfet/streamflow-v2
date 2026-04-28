'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
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
        setError(fetchError || 'Video not found or is private')
      } else {
        setPlayback(data)
      }
      setLoading(false)
    }

    loadPlayback()
  }, [params.playbackId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !playback) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-[var(--font-display)] mb-3">Video Not Found</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">{error}</p>
          <Link href="/">
            <Button>Go to StreamFlow</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold font-[var(--font-display)] text-white">
              Stream<span className="text-[var(--color-accent)]">Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {playback.title && (
              <span className="text-sm text-white/60 hidden sm:block truncate max-w-[200px]">
                {playback.title}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="pt-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-2xl">
            <VideoPlayer
              src={playback.manifestUrl}
              poster={playback.thumbnailUrl}
              autoplay
            />
          </div>

          <div className="mt-8">
            <h1 className="text-2xl font-bold font-[var(--font-display)] text-white mb-4">
              {playback.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-white/60">
              {playback.duration && (
                <span>
                  Duration: {Math.floor(playback.duration / 60)}:{String(Math.floor(playback.duration % 60)).padStart(2, '0')}
                </span>
              )}
              <Link href="/" className="hover:text-white transition-colors">
                StreamFlow
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="bg-[var(--color-bg-elevated)] rounded-xl p-6 text-center">
              <h2 className="text-lg font-semibold text-white mb-2">
                Want to host your own videos?
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Create your own StreamFlow instance and get full control.
              </p>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/40">
          Powered by StreamFlow
        </div>
      </footer>
    </div>
  )
}
