'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getCategories, createCategory, deleteCategory, Category, getAssets, updateAsset, Asset } from '@/lib/api'
import { getS3Url } from '@/lib/s3'
import { VideoCard } from '@/components/VideoCard'

export default function CatalogsPage() {
    const searchParams = useSearchParams()
    const [catalogs, setCatalogs] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCatalog, setSelectedCatalog] = useState<Category | null>(null)
    const [catalogVideos, setCatalogVideos] = useState<Asset[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showAddVideoModal, setShowAddVideoModal] = useState(false)
    const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([])
    const [availableVideos, setAvailableVideos] = useState<Asset[]>([])
    const [newCatalogName, setNewCatalogName] = useState('')
    const [newCatalogDescription, setNewCatalogDescription] = useState('')
    const [creating, setCreating] = useState(false)
    const [catalogToDelete, setCatalogToDelete] = useState<string | null>(null)

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        if (selectedCatalog) {
            loadVideosForCatalog(selectedCatalog.id)
        }
    }, [selectedCatalog])

    useEffect(() => {
        const catalogId = searchParams.get('id')
        if (catalogId && catalogs.length > 0) {
            const found = catalogs.find(c => c.id === catalogId)
            if (found) {
                setSelectedCatalog(found)
            }
        }
    }, [searchParams, catalogs])

    const loadCategories = async () => {
        setLoading(true)
        const { data, error } = await getCategories()
        if (data) setCatalogs(data)
        setLoading(false)
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCatalogName.trim()) return
        setCreating(true)
        const { data, error } = await createCategory({
            name: newCatalogName.trim(),
            description: newCatalogDescription.trim() || undefined
        })
        if (data) {
            setCatalogs([...catalogs, data])
            setNewCatalogName('')
            setNewCatalogDescription('')
            setShowCreateModal(false)
        }
        setCreating(false)
    }

    const executeDelete = async () => {
        if (!catalogToDelete) return
        const { error } = await deleteCategory(catalogToDelete)

        if (!error) {
            setCatalogs(catalogs.filter(c => c.id !== catalogToDelete))
            if (selectedCatalog?.id === catalogToDelete) {
                setSelectedCatalog(null)
            }
        }
        setCatalogToDelete(null)
    }

    const loadVideosForCatalog = async (categoryId: string) => {
        const { data } = await getAssets()
        if (data?.data) {
            const filtered = data.data.filter(v => v.categoryId && v.categoryId === categoryId)
            setCatalogVideos(filtered)
        }
    }

    const openAddVideoModal = async () => {
        const { data } = await getAssets()
        if (data?.data) {
            const notInCatalog = data.data.filter(v => v.categoryId !== selectedCatalog?.id && v.categoryId !== undefined)
            setAvailableVideos(notInCatalog)
            setShowAddVideoModal(true)
        }
    }

    const handleAddVideo = async (assetId: string) => {
        if (!selectedCatalog) return
        const { data, error } = await updateAsset(assetId, { categoryId: selectedCatalog.id })
        if (data && !error) {
            await loadVideosForCatalog(selectedCatalog.id)
            setShowAddVideoModal(false)
        }
    }

    const toggleVideoSelection = (id: string) => {
        if (selectedVideoIds.includes(id)) {
            setSelectedVideoIds(selectedVideoIds.filter(vid => vid !== id))
        } else {
            setSelectedVideoIds([...selectedVideoIds, id])
        }
    }

    const handleAddSelectedVideos = async () => {
        if (!selectedCatalog || selectedVideoIds.length === 0) return
        for (const vid of selectedVideoIds) {
            await updateAsset(vid, { categoryId: selectedCatalog.id })
        }
        await loadVideosForCatalog(selectedCatalog.id)
        const { data } = await getAssets()
        if (data?.data) {
            const notInCatalog = data.data.filter(v => v.categoryId !== selectedCatalog?.id)
            setAvailableVideos(notInCatalog)
        }
        setSelectedVideoIds([])
        setShowAddVideoModal(false)
    }

    const DeleteConfirmationModal = catalogToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setCatalogToDelete(null)} />
            <div className="relative glass-card border border-white/10 w-full max-w-md p-8 rounded-3xl animate-slide-in text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold mb-2">Eliminar Catálogo</h2>
                <p className="text-[var(--text-secondary)] mb-8 text-sm">
                    ¿Estás seguro de que deseas eliminar este catálogo? Esta acción no se puede deshacer. Los videos que contenga no serán borrados de tu cuenta.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => setCatalogToDelete(null)}
                        className="flex-1 py-3 px-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-bold text-sm">
                        Cancelar
                    </button>
                    <button
                        onClick={executeDelete}
                        className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        Sí, eliminar
                    </button>
                </div>
            </div>
        </div>
    )

    if (selectedCatalog) {
        return (
            <div className="animate-fade-in space-y-6">
                <button
                    onClick={() => setSelectedCatalog(null)}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a catálogos
                </button>

                <div className="glass-card p-8 rounded-3xl border border-white/[0.05] relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{selectedCatalog.name}</h1>
                                <p className="text-lg text-[var(--text-secondary)] max-w-2xl">{selectedCatalog.description}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCatalogToDelete(selectedCatalog.id)}
                                    className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all text-sm font-bold flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Eliminar
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-[var(--primary)]">Videos en este catálogo ({catalogVideos.length})</h2>
                                <button
                                    onClick={openAddVideoModal}
                                    className="btn-primary flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2.5} /></svg>
                                    Agregar Video
                                </button>
                            </div>
                            {catalogVideos.length === 0 ? (
                                <div className="p-12 border-2 border-dashed border-white/5 rounded-2xl text-center">
                                    <p className="text-[var(--text-secondary)] text-sm">No hay videos asignados a este catálogo todavía.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {catalogVideos.map(video => (
                                        <VideoCard key={video.id} asset={video} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showAddVideoModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { setShowAddVideoModal(false); setSelectedVideoIds([]); }} />
                        <div className="relative glass-card border border-white/10 w-full max-w-2xl p-8 rounded-3xl animate-slide-in max-h-[80vh] flex flex-col">
                            <h2 className="text-2xl font-bold mb-6">Agregar <span className="gradient-text">Videos</span></h2>
                            {availableVideos.length === 0 ? (
                                <p className="text-[var(--text-secondary)]">No hay videos disponibles para agregar.</p>
                            ) : (
                                <div className="space-y-3 max-h-[400px] overflow-y-auto flex-1 pr-2 custom-scrollbar">
                                    {availableVideos.map(video => {
                                        const isSelected = selectedVideoIds.includes(video.id)
                                        return (
                                            <div
                                                key={video.id}
                                                onClick={() => toggleVideoSelection(video.id)}
                                                className={`relative flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${isSelected
                                                    ? 'bg-[var(--primary)]/10 border-[var(--primary)]/50'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div
                                                    className="w-24 h-16 rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-transparent flex items-center justify-center overflow-hidden shrink-0"
                                                >
                                                    {video.thumbnailKey ? (
                                                        <img
                                                            src={getS3Url(video.thumbnailKey)}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold truncate">{video.title}</h3>
                                                    <p className="text-xs text-[var(--text-secondary)] capitalize">{video.status}</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${isSelected
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]'
                                                    : 'border-white/30'
                                                    }`}>
                                                    {isSelected && (
                                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                                <button
                                    onClick={() => { setShowAddVideoModal(false); setSelectedVideoIds([]); }}
                                    className="flex-1 py-3 px-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-bold">
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddSelectedVideos}
                                    disabled={selectedVideoIds.length === 0}
                                    className="flex-1 py-3 px-4 rounded-xl bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/50 hover:bg-[var(--primary)]/30 transition-all font-bold disabled:opacity-30">
                                    Agregar {selectedVideoIds.length > 0 && `(${selectedVideoIds.length})`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {DeleteConfirmationModal}
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex justify-between items-end animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        Gestión de <span className="gradient-text">Catálogos</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Organiza tus videos en colecciones estructuradas.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2.5} /></svg>
                    Crear Catálogo
                </button>
            </div>

            {loading ? (
                <div className="glass-card rounded-3xl py-24 text-center border-dashed border-2 border-white/10">
                    <p className="text-[var(--text-secondary)] text-sm">Cargando catálogos...</p>
                </div>
            ) : catalogs.length === 0 ? (
                <div className="glass-card rounded-3xl py-24 text-center border-dashed border-2 border-white/10">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm">Aún no hay catálogos creados en la base de datos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catalogs.map((catalog) => (
                        <div
                            key={catalog.id}
                            onClick={() => setSelectedCatalog(catalog)}
                            className="glass-card group relative overflow-hidden transition-all duration-300 p-6 cursor-pointer rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:border-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] group-hover:scale-110 group-hover:bg-[var(--primary)]/20 transition-all duration-300 shadow-inner">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                                        {catalog.name}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-sm line-clamp-2 leading-relaxed">
                                        {catalog.description || 'Sin descripción'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
                    <div className="relative glass-card border border-white/10 w-full max-w-md p-8 rounded-3xl animate-slide-in">
                        <h2 className="text-2xl font-bold mb-6">Nuevo <span className="gradient-text">Catálogo</span></h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-2 block">Nombre del catálogo</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newCatalogName}
                                    onChange={(e) => setNewCatalogName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--primary)]/50 focus:outline-none"
                                    placeholder="Ej: Temporada de Invierno"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-2 block">Descripción (opcional)</label>
                                <textarea
                                    value={newCatalogDescription}
                                    onChange={(e) => setNewCatalogDescription(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[var(--primary)]/50 focus:outline-none resize-none"
                                    placeholder="Ej: Colección de videos de la temporada de invierno 2026"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 btn-secondary py-3">Cancelar</button>
                                <button type="submit" disabled={creating || !newCatalogName.trim()} className="flex-1 btn-primary py-3 disabled:opacity-50">{creating ? 'Creando...' : 'Crear Ahora'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {DeleteConfirmationModal}
        </div>
    )
}