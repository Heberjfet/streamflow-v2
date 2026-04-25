'use client'

import { useState, useCallback, useRef } from 'react'
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
      setError('Please select a valid video file (MP4, WebM, MOV, AVI)')
      return
    }
    if (file.size > 5 * 1024 * 1024 * 1024) {
      setError('File size must be less than 5GB')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !videoTitle.trim()) {
      setError('Please provide a title and select a video file')
      return
    }

    setStatus('uploading')
    setError(null)
    setProgress(0)

    try {
      const { createAsset, getUploadUrl, processAsset } = await import('@/lib/api')

      const { data: asset, error: createError } = await createAsset(videoTitle.trim())
      if (createError || !asset) {
        throw new Error(createError || 'Failed to create asset')
      }

      const apiUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:3001` : 'http://localhost:3001'
      const { data: uploadData, error: uploadUrlError } = await getUploadUrl(asset.id, selectedFile.name, selectedFile.type)
      if (uploadUrlError || !uploadData) {
        throw new Error(uploadUrlError || 'Failed to get upload URL')
      }

      const uploadUrlFixed = uploadData.uploadUrl.replace('minio:9000', `${window.location.hostname}:9000`).replace('localhost:9000', `${window.location.hostname}:9000`)

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded * 100) / e.total))
          }
        })
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error('Upload failed'))
          }
        })
        xhr.addEventListener('error', () => reject(new Error('Upload failed')))
        xhr.open('PUT', uploadUrlFixed)
        xhr.setRequestHeader('Content-Type', selectedFile.type)
        xhr.send(selectedFile)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Video Title"
        placeholder="Enter video title"
        value={videoTitle}
        onChange={(e) => setVideoTitle(e.target.value)}
        disabled={status !== 'idle'}
        required
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          Video File
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-300
            ${isDragging
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
              : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
            }
            ${status !== 'idle' ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={status !== 'idle'}
          />

          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {(selectedFile.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Drag and drop your video here, or{' '}
                  <span className="text-[var(--color-accent)]">browse</span>
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  MP4, WebM, MOV, AVI up to 5GB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {(status === 'uploading' || status === 'complete' || status === 'processing') && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">
              {status === 'uploading' && 'Uploading...'}
              {status === 'complete' && 'Upload complete'}
              {status === 'processing' && 'Processing video...'}
            </span>
            <span className="text-[var(--color-text-primary)]">{progress}%</span>
          </div>
          <div className="h-2 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {status === 'processing' && (
            <p className="text-xs text-[var(--color-text-muted)] text-center">
              This may take a few minutes depending on video length...
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {status === 'done' && (
        <div className="p-3 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/20">
          <p className="text-sm text-[var(--color-success)]">Video uploaded successfully!</p>
        </div>
      )}

      <div className="flex gap-3">
        {status === 'idle' && (
          <Button type="submit" disabled={!selectedFile || !videoTitle.trim()}>
            Upload Video
          </Button>
        )}
        {status === 'error' && (
          <Button type="button" onClick={resetForm}>
            Try Again
          </Button>
        )}
        {status === 'done' && (
          <Button type="button" onClick={resetForm}>
            Upload Another
          </Button>
        )}
      </div>
    </form>
  )
}
