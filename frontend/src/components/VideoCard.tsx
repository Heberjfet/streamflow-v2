'use client'

import Link from 'next/link'
import type { Asset } from '@/lib/api'

interface VideoCardProps {
  asset: Asset
  showStatus?: boolean
}

const statusConfig = {
  pending: { label: 'Pending', color: 'text-[var(--color-text-muted)]' },
  uploading: { label: 'Uploading', color: 'text-[var(--color-warning)]' },
  processing: { label: 'Processing', color: 'text-[var(--color-accent)]' },
  ready: { label: 'Ready', color: 'text-[var(--color-success)]' },
  completed: { label: 'Completed', color: 'text-[var(--color-success)]' },
  failed: { label: 'Failed', color: 'text-[var(--color-error)]' },
  created: { label: 'Created', color: 'text-[var(--color-text-muted)]' },
}

const defaultStatus = { label: 'Unknown', color: 'text-[var(--color-text-muted)]' }

const formatDuration = (seconds?: number): string => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function VideoCard({ asset, showStatus = true }: VideoCardProps) {
  const status = statusConfig[asset.status as keyof typeof statusConfig]
  const safeStatus = status || defaultStatus

  return (
    <Link href={`/dashboard/video/${asset.id}`} className="block">
      <article className="group relative bg-[var(--color-bg-card)] rounded-xl overflow-hidden border border-[var(--color-border-subtle)] transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:shadow-lg hover:shadow-[var(--color-accent)]/10">
        <div className="relative aspect-video bg-[var(--color-bg-elevated)] overflow-hidden">
          {asset.thumbnailKey ? (
            <img
              src={`http://localhost:9000/streamflow/${asset.thumbnailKey}`}
              alt={asset.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-[var(--color-text-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {asset.duration && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-xs text-white font-medium">
              {formatDuration(asset.duration)}
            </div>
          )}

          {showStatus && asset.status !== 'ready' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                {asset.status === 'processing' && (
                  <>
                    <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[var(--color-text-secondary)]">Processing...</span>
                  </>
                )}
                {asset.status === 'uploading' && (
                  <>
                    <div className="w-8 h-8 border-2 border-[var(--color-warning)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-[var(--color-text-secondary)]">Uploading...</span>
                  </>
                )}
                {asset.status === 'failed' && (
                  <>
                    <svg
                      className="w-8 h-8 text-[var(--color-error)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="text-sm text-[var(--color-error)]">Failed</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <h3 className="font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent)] transition-colors">
            {asset.title}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-muted)]">
              {formatDate(asset.createdAt)}
            </span>
            {showStatus && (
              <span className={`text-xs font-medium ${safeStatus.color}`}>
                {safeStatus.label}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

export function VideoCardSkeleton() {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl overflow-hidden border border-[var(--color-border-subtle)]">
      <div className="aspect-video skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="flex justify-between">
          <div className="h-4 w-24 skeleton rounded" />
          <div className="h-4 w-16 skeleton rounded" />
        </div>
      </div>
    </div>
  )
}
