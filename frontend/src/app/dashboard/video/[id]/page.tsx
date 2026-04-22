'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { VideoPlayer } from '@/components/VideoPlayer'
import { useAssets } from '@/hooks/useAssets'
import type { Asset } from '@/lib/api'

const getS3Url = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:9000`
  }
  return 'http://localhost:9000'
}

const statusConfig = {
  pending: { label: 'Pending', color: 'text-[var(--color-text-muted)]', bg: 'bg-[var(--color-text-muted)]/10' },
  uploading: { label: 'Uploading', color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/10' },
  processing: { label: 'Processing', color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10' },
  ready: { label: 'Ready', color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10' },
  completed: { label: 'Completed', color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10' },
  failed: { label: 'Failed', color: 'text-[var(--color-error)]', bg: 'bg-[var(--color-error)]/10' },
}

const defaultStatus = { label: 'Unknown', color: 'text-[var(--color-text-muted)]', bg: 'bg-[var(--color-text-muted)]/10' }

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getAsset, deleteAsset } = useAssets()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hlsUrl, setHlsUrl] = useState<string | undefined>(undefined)
  const [mp4Url, setMp4Url] = useState<string | undefined>(undefined)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const loadAsset = async () => {
      if (!params.id || typeof params.id !== 'string') return

      const data = await getAsset(params.id)
      if (data) {
        setAsset(data)
        if ((data.status === 'ready' || data.status === 'completed') && data.playbackId) {
          const { getPublicPlayback } = await import('@/lib/api')
          const { data: playbackData, error: playbackError } = await getPublicPlayback(params.id)
          if (playbackData) {
            setHlsUrl(playbackData.manifestUrl)
          } else if (playbackError) {
            setError(playbackError)
          }
        }
      } else {
        setError('Video not found')
      }
      setLoading(false)
    }

    loadAsset()
  }, [params.id, getAsset])

  const handleDelete = async () => {
    if (!asset || !confirm('Are you sure you want to delete this video?')) return

    setDeleting(true)
    const success = await deleteAsset(asset.id)
    if (success) {
      router.push('/dashboard')
    } else {
      setDeleting(false)
      setError('Failed to delete video')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Video not found</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">{error || 'This video does not exist.'}</p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const status = statusConfig[asset.status as keyof typeof statusConfig] || defaultStatus

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-display)]">{asset.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                {status.label}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">
                Created {new Date(asset.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {asset.status === 'ready' && asset.playbackId && (
            <Link href={`/watch/${asset.playbackId}`} target="_blank">
              <Button variant="secondary">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Public Link
              </Button>
            </Link>
          )}
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {hlsUrl ? (
            <VideoPlayer
              src={hlsUrl}
              poster={asset.thumbnailKey ? `${getS3Url()}/streamflow/${asset.thumbnailKey}` : undefined}
            />
          ) : (
            <Card className="aspect-video flex items-center justify-center bg-[var(--color-bg-secondary)]">
              <div className="text-center">
                {asset.status === 'processing' && (
                  <>
                    <div className="w-12 h-12 border-3 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--color-text-secondary)]">Processing video...</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">This may take a few minutes</p>
                  </>
                )}
                {asset.status === 'uploading' && (
                  <>
                    <div className="w-12 h-12 border-3 border-[var(--color-warning)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--color-text-secondary)]">Uploading video...</p>
                  </>
                )}
                {asset.status === 'failed' && (
                  <>
                    <svg className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-[var(--color-error)]">Video processing failed</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Please try uploading again</p>
                  </>
                )}
                {asset.status === 'pending' && (
                  <>
                    <svg className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[var(--color-text-muted)]">Video not yet uploaded</p>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card variant="bordered">
            <CardHeader>
              <h3 className="font-semibold">Video Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Status</p>
                <p className={`font-medium ${status.color}`}>{status.label}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Created</p>
                <p>{new Date(asset.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Updated</p>
                <p>{new Date(asset.updatedAt).toLocaleString()}</p>
              </div>
              {asset.duration && (
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Duration</p>
                  <p>{Math.floor(asset.duration / 60)}:{String(Math.floor(asset.duration % 60)).padStart(2, '0')}</p>
                </div>
              )}
              {asset.playbackId && (
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Playback ID</p>
                  <p className="font-mono text-sm truncate">{asset.playbackId}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {asset.status === 'ready' && asset.playbackId && (
            <Card variant="bordered">
              <CardHeader>
                <h3 className="font-semibold">Share Video</h3>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/watch/${asset.playbackId}`}
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-sm"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/watch/${asset.playbackId}`)
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
