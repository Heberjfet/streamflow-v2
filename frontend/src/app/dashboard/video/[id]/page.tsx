'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { VideoPlayer } from '@/components/VideoPlayer'
import { ShareDropdown } from '@/components/ShareDropdown'
import { useAssets } from '@/hooks/useAssets'
import type { Asset } from '@/lib/api'

import { getS3Url } from '@/lib/s3'

const statusConfig = {
  pending: { label: 'Pendiente', color: 'text-white/60', bg: 'bg-white/5' },
  uploading: { label: 'Subiendo', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  processing: { label: 'Procesando', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ready: { label: 'Publicado', color: 'text-green-400', bg: 'bg-green-400/10' },
  completed: { label: 'Completado', color: 'text-green-400', bg: 'bg-green-400/10' },
  failed: { label: 'Error', color: 'text-red-400', bg: 'bg-red-400/10' },
}
const defaultStatus = { label: 'Desconocido', color: 'text-white/60', bg: 'bg-white/5' }

export default function VideoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getAsset } = useAssets()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hlsUrl, setHlsUrl] = useState<string | undefined>(undefined)
  const [allowDownload, setAllowDownload] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
            setAllowDownload(playbackData.allowDownload ?? false)
          } else if (playbackError) {
            setError(playbackError)
          }
        }
      } else {
        setError('Video no encontrado en la base de datos.')
      }
      setLoading(false)
    }

    loadAsset()
  }, [params.id, getAsset])

  const handleDelete = async () => {
    if (!asset) return
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!asset) return
    setDeleting(true)
    setShowDeleteModal(false)
    try {
      const { deleteAsset } = await import('@/lib/api')
      const { error: deleteError } = await deleteAsset(asset.id)
      if (deleteError) throw new Error(deleteError)

      router.push('/dashboard/videos')

    } catch (err) {
      console.error(err)
      setDeleting(false)
      setError('Fallo al eliminar el video de los servidores.')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="glass-card border border-red-500/20 max-w-xl mx-auto mt-20 p-8 text-center rounded-2xl animate-fade-in">
        <p className="text-[var(--text-secondary)] mb-6 text-sm">{error || 'El ID proporcionado no coincide con ningún activo.'}</p>
        <Link href="/dashboard/videos" className="btn-secondary px-6 py-2 text-sm rounded-xl">Volver a Videos</Link>
      </div>
    )
  }

  const status = statusConfig[asset.status as keyof typeof statusConfig] || defaultStatus

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-fade-in pb-8">

      <Link href="/dashboard/videos" className="text-[var(--text-secondary)] hover:text-white flex items-center gap-2 text-sm font-medium transition-colors w-fit mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Volver a Videos
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-2 mb-5">

        <div className="flex-1 w-full relative">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3">{asset.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${status.color} ${status.bg}`}>
              {status.label}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              Subido el {new Date(asset.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">ID:</span>
            <span className="text-sm text-[var(--text-primary)] break-all">{asset.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-4 md:mt-0 glass-card p-2 rounded-2xl border border-white/5 bg-black/20">

          {asset.status === 'ready' && asset.playbackId && (
            <>
              <button
                onClick={() => {
                  const embedCode = `<iframe src="${window.location.origin}/embed/${asset.playbackId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`
                  navigator.clipboard.writeText(embedCode)
                  setCopiedEmbed(true)
                  setTimeout(() => setCopiedEmbed(false), 2000)
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 hover:text-[var(--primary)] transition-colors"
                title="Copiar Embed"
              >
                {copiedEmbed ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                )}
              </button>

              <ShareDropdown playbackId={asset.playbackId} />

              {allowDownload && (
                <button
                  onClick={() => window.open(`/api/playback/${asset.playbackId}/download?quality=original`, '_self')}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 hover:text-[var(--primary)] transition-colors"
                  title="Descargar Original"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              )}

              <Link
                href={`/watch/${asset.playbackId}`}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
                title="Reproducir"
              >
                <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </Link>
            </>
          )}

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Eliminar Video"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      <div className="w-full">
        <div className="bg-black border border-white/5 relative overflow-hidden shadow-xl rounded-2xl">
          {hlsUrl ? (
            <div className="aspect-video w-full flex justify-center items-center">
              <div className="w-full h-full">
                <VideoPlayer
                  src={hlsUrl}
                  poster={asset.thumbnailKey ? getS3Url(asset.thumbnailKey) : undefined}
                />
              </div>
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-black/60 relative overflow-hidden">
              <div className="text-center relative z-10">
                {asset.status === 'processing' && (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin mb-3" />
                    <p className="text-blue-400 font-medium text-sm">Procesando video...</p>
                  </div>
                )}
                {asset.status === 'uploading' && (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin mb-3" />
                    <p className="text-yellow-400 font-medium text-sm">Subiendo archivo...</p>
                  </div>
                )}
                {asset.status === 'failed' && (
                  <div className="flex flex-col items-center text-red-500">
                    <svg className="w-10 h-10 mb-2 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="font-medium text-sm">Ocurrió un error con este video</p>
                  </div>
                )}
                {asset.status === 'pending' && (
                  <div className="flex flex-col items-center text-white/40">
                    <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    <p className="font-medium text-sm">Esperando carga...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)} />
          <div className="relative glass-card border border-white/10 w-full max-w-md rounded-[2rem] overflow-hidden animate-slide-in shadow-2xl">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Eliminar Video</h3>
              <p className="text-white/60 text-sm mb-8">
                ¿Estás seguro de que deseas eliminar <span className="text-white font-medium">"{asset?.title}"</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}