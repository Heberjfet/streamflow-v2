'use client'

import { useState, useCallback, useRef } from 'react'
// Mantenemos las importaciones originales por si las usas en otros lados, 
// aunque aquí usaremos HTML nativo estilizado para asegurar el glassmorphism
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface UploadFormProps {
  onUploadComplete?: () => void
}

type UploadStatus = 'idle' | 'uploading' | 'complete' | 'processing' | 'done' | 'error'

export function UploadForm({ onUploadComplete }: UploadFormProps) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setStatus('idle')
    setProgress(0)
    setError(null)
    setVideoTitle('')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileSelect = useCallback((file: File) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
    if (!validTypes.includes(file.type)) {
      setError('Formato inválido. Por favor selecciona MP4, WebM, MOV o AVI.')
      return
    }
    if (file.size > 5 * 1024 * 1024 * 1024) {
      setError('El tamaño del archivo debe ser menor a 5GB.')
      return
    }
    setSelectedFile(file)
    setError(null)
    if (!videoTitle) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      setVideoTitle(nameWithoutExt)
    }
  }, [videoTitle])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  // --- LÓGICA INTACTA (INCLUYENDO LA LÍNEA 95) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !videoTitle.trim()) {
      setError('Please provide a title and select a video file')
      return
    }

    setStatus('uploading')
    setError(null)

    try {
      const apiUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:3001` : 'http://localhost:3001'
      const { createAsset, processAsset } = await import('@/lib/api')

      const { data: asset, error: createError } = await createAsset(videoTitle.trim())
      if (createError || !asset) {
        throw new Error(createError || 'Failed to create asset')
      }

      const formData = new FormData()
      formData.append('file', selectedFile)

      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100))
        }
      })

      await new Promise<void>((resolve, reject) => {
        xhr.open('POST', `${apiUrl}/v1/assets/${asset.id}/upload`)
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('streamflow_token')}`)
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.send(formData)
      })

      setProgress(100)
      setStatus('complete')

      const { error: processError } = await processAsset(asset.id)
      if (processError) {
        throw new Error(processError)
      }

      setStatus('processing')
      setTimeout(() => {
        setStatus('done')
        onUploadComplete?.()
      }, 2000)

    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }
  // ------------------------------------------------

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* INPUT DE TÍTULO */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2 block">
          Título del Activo
        </label>
        <input
          type="text"
          placeholder="Ej: Temporada 1 - Episodio 1"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          disabled={status !== 'idle'}
          required
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-[var(--primary)] focus:outline-none transition-colors disabled:opacity-50 font-medium"
        />
      </div>

      {/* ZONA DE DROP (DROPZONE ESTILO STUDIO) */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] block">
          Archivo Multimedia (Source)
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative rounded-2xl p-10 text-center cursor-pointer overflow-hidden
            transition-all duration-300 border-2 border-dashed
            ${isDragging
              ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-[inset_0_0_50px_rgba(var(--primary-rgb),0.1)]'
              : 'border-white/10 bg-white/[0.01] hover:border-[var(--primary)]/30 hover:bg-white/[0.02]'
            }
            ${status !== 'idle' ? 'pointer-events-none opacity-50 grayscale' : ''}
          `}
        >
          {/* Ruido sutil de fondo para textura */}
          <div className="noise-overlay opacity-20 pointer-events-none" />

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={status !== 'idle'}
          />

          {selectedFile ? (
            <div className="flex flex-col items-center justify-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
                <svg className="w-8 h-8 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white truncate max-w-[250px] mb-1">
                  {selectedFile.name}
                </p>
                <span className="inline-flex px-2 py-0.5 rounded bg-white/10 text-white/60 font-mono text-[10px] tracking-widest border border-white/5">
                  {(selectedFile.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-black/40 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">
                  Arrastra tu master aquí, o <span className="text-[var(--primary)] cursor-pointer hover:underline">explora</span>
                </p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2 font-mono">
                  MP4, WebM, MOV, AVI • MAX 5GB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ESTADOS DE PROGRESO Y CARGA */}
      {(status === 'uploading' || status === 'complete' || status === 'processing') && (
        <div className="space-y-3 glass-card p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
            <span className={status === 'processing' ? 'text-blue-400' : 'text-[var(--primary)]'}>
              {status === 'uploading' && 'Subiendo a S3...'}
              {status === 'complete' && 'Ingesta completada'}
              {status === 'processing' && 'Transcodificando video...'}
            </span>
            <span className="font-mono text-white">{progress}%</span>
          </div>

          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
            <div
              className={`h-full transition-all duration-300 rounded-full ${status === 'processing' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]'
                }`}
              style={{ width: `${progress}%` }}
            />
            {/* Animación de brillo sobre la barra */}
            <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {status === 'processing' && (
            <p className="text-[10px] text-white/40 text-center font-mono uppercase tracking-widest mt-2 animate-pulse">
              Generando manifiesto HLS. Por favor espere...
            </p>
          )}
        </div>
      )}

      {/* MENSAJES DE ERROR Y ÉXITO */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-xs font-mono text-red-400 uppercase tracking-wide">{error}</p>
        </div>
      )}

      {status === 'done' && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-xs font-mono text-green-400 uppercase tracking-wide">Activo procesado y publicado con éxito</p>
        </div>
      )}

      {/* CONTROLES / BOTONES */}
      <div className="flex gap-3 pt-2">
        {status === 'idle' && (
          <button
            type="submit"
            disabled={!selectedFile || !videoTitle.trim()}
            className="w-full btn-primary py-3 rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Iniciar Subida
          </button>
        )}

        {status === 'error' && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border border-white/10"
          >
            Intentar Nuevamente
          </button>
        )}

        {status === 'done' && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full btn-primary py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
          >
            Ingestar Otro Archivo
          </button>
        )}
      </div>
    </form>
  )
}