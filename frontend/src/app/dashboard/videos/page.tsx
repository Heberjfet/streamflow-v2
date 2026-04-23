'use client'

import { useState } from 'react'
import { useAssets } from '@/hooks/useAssets'

// Tipado extendido para simular metadatos tipo Netflix
interface VideoAsset {
    id: string;
    title: string;
    category: string;
    duration: string;
    quality: '4K' | 'HD';
    status: 'published' | 'draft' | 'scheduled';
    views: number;
    thumbnail: string;
}

export default function NetflixAdminVideos() {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-6">

            {/* Header Estilo Studio */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Content <span className="text-[var(--primary)]">Manager</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 128 Videos Online
                        </span>
                        <span className="opacity-20">|</span>
                        <span>Estadísticas de hoy: +1.2k reproducciones</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white/10 text-[var(--primary)] shadow-lg' : 'opacity-40'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-[var(--primary)] shadow-lg' : 'opacity-40'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                        </button>
                    </div>
                    <button className="btn-primary px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
                        Ingestar Video
                    </button>
                </div>
            </div>

            {/* Barra de Filtros Inteligentes */}
            <div className="flex gap-4 items-center overflow-x-auto pb-2 scrollbar-hide">
                <div className="relative min-w-[300px]">
                    <input
                        type="text"
                        placeholder="Buscar por título, ID o metadato..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:border-[var(--primary)] transition-all"
                    />
                    <svg className="absolute left-3.5 top-3 w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2} /></svg>
                </div>
                <FilterBadge label="Calidad: 4K" />
                <FilterBadge label="Estado: Publicado" active />
                <FilterBadge label="Categoría: Documental" />
                <button className="text-xs font-bold text-[var(--primary)] px-4 hover:underline">Limpiar filtros</button>
            </div>

            {/* Tabla Estilo Enterprise (Vista Netflix Admin) */}
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.03] text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold">
                            <th className="px-6 py-4">Media</th>
                            <th className="px-6 py-4">Detalles</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Rendimiento</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 w-48">
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group-hover:border-[var(--primary)]/50 transition-all shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] font-bold rounded">04:2{i}</div>
                                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-xs text-white/20">THUMBNAIL</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-lg mb-0.5 group-hover:text-[var(--primary)] transition-colors">Interstellar Journey Vol. {i}</div>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-[10px] px-1.5 py-0.5 border border-white/20 rounded font-bold text-white/40">4K</span>
                                        <span className="text-[10px] px-1.5 py-0.5 border border-white/20 rounded font-bold text-white/40">HDR10</span>
                                        <span className="text-xs text-[var(--text-secondary)]">Original Content</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                        LIVE
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium">{(i * 1234).toLocaleString()} views</div>
                                    <div className="w-24 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-[var(--primary)]" style={{ width: `${i * 20}%` }} />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-secondary)] hover:text-white transition-all" title="Ver Analíticas">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth={2} /></svg>
                                        </button>
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth={2} /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function FilterBadge({ label, active = false }: { label: string, active?: boolean }) {
    return (
        <button className={`
      whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-bold transition-all
      ${active
                ? 'bg-[var(--primary)] border-[var(--primary)] text-black shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                : 'bg-white/5 border-white/10 text-[var(--text-secondary)] hover:border-white/20'
            }
    `}>
            {label}
        </button>
    )
}