'use client'

import { useEffect, useRef, useState } from 'react'
import hls from 'hls.js'

interface VideoPlayerProps {
  src: string
  poster?: string
  autoplay?: boolean
}

// Utilidad para URLs locales
const fixLocalhostUrl = (url: string): string => {
  if (!url) return url
  const hostname = window.location.hostname
  if (url.includes('localhost:9000') || url.includes('minio:9000')) {
    return url.replace(/localhost:9000|minio:9000/, `${hostname}:9000`)
  }
  return url
}

export function VideoPlayer({ src, poster, autoplay = false }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<hls | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPiP, setIsPiP] = useState(false)

  const [videoSrc, setVideoSrc] = useState(src)
  const [posterImg, setPosterImg] = useState(poster)

  useEffect(() => {
    setVideoSrc(fixLocalhostUrl(src))
    setPosterImg(poster ? fixLocalhostUrl(poster) : undefined)
  }, [src, poster])

  // Lógica de HLS
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    setIsLoading(true)
    setError(null)

    if (hlsRef.current) {
      hlsRef.current.destroy()
    }

    if (videoSrc.includes('.m3u8')) {
      if (hls.isSupported()) {
        const hlsInstance = new hls({
          lowLatencyMode: true,
          backBufferLength: 90
        })
        hlsRef.current = hlsInstance

        hlsInstance.loadSource(videoSrc)
        hlsInstance.attachMedia(video)

        hlsInstance.on(hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false)
          if (autoplay) video.play().catch(() => { })
        })

        hlsInstance.on(hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setError('Error fatal cargando el stream HLS')
            setIsLoading(false)
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false)
          if (autoplay) video.play().catch(() => { })
        })
      } else {
        setError('Tu navegador no soporta reproducción HLS')
        setIsLoading(false)
      }
    } else {
      video.src = videoSrc
      setIsLoading(false)
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [videoSrc, autoplay])

  // Listener para salir de pantalla completa con ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Listener para Picture-in-Picture
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnterPiP = () => setIsPiP(true)
    const handleLeavePiP = () => setIsPiP(false)

    video.addEventListener('enterpictureinpicture', handleEnterPiP)
    video.addEventListener('leavepictureinpicture', handleLeavePiP)

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP)
      video.removeEventListener('leavepictureinpicture', handleLeavePiP)
    }
  }, [])

  // Acciones de control
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) video.pause()
    else video.play().catch(() => { })
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(err => console.error(`Error fullscreen: ${err.message}`))
    } else {
      await document.exitFullscreen().catch(err => console.error(`Error exit fullscreen: ${err.message}`))
    }
  }

  const togglePiP = async () => {
    const video = videoRef.current
    if (!video) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await video.requestPictureInPicture()
      }
    } catch (error) {
      console.error('Error con Picture-in-Picture:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group overflow-hidden flex items-center justify-center"
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        poster={posterImg}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        playsInline
      />

      {/* OVERLAY DE CARGA (Estilo Studio) */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 pointer-events-none">
          <div className="w-12 h-12 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] mb-4" />
          <p className="text-[var(--primary)] font-mono text-xs tracking-widest uppercase animate-pulse">Buffer...</p>
        </div>
      )}

      {/* OVERLAY DE ERROR */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-red-400 font-mono text-sm uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* BARRA DE CONTROLES (Glassmorphism, solo visible en hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">

        {/* Barra de Progreso */}
        <div className="flex items-center gap-3 mb-3 w-full group/progress">
          <span className="text-[10px] text-white/80 font-mono">{formatTime(currentTime)}</span>
          <div className="relative flex-1 flex items-center cursor-pointer h-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[var(--primary)] hover:h-1.5 transition-all outline-none z-10"
              style={{
                background: `linear-gradient(to right, var(--primary) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%)`
              }}
            />
          </div>
          <span className="text-[10px] text-white/40 font-mono">{formatTime(duration)}</span>
        </div>

        {/* Botones de Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play / Pause */}
            <button onClick={togglePlay} className="text-white hover:text-[var(--primary)] transition-colors hover:scale-110 transform">
              {isPlaying ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
              ) : (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>

            {/* Volumen */}
            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="text-white hover:text-[var(--primary)] transition-colors">
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                )}
              </button>
              {/* Deslizador de volumen (expande on hover) */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-[var(--primary)] transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, var(--primary) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Picture in Picture */}
            <button onClick={togglePiP} className="text-white/80 hover:text-[var(--primary)] transition-colors" title="Picture in Picture">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </button>

            {/* Pantalla Completa */}
            <button onClick={toggleFullscreen} className="text-white hover:text-[var(--primary)] transition-colors">
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}