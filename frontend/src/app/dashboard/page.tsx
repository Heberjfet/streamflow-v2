'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-display)]">
            Welcome back, {user?.name || 'Creator'}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage your video content
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? 'Cancel' : 'Upload Video'}
        </Button>
      </div>

      {showUpload && (
        <Card variant="bordered" className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Upload New Video</h2>
            </div>
            <UploadForm onUploadComplete={() => {
              setShowUpload(false)
              fetchAssets()
            }} />
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/20">
          <p className="text-[var(--color-error)]">{error}</p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
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
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Upload your first video to get started
              </p>
              <Button onClick={() => setShowUpload(true)}>
                Upload Video
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset, i) => (
              <div key={asset.id} className={`animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
                <VideoCard asset={asset} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
