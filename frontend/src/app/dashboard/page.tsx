'use client'

import { useEffect, useState, useRef } from 'react'
import { VideoCard, VideoCardSkeleton } from '@/components/VideoCard'
import { useAssets } from '@/hooks/useAssets'
import { useAuth } from '@/hooks/useAuth'
import { getCategories, Category } from '@/lib/api'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const { assets, loading: assetsLoading, fetchAssets } = useAssets()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchAssets()
    loadCategories()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    const { data } = await getCategories()
    if (data) setCategories(data)
    setLoading(false)
  }

  const getCategoryVideoCount = (categoryId: string) => {
    return assets.filter(a => a.categoryId === categoryId).length
  }

  const recentVideos = assets.slice(0, 4)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8 animate-fade-in-up stagger-1">
        <h1 className="text-4xl font-bold mb-2">
          Bienvenido, <span className="gradient-text">{user?.name || 'Admin'}</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          Gestiona el contenido de video, catálogo y configuración general.
        </p>
      </div>

      <div className="mb-10 animate-fade-in-up stagger-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tus Catálogos</h2>
          <Link href="/dashboard/catalogs" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
            Ver todos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-12 w-12 rounded-lg bg-white/5 mb-4" />
                <div className="h-4 w-24 rounded bg-white/5 mb-2" />
                <div className="h-3 w-16 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center border border-dashed border-white/10">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-4">Aún no tienes catálogos creados.</p>
            <Link href="/dashboard/catalogs" className="btn-primary text-sm">
              Crear mi primer catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/dashboard/catalogs?id=${category.id}`}
                className="glass-card glow-border group hover:bg-white/[0.04] transition-all p-6 rounded-2xl cursor-pointer block"
              >
                <div className="p-3 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] w-fit mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-[var(--primary)] transition-colors truncate">{category.name}</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {getCategoryVideoCount(category.id)} videos
                </p>
              </Link>
            ))}
            <Link
              href="/dashboard/catalogs"
              className="glass-card group hover:bg-white/[0.04] transition-all p-6 rounded-2xl cursor-pointer block border border-dashed border-white/20 hover:border-[var(--primary)]/50"
            >
              <div className="p-3 rounded-xl bg-white/5 text-white/30 w-fit mb-4 group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-all">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-white/50 group-hover:text-[var(--primary)] transition-colors">Nueva carpeta</h3>
            </Link>
          </div>
        )}
      </div>

      <div className="animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Videos Recientes</h2>
          <Link href="/dashboard/videos" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
            Ver todos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {assetsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        ) : recentVideos.length === 0 ? (
          <div className="glass-card rounded-2xl py-16 text-center border border-[var(--border)]">
            <div className="w-20 h-20 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 gradient-radial-primary rounded-full opacity-50" />
              <svg className="w-10 h-10 text-[var(--primary)] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Sin videos aún</h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              El catálogo está vacío. Sube el primer video al sistema para comenzar a poblar tu plataforma.
            </p>
            <Link href="/dashboard/videos" className="btn-primary">
              Subir mi primer video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentVideos.map((asset) => (
              <VideoCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}