'use client'

import { useState } from 'react'

export default function UsersAdminPage() {
    const [filter, setFilter] = useState('all')

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in">

            {/* Header Estilo Admin Pro */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        User <span className="gradient-text">Directory</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2 text-sm max-w-md">
                        Gestiona privilegios de acceso, roles de administración y monitorea la actividad de los usuarios en tiempo real.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Total Usuarios</p>
                        <p className="text-2xl font-mono font-bold">1,240</p>
                    </div>
                </div>
            </div>

            {/* Barra de Herramientas y Filtros */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <input
                        type="text"
                        placeholder="Buscar por email, nombre o UUID..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-[var(--primary)]/50 focus:outline-none transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 w-5 h-5 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2} /></svg>
                </div>

                <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/10 w-full md:w-auto">
                    {['all', 'admin', 'editor', 'viewer'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFilter(role)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all flex-1 md:flex-none ${filter === role ? 'bg-white/10 text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla de Usuarios Pro */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.02] text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold">
                            <th className="px-8 py-5">Identidad</th>
                            <th className="px-8 py-5">Acceso / Rol</th>
                            <th className="px-8 py-5">Seguridad</th>
                            <th className="px-8 py-5">Última Actividad</th>
                            <th className="px-8 py-5 text-right">Gestión</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[
                            { name: 'Emiliano Leal', email: 'emiliano@dev.com', role: 'Super Admin', status: 'Active', color: 'from-cyan-500 to-blue-600' },
                            { name: 'Admin Secondary', email: 'staff@platform.com', role: 'Editor', status: 'Active', color: 'from-purple-500 to-pink-600' },
                            { name: 'Guest Reviewer', email: 'guest@test.com', role: 'Viewer', status: 'Idle', color: 'from-orange-400 to-red-500' },
                        ].map((user, i) => (
                            <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${user.color} flex items-center justify-center font-black text-black shadow-lg shadow-black/20`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg group-hover:text-[var(--primary)] transition-colors">{user.name}</div>
                                            <div className="text-xs text-[var(--text-secondary)] font-mono">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`text-[10px] px-2 py-1 rounded-md font-black border uppercase tracking-tighter ${user.role === 'Super Admin'
                                            ? 'border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5'
                                            : 'border-white/10 text-white/40 bg-white/5'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`} />
                                        <span className="text-sm font-medium">{user.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-mono text-xs text-[var(--text-secondary)]">
                                    Hoy, 18:42:01
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white/10 rounded-xl text-[var(--text-secondary)] hover:text-white transition-all" title="Reset Password">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeWidth={2} /></svg>
                                        </button>
                                        <button className="p-2 hover:bg-red-500/10 rounded-xl text-red-500/50 hover:text-red-500 transition-all" title="Suspender Cuenta">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" strokeWidth={2} /></svg>
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