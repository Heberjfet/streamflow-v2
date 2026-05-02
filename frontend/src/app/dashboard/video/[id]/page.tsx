'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { VideoPlayer } from '@/components/VideoPlayer'
import { useAssets } from '@/hooks/useAssets'
import type { Asset } from '@/lib/api'

// Utilidad para URLs locales
const fixS3Url = (url: string): string => {
  if (!url) return url
  const hostname = window.location.hostname
  if (url.includes('localhost:9000') || url.includes('minio:9000')) {
    return url.replace(/localhost:9000|minio:9000/, `${hostname}:9000`)
  }
  return url
}

// Configuración de estados con estética "Studio Admin"
const statusConfig = {
  pending: { label: 'PENDIENTE', color: 'text-white/40', border: 'border-white/10', glow: 'bg-white/20' },
  uploading: { label: 'SUBIENDO', color: 'text-yellow-400', border: 'border-yellow-400/20', glow: 'bg-yellow-400' },
  processing: { label: 'PROCESANDO', color: 'text-blue-400', border: 'border-blue-400/20', glow: 'bg-blue-400' },
  ready: { label: 'PUBLICADO', color: 'text-green-400', border: 'border-green-400/30', glow: 'bg-green-500' },
  completed: { label: 'COMPLETADO', color: 'text-green-400', border: 'border-green-400/30', glow: 'bg-green-500' },
  failed: { label: 'ERROR', color: 'text-red-400', border: 'border-red-400/30', glow: 'bg-red-500' },
}
const defaultStatus = { label: 'DESCONOCIDO', color: 'text-white/40', border: 'border-white/10', glow: 'bg-white/20' }

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
    if (!asset || !confirm('ALERTA: ¿Estás seguro de que deseas eliminar permanentemente este activo?')) return

    setDeleting(true)

    try {
      const apiUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:3001` : 'http://localhost:3001'

      const res = await fetch(`${apiUrl}/v1/assets/${asset.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('streamflow_token')}`,
        }
      })

      if (!res.ok) throw new Error('Fallo al eliminar en el servidor')

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
        <div className="w-12 h-12 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
        <p className="text-[var(--primary)] font-mono text-sm tracking-widest uppercase animate-pulse">Inspeccionando Activo...</p>
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="glass-card border border-red-500/20 max-w-2xl mx-auto mt-20 p-12 text-center rounded-3xl animate-fade-in">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Error de Localización</h2>
        <p className="text-[var(--text-secondary)] mb-8 font-mono text-sm">{error || 'El ID proporcionado no coincide con ningún activo.'}</p>
        <Link href="/dashboard/videos" className="btn-secondary px-8 py-3">Volver al Catálogo</Link>
      </div>
    )
  }

  const status = statusConfig[asset.status as keyof typeof statusConfig] || defaultStatus

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in pb-12">

      <div className="flex items-center justify-between w-full">
        <Link href="/dashboard/videos" className="text-[var(--text-secondary)] hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-colors w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Catálogo de vídeos
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Eliminar Activo"
          className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
        >
          {deleting ? (
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/5 pb-6 pt-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded border ${status.border} ${status.color} bg-white/5`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status.glow} shadow-[0_0_8px_currentColor]`} />
              {status.label}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">{asset.title}</h1>
        </div>

        {asset.status === 'ready' && asset.playbackId && (
          <div className="flex gap-3">
            {allowDownload && (
              <button
                onClick={() => window.open(`/api/playback/${asset.playbackId}/download?quality=original`, '_blank')}
                className="btn-secondary py-2.5 px-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Descargar Original
              </button>
            )}
            <Link href={`/watch/${asset.playbackId}`} target="_blank">
              <button className="btn-secondary py-2.5 px-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Probar Player
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="glass-card p-5 rounded-2xl border border-white/5 hover:border-[var(--primary)]/20 transition-colors">
          <dt className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-2">Identificador Único</dt>
          <dd className="font-mono text-sm text-white/80">{asset.id}</dd>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5 hover:border-[var(--primary)]/20 transition-colors">
          <dt className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-2">Creación</dt>
          <dd className="font-mono text-sm text-white/80">{new Date(asset.createdAt).toLocaleDateString()}</dd>
        </div>
      </div>

      <div className="w-full">
        <div className="glass-card p-2 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {hlsUrl ? (
            <div className="rounded-[1.5rem] overflow-hidden bg-black border border-white/10 aspect-video max-h-[100vh] w-full flex justify-center items-center">
              <div className="w-full h-full">
                <VideoPlayer
                  src={hlsUrl}
                  poster={asset.thumbnailKey ? fixS3Url(`http://localhost:9000/streamflow/${asset.thumbnailKey}`) : undefined}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] aspect-video max-h-[70vh] flex items-center justify-center bg-black/40 border border-white/5 relative overflow-hidden">
              <div className="text-center relative z-10">
                {asset.status === 'processing' && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">Transcodificando Motor</p>
                    <p className="text-[var(--text-secondary)] font-mono text-xs mt-2">Generando manifiesto HLS...</p>
                  </div>
                )}
                {asset.status === 'uploading' && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin mb-6" />
                    <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm">Ingestando Media</p>
                  </div>
                )}
                {asset.status === 'failed' && (
                  <div className="flex flex-col items-center text-red-500">
                    <svg className="w-16 h-16 mb-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="font-bold uppercase tracking-widest text-sm">Error Fatal</p>
                    <p className="text-white/40 font-mono text-xs mt-2">El archivo está corrupto o la conexión falló.</p>
                  </div>
                )}
                {asset.status === 'pending' && (
                  <div className="flex flex-col items-center text-white/40">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    <p className="font-bold uppercase tracking-widest text-sm">Esperando Archivo</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}