'use client'

import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory, Category } from '@/lib/api'

export default function CatalogsPage() {
    const [catalogs, setCatalogs] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCatalog, setSelectedCatalog] = useState<Category | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newCatalogName, setNewCatalogName] = useState('')
    const [newCatalogDescription, setNewCatalogDescription] = useState('')
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        loadCategories()
    }, [])

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

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este catálogo?')) return
        const { error } = await deleteCategory(id)
        if (!error) setCatalogs(catalogs.filter(c => c.id !== id))
    }

    // --- VISTA DE DETALLE (SUBPÁGINA) ---
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
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{selectedCatalog.name}</h1>
                                <p className="text-lg text-[var(--text-secondary)] max-w-2xl">{selectedCatalog.description}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (confirm('¿Eliminar este catálogo?')) {
                                            handleDelete(selectedCatalog.id)
                                            setSelectedCatalog(null)
                                        }
                                    }}
                                    className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all text-sm font-bold">
                                    Eliminar Catálogo
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/5">
                            <h2 className="text-xl font-semibold mb-6 text-[var(--primary)]">Videos en este catálogo</h2>
                            <div className="p-12 border-2 border-dashed border-white/5 rounded-2xl text-center">
                                <p className="text-[var(--text-secondary)] text-sm">No hay videos asignados a este catálogo todavía.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- VISTA PRINCIPAL ---
    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 relative">

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
                            className="glass-card glow-border group hover:bg-white/[0.04] transition-all p-6 cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(catalog.id); }}
                                    className="text-white/30 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <h3 className="text-xl font-bold mb-1 group-hover:text-[var(--primary)] transition-colors">{catalog.name}</h3>
                            <p className="text-[var(--text-secondary)] text-sm line-clamp-1">{catalog.description || 'Sin descripción'}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL SIMPLE DE CREACIÓN */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />

                    {/* Card del Modal */}
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
        </div>
    )
}