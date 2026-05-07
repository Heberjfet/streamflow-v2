'use client'

import { useEffect, useState } from 'react'
import { useAssets } from '@/hooks/useAssets'
import { getCategories, Category } from '@/lib/api'
import { getS3Url } from '@/lib/s3'
import Link from 'next/link'

export default function SearchPage() {
    const { assets, fetchAssets } = useAssets()
    const [categories, setCategories] = useState<Category[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchAssets()
        loadCategories()
    }, [])

    const loadCategories = async () => {
        const { data } = await getCategories()
        if (data) setCategories(data)
    }

    const getCategoryVideoCount = (categoryId: string) => {
        return assets.filter(a => a.categoryId === categoryId).length
    }

    const filteredCategories = searchQuery.trim()
        ? categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : []

    const filteredVideos = searchQuery.trim()
        ? assets.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : []

    const hasResults = filteredCategories.length > 0 || filteredVideos.length > 0
    const isSearching = searchQuery.trim().length > 0

    return (
        <div className={`flex flex-col transition-all duration-500 ease-in-out ${!isSearching ? 'justify-center min-h-[80vh]' : 'pt-10'}`}>
            <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">

                {/* Título y Descripción Centrados */}
                <div className={`text-center transition-all duration-500 ${isSearching ? 'mb-8' : 'mb-12'}`}>
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">
                        ¿Qué estás <span className="gradient-text">buscando?</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-xl max-w-lg mx-auto">
                        Encuentra videos, catálogos y recursos en segundos.
                    </p>
                </div>

                {/* Buscador Estilo Editorial */}
                <div className="relative z-10">
                    <div className="glass-card flex items-center gap-4 px-8 py-6 rounded-[2.5rem] border border-white/10 focus-within:border-[var(--primary)]/40 focus-within:shadow-[0_0_50px_rgba(168,85,247,0.15)] transition-all duration-300">
                        <svg className="w-7 h-7 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Escribe el nombre de un video o carpeta..."
                            className="flex-1 bg-transparent outline-none text-xl placeholder:text-white/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Resultados de Búsqueda */}
                {isSearching && (
                    <div className="animate-fade-in-up stagger-1 pt-8 pb-20">
                        {hasResults ? (
                            <div className="space-y-12">

                                {/* Carpetas */}
                                {filteredCategories.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6 px-2">
                                            Catálogos Relacionados
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {filteredCategories.map(category => (
                                                <Link
                                                    key={category.id}
                                                    href={`/dashboard/catalogs?id=${category.id}`}
                                                    className="glass-card group hover:bg-white/[0.04] transition-all p-6 rounded-3xl cursor-pointer block"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="p-4 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] group-hover:scale-110 transition-transform">
                                                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-lg mb-1 group-hover:text-[var(--primary)] transition-colors truncate">{category.name}</h3>
                                                            <p className="text-sm text-[var(--text-secondary)]">
                                                                {getCategoryVideoCount(category.id)} videos almacenados
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Videos */}
                                {filteredVideos.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6 px-2">
                                            Resultados de Video
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {filteredVideos.map(video => (
                                                <Link
                                                    key={video.id}
                                                    href={`/dashboard/video/${video.id}`}
                                                    className="glass-card flex items-center gap-5 p-4 rounded-3xl hover:bg-white/5 transition-all cursor-pointer group"
                                                >
                                                    <div className="w-28 h-16 rounded-2xl bg-white/5 overflow-hidden shrink-0">
                                                        {video.thumbnailKey ? (
                                                            <img src={getS3Url(video.thumbnailKey)} alt={video.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-white/10">
                                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-lg truncate group-hover:text-[var(--primary)] transition-colors">{video.title}</p>
                                                        <span className="text-xs font-mono text-[var(--primary)]/60 uppercase tracking-widest">{video.status}</span>
                                                    </div>
                                                    <svg className="w-6 h-6 text-white/10 group-hover:text-[var(--primary)] transition-colors mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="text-center py-20 animate-fade-in">
                                <p className="text-xl text-[var(--text-secondary)]">
                                    No hay resultados para "<span className="text-white">{searchQuery}</span>"
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}