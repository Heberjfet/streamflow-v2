'use client'

import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser, getUserContent, User } from '@/lib/api'
import { getS3Url } from '@/lib/s3'
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
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [roleFocused, setRoleFocused] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(null)
  const [userAssets, setUserAssets] = useState<any[]>([])
  const [userCategories, setUserCategories] = useState<any[]>([])
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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
    setUserToDelete(userId)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    setDeleting(true)
    const result = await deleteUser(userToDelete)
    if (!result.error) {
      fetchUsers()
    }
    setDeleting(false)
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  const openUserProfile = async (user: User) => {
    setSelectedUserProfile(user)
    setLoadingProfile(true)
    const { data, error } = await getUserContent(user.id)
    if (data) {
      setUserAssets(data.assets.slice(0, 5))
      setUserCategories(data.categories.slice(0, 5))
    }
    setLoadingProfile(false)
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black">
            Directorio de usuarios
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
                        onClick={() => openUserProfile(user)}
                        className="p-2 hover:bg-white/10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--primary)] transition-all"
                        title="Ver Perfil"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth={2} /></svg>
                      </button>
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
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-all duration-300 ${nameFocused ? 'text-purple-500' : 'text-[var(--text-secondary)]'}`}>Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  required
                  className="w-full bg-zinc-900 border-2 border-white/10 rounded-xl py-3 px-4 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/20 transition-all text-white"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-all duration-300 ${emailFocused ? 'text-purple-500' : 'text-[var(--text-secondary)]'}`}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  className="w-full bg-zinc-900 border-2 border-white/10 rounded-xl py-3 px-4 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/20 transition-all text-white
                    [&:-webkit-autofill]:[-webkit-text-fill-color:white]
                    [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(24_24_27)]
                    [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_rgb(24_24_27)]
                    [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_rgb(24_24_27)]"
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
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 transition-all duration-300 ${roleFocused ? 'text-purple-500' : 'text-[var(--text-secondary)]'}`}>Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  onFocus={() => setRoleFocused(true)}
                  onBlur={() => setRoleFocused(false)}
                  className="w-full bg-zinc-900 border-2 border-white/10 rounded-xl py-3 px-4 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/30 focus:ring-4 focus:ring-purple-500/20 transition-all text-white"
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

      {/* User Profile Modal */}
      {selectedUserProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="glass-card border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-8 border-b border-white/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleColors[selectedUserProfile.role]} flex items-center justify-center font-black text-black text-2xl shadow-lg`}>
                    {selectedUserProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUserProfile.name}</h2>
                    <p className="text-[var(--text-secondary)]">{selectedUserProfile.email}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-md font-black border uppercase tracking-tighter ${selectedUserProfile.role === 'admin' ? 'border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5' : 'border-white/10 text-white/40 bg-white/5'}`}>
                      {roleLabels[selectedUserProfile.role]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUserProfile(null)}
                  className="p-2 hover:bg-white/10 rounded-xl text-[var(--text-secondary)] transition-all"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} /></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Contenido de este usuario</h3>
              {loadingProfile ? (
                <div className="text-center py-8 text-[var(--text-secondary)]">Cargando...</div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-white/30 uppercase mb-3">Videos subidos</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {userAssets.slice(0, 5).map(asset => (
                        <div key={asset.id} className="glass-card rounded-xl p-3 border border-white/5">
                          <div className="aspect-video rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-transparent mb-2 flex items-center justify-center">
                            {asset.thumbnailKey ? (
                              <img src={getS3Url(asset.thumbnailKey)} alt={asset.title} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs font-medium truncate">{asset.title}</p>
                          <p className="text-[10px] text-[var(--text-secondary)] capitalize">{asset.status}</p>
                        </div>
                      ))}
                      {userAssets.length === 0 && (
                        <div className="col-span-full text-center py-4 text-[var(--text-secondary)] text-sm">Sin videos</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/30 uppercase mb-3">Carpetas creadas</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userCategories.slice(0, 5).map(cat => (
                        <div key={cat.id} className="glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{cat.name}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{userAssets.filter(a => a.categoryId === cat.id).length} videos</p>
                          </div>
                        </div>
                      ))}
                      {userCategories.length === 0 && (
                        <div className="col-span-full text-center py-4 text-[var(--text-secondary)] text-sm">Sin carpetas</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteModal(false)} />
          <div className="relative glass-card border border-white/10 w-full max-w-md rounded-[2rem] overflow-hidden animate-slide-in shadow-2xl">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Eliminar Usuario</h3>
              <p className="text-white/60 text-sm mb-8">
                ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}