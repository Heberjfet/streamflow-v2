'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ShareDropdownProps {
  playbackId: string
  className?: string
}

export function ShareDropdown({ playbackId, className = '' }: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getPublicUrl = () => {
    return `${window.location.origin}/watch/${playbackId}`
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target as Node) &&
        portalRef.current && !portalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text)
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return Promise.resolve()
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await copyToClipboard(getPublicUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  const dropdownContent = isOpen && showDropdown && (
    <div
      ref={portalRef}
      className="fixed glass-card rounded-xl p-3 shadow-xl border border-white/10 z-[99999]"
      style={{
        top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : '50%',
        left: buttonRef.current ? Math.min(buttonRef.current.getBoundingClientRect().right - 288, window.innerWidth - 296) : '50%'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Compartir video</h3>
        <button
          onClick={handleClose}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-[var(--text-secondary)] mb-3">
        Cualquier persona con el link puede ver el video
      </p>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={getPublicUrl()}
          readOnly
          className="w-56 bg-black/30 border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] truncate"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-3 py-2 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
        >
          {copied ? 'OK' : 'Copiar'}
        </button>
      </div>
    </div>
  )

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
          } else {
            setShowDropdown(true)
            setIsOpen(true)
          }
        }}
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 hover:text-[var(--primary)] transition-colors"
        title="Compartir"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {showDropdown && createPortal(dropdownContent, document.body)}
    </div>
  )
}
