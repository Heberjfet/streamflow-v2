'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { VideoPlayer } from '@/components/VideoPlayer'

export default function EmbedPage() {
  const params = useParams()
  const [data, setData] = useState<{ manifestUrl: string; thumbnailUrl?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlayback = async () => {
      if (!params.playbackId || typeof params.playbackId !== 'string') return

      try {
        const res = await fetch(`/api/playback/${params.playbackId}`, {
          headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Video not found')
        }

        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Video not found')
      } finally {
        setLoading(false)
      }
    }

    loadPlayback()
  }, [params.playbackId])

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-white/60 text-sm">{error || 'Video not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen bg-black">
      <VideoPlayer
        src={data.manifestUrl}
        poster={data.thumbnailUrl}
      />
    </div>
  )
}