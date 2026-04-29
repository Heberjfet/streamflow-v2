'use client'

import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser, User } from '@/lib/api'
import { Input } from '@/components/ui/Input'

const roleColors: Record<string, string> = {
  admin: 'from-cyan-500 to-blue-600',
  editor: 'from-purple-500 to-pink-600',
  viewer: 'from-orange-400 to-red-500'
}

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer'
}

export default function UsersAdminPage() {
  const [filter, setFilter] = useState('all')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({ email: '', name: '', password: '', role: 'viewer' })

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    const result = await getUsers(1, 100, filter)
    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setUsers(result.data.data)
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({ email: '', name: '', password: '', role: 'viewer' })
    setShowModal(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ email: user.email, name: user.name, password: '', role: user.role })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      const result = await updateUser(editingUser.id, formData)
      if (!result.error) {
        setShowModal(false)
        fetchUsers()
      }
    } else {
      const result = await createUser(formData)
      if (!result.error) {
        setShowModal(false)
        fetchUsers()
      }
    }
  }

  const handleDelete = async (userId: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      const result = await deleteUser(userId)
      if (!result.error) {
        fetchUsers()
      }
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in">

      {/* Header */}
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
            <p className="text-2xl font-mono font-bold">{users.length}</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-black font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2.5} /></svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          {error}
        </div>
      )}

      {/* Barra de Herramientas y Filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Buscar por email, nombre o UUID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Tabla de Usuarios */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--text-secondary)]">Cargando...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-secondary)]">No hay usuarios</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] font-bold">
                <th className="px-8 py-5">Identidad</th>
                <th className="px-8 py-5">Acceso / Rol</th>
                <th className="px-8 py-5">Última Actividad</th>
                <th className="px-8 py-5 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center font-black text-black shadow-lg shadow-black/20`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-lg group-hover:text-[var(--primary)] transition-colors">{user.name}</div>
                        <div className="text-xs text-[var(--text-secondary)] font-mono">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-black border uppercase tracking-tighter ${user.role === 'admin'
                        ? 'border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5'
                        : 'border-white/10 text-white/40 bg-white/5'
                      }`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-[var(--text-secondary)]">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-white/10 rounded-xl text-[var(--text-secondary)] hover:text-white transition-all"
                        title="Editar Usuario"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth={2} /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 hover:bg-red-500/10 rounded-xl text-red-500/50 hover:text-red-500 transition-all"
                        title="Eliminar Usuario"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-3xl border border-white/10 p-8 w-full max-w-md">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">
              {editingUser ? 'Editar' : 'Nuevo'} Usuario
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 focus:border-[var(--primary)]/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 focus:border-[var(--primary)]/50 focus:outline-none transition-all"
                />
              </div>
              <Input
                type="password"
                label={`Contraseña ${editingUser ? '(opcional)' : ''}`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                showPasswordToggle
              />
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 focus:border-[var(--primary)]/50 focus:outline-none transition-all"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-black font-bold rounded-xl transition-all"
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}