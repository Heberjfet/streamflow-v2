'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAssets } from '@/hooks/useAssets'
import { UploadForm } from '@/components/UploadForm'

// Configuración visual de estados
const statusStyles = {
    pending: { label: 'PENDIENTE', color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', glow: 'bg-white/20' },
    uploading: { label: 'SUBIENDO', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', glow: 'bg-yellow-400' },
    processing: { label: 'PROCESANDO', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', glow: 'bg-blue-400' },
    ready: { label: 'LIVE', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', glow: 'bg-green-500' },
    completed: { label: 'LIVE', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', glow: 'bg-green-500' },
    failed: { label: 'ERROR', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'bg-red-500' },
}
const defaultStatus = { label: 'DESCONOCIDO', color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', glow: 'bg-white/20' }

// Utilidad para URLs locales de miniaturas
const fixS3Url = (url?: string): string | undefined => {
    if (!url) return undefined
    if (typeof window === 'undefined') return url
    const hostname = window.location.hostname
    if (url.includes('localhost:9000') || url.includes('minio:9000')) {
        return url.replace(/localhost:9000|minio:9000/, `${hostname}:9000`)
    }
    return url
}

export default function NetflixAdminVideos() {
    const { assets, loading, fetchAssets } = useAssets()
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
    const [showUpload, setShowUpload] = useState(false)

    // Cargar assets al montar
    useEffect(() => {
        fetchAssets()
    }, [fetchAssets])

    return (
        <div className="w-full max-w-7xl mx-auto">

            {/* HEADER ESTILO STUDIO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 animate-fade-in">
                <div className="mb-8 animate-fade-in-up stagger-1">
                    <h1 className="text-4xl font-bold mb-2">
                        Content <span className="gradient-text">Manager</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg">
                        Gestiona el contenido de video, catálogo y configuración general.
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1.5 font-mono">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                            {assets.length} Activos
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Toggles de Vista */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white/10 text-[var(--primary)] shadow-lg' : 'text-white/40 hover:text-white'}`}
                            title="Vista de Lista"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-[var(--primary)] shadow-lg' : 'text-white/40 hover:text-white'}`}
                            title="Vista de Cuadrícula"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                        </button>
                    </div>

                    {/* Botón de Subida */}
                    <button
                        onClick={() => setShowUpload(true)}
                        className="btn-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Subir Video
                    </button>
                </div>
            </div>

            {/* ÁREA DE CONTENIDO */}
            <div className="animate-fade-in-up">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <div className="w-12 h-12 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-mono text-sm tracking-widest uppercase">Cargando Catálogo...</p>
                    </div>
                ) : assets.length === 0 ? (
                    <div className="glass-card rounded-3xl py-24 text-center border-dashed border-2 border-white/10">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Base de datos vacía</h3>
                        <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto text-sm">No hay activos multimedia en el servidor. Inicia el proceso de ingesta para poblar el CMS.</p>
                        <button onClick={() => setShowUpload(true)} className="btn-secondary px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">
                            Iniciar Primera Ingesta
                        </button>
                    </div>
                ) : viewMode === 'table' ? (

                    /* VISTA DE TABLA (LIST) */
                    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.03] text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold">
                                    <th className="px-6 py-4">Media</th>
                                    <th className="px-6 py-4">Detalles Técnicos</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Timeline</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {assets.map((asset) => {
                                    const status = statusStyles[asset.status as keyof typeof statusStyles] || defaultStatus
                                    const thumbUrl = asset.thumbnailKey ? fixS3Url(`http://localhost:9000/streamflow/${asset.thumbnailKey}`) : null

                                    return (
                                        <tr key={asset.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 w-48">
                                                <Link href={`/dashboard/video/${asset.id}`}>
                                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group-hover:border-[var(--primary)]/50 transition-all shadow-xl bg-black/50">
                                                        {thumbUrl ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={thumbUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-white/20">NO THUMB</div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        {asset.duration && (
                                                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] font-bold rounded">
                                                                {Math.floor(asset.duration / 60)}:{String(Math.floor(asset.duration % 60)).padStart(2, '0')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/dashboard/video/${asset.id}`}>
                                                    <div className="font-bold text-lg mb-1 group-hover:text-[var(--primary)] transition-colors line-clamp-1">{asset.title}</div>
                                                </Link>
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-[10px] px-1.5 py-0.5 border border-white/20 rounded font-bold text-white/40 font-mono bg-white/5">ID: {asset.id.split('-')[0]}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${status.border} ${status.bg} ${status.color}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${status.glow} shadow-[0_0_8px_currentColor]`} />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-[var(--text-secondary)]">
                                                <div>Creado: {new Date(asset.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/dashboard/video/${asset.id}`}>
                                                    <button className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (

                    /* VISTA DE GRID */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {assets.map((asset) => {
                            const status = statusStyles[asset.status as keyof typeof statusStyles] || defaultStatus
                            const thumbUrl = asset.thumbnailKey ? fixS3Url(`http://localhost:9000/streamflow/${asset.thumbnailKey}`) : null

                            return (
                                <Link href={`/dashboard/video/${asset.id}`} key={asset.id} className="group">
                                    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden hover:border-[var(--primary)]/30 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-1 h-full flex flex-col">

                                        {/* Media Container */}
                                        <div className="relative aspect-video bg-black">
                                            {thumbUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={thumbUrl} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white/20">NO THUMBNAIL</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                            {/* Status Badge Overlaid */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-black border backdrop-blur-md ${status.border} ${status.color} bg-black/50`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${status.glow}`} />
                                                    {status.label}
                                                </span>
                                            </div>

                                            {asset.duration && (
                                                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[10px] font-bold rounded font-mono">
                                                    {Math.floor(asset.duration / 60)}:{String(Math.floor(asset.duration % 60)).padStart(2, '0')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Metadata Container */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-[var(--primary)] transition-colors line-clamp-1">{asset.title}</h3>
                                            <div className="mt-auto pt-4 flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                                                <span>ID: {asset.id.split('-')[0]}</span>
                                                <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* MODAL DE SUBIDA (UPLOAD FORM) */}
            {showUpload && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUpload(false)} />

                    <div className="relative glass-card border border-white/10 w-full max-w-2xl rounded-[2rem] overflow-hidden animate-slide-in shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Cabecera del Modal */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                            <h2 className="text-xl font-black uppercase tracking-widest">Ingestar <span className="text-[var(--primary)]">Nuevo Activo</span></h2>
                            <button
                                onClick={() => setShowUpload(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-[var(--text-secondary)] hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Contenido del Modal (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <UploadForm onUploadComplete={() => {
                                setShowUpload(false)
                                fetchAssets() // Refresca la lista al terminar
                            }} />
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}