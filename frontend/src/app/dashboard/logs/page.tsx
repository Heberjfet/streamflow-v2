'use client'

import { useState, useEffect } from 'react'
import { getAdminStats, getAdminLogs, AdminStats, AdminLogs } from '@/lib/api'

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (days > 0) return `${days}d ${hours}h ${mins}m`
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`
  return `${mins}m ${secs}s`
}

function formatBytes(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb} MB`
}

const statusColors: Record<string, string> = {
  pending: 'bg-white/10 text-white/60',
  uploading: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  uploaded: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  processing: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  ready: 'bg-green-500/10 text-green-400 border-green-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function LogsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [logs, setLogs] = useState<AdminLogs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const loadData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        getAdminStats(),
        getAdminLogs(50)
      ])

      if (statsRes.error || !statsRes.data) {
        setError(statsRes.error || 'Error loading stats')
      } else {
        setStats(statsRes.data)
        setLastUpdate(new Date())
        setError(null)
      }

      if (!logsRes.error && logsRes.data) {
        setLogs(logsRes.data)
      }

      setLoading(false)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Error de conexión')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 bg-[#050505]">
        <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-white/40 font-medium text-sm tracking-widest uppercase animate-pulse">
          Cargando panel...
        </p>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#050505]">
        <div className="bg-white/[0.02] border border-red-500/20 max-w-lg w-full p-10 text-center rounded-[2rem]">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">Error de Conexión</h2>
          <p className="text-white/40 text-sm mb-8">{error}</p>
          <button onClick={loadData} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-full pb-20 animate-fade-in bg-[#050505] space-y-8">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
            Panel de Control
          </h1>
          <p className="text-white/40 text-sm font-medium flex items-center gap-2">
            Estado del sistema en tiempo real
            {lastUpdate && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Actualizado: {lastUpdate.toLocaleTimeString()}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Live · 3s</span>
          </div>

          <button
            onClick={loadData}
            className="p-2.5 bg-white/[0.05] hover:bg-white/10 border border-white/5 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center"
            title="Forzar actualización"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Total Videos"
          value={stats.totalAssets}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />}
          color="blue"
        />
        <StatCard
          label="Total Usuarios"
          value={stats.totalUsers}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
          color="purple"
        />
        <StatCard
          label="Total Vistas"
          value={stats.totalViews}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
          color="green"
        />
        <StatCard
          label="Uptime"
          value={formatUptime(stats.systemInfo.uptime)}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
          color="yellow"
          isText
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">Uso de Memoria</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">RSS</span>
              <span className="text-sm font-mono text-white">{formatBytes(stats.systemInfo.memoryUsage.rss)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Heap Used</span>
              <span className="text-sm font-mono text-white">{formatBytes(stats.systemInfo.memoryUsage.heapUsed)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">Heap Total</span>
              <span className="text-sm font-mono text-white">{formatBytes(stats.systemInfo.memoryUsage.heapTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">External</span>
              <span className="text-sm font-mono text-white">{formatBytes(stats.systemInfo.memoryUsage.external)}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60">Carga de Heap</span>
              <span className="text-xs font-bold text-white">
                {Math.round((stats.systemInfo.memoryUsage.heapUsed / stats.systemInfo.memoryUsage.heapTotal) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((stats.systemInfo.memoryUsage.heapUsed / stats.systemInfo.memoryUsage.heapTotal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">Estado Videos</h3>
          <div className="space-y-3">
            {Object.entries(stats.assetsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <span className={`text-[10px] px-2.5 py-1 rounded-md uppercase font-bold tracking-widest border ${statusColors[status] || 'bg-white/5 text-white/60 border-white/10'}`}>
                  {status}
                </span>
                <span className="text-sm font-mono text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6">Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-white/60">CPU User</span>
              <span className="text-sm font-mono text-white">
                {(stats.systemInfo.cpuUsage.user / 1000000).toFixed(2)}s
              </span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-white/60">CPU System</span>
              <span className="text-sm font-mono text-white">
                {(stats.systemInfo.cpuUsage.system / 1000000).toFixed(2)}s
              </span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-white/60">Tiempo Servidor</span>
              <span className="text-sm font-mono text-white">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 flex flex-col h-[500px]">
          <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6 shrink-0">Videos Recientes</h3>
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 flex-1">
            {stats.recentAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 bg-white/[0.01] border border-transparent rounded-2xl hover:bg-white/[0.03] hover:border-white/5 transition-all">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-semibold text-white truncate">{asset.title}</p>
                  <p className="text-xs text-white/40 mt-1">{new Date(asset.createdAt).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="shrink-0">
                  <span className={`text-[10px] px-2.5 py-1 rounded-md uppercase font-bold tracking-widest border ${statusColors[asset.status] || 'bg-white/5 text-white/60 border-white/10'}`}>
                    {asset.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 flex flex-col h-[500px]">
          <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6 shrink-0">Nuevos Usuarios</h3>
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 flex-1">
            {logs?.users.slice(0, 10).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white/[0.01] border border-transparent rounded-2xl hover:bg-white/[0.03] hover:border-white/5 transition-all">
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-white/40 mt-0.5 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded-md uppercase font-bold tracking-widest border ${user.role === 'admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/5 text-white/60 border-white/10'
                    }`}>
                    {user.role}
                  </span>
                  <span className="text-[10px] font-medium text-white/30">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, isText }: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  isText?: boolean;
}) {
  const iconColors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    green: 'bg-green-500/10 text-green-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    red: 'bg-red-500/10 text-red-400',
  }

  return (
    <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconColors[color]}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{isText ? value : value.toLocaleString()}</p>
      </div>
    </div>
  )
}