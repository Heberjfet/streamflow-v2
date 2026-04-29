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
  pending: 'bg-white/20 text-white/60',
  uploading: 'bg-yellow-400/20 text-yellow-400',
  uploaded: 'bg-blue-400/20 text-blue-400',
  processing: 'bg-blue-400/20 text-blue-400',
  ready: 'bg-green-400/20 text-green-400',
  failed: 'bg-red-400/20 text-red-400',
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--primary)] font-mono text-sm tracking-widest uppercase animate-pulse">
          Cargando panel...
        </p>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="glass-card border border-red-500/20 max-w-2xl mx-auto mt-20 p-12 text-center rounded-3xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Error de Conexión</h2>
        <p className="text-[var(--text-secondary)] font-mono text-sm mb-8">{error}</p>
        <button onClick={loadData} className="btn-secondary px-8 py-3">
          Reintentar
        </button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Panel de Control</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Estado del sistema en tiempo real
            {lastUpdate && (
              <span className="ml-2 text-white/40">
                · Actualizado: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider">
              Live · 3s
            </span>
          </div>
          <button onClick={loadData} className="btn-secondary py-2 px-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Uso de Memoria</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">RSS</span>
              <span className="text-sm font-mono">{formatBytes(stats.systemInfo.memoryUsage.rss)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Heap Used</span>
              <span className="text-sm font-mono">{formatBytes(stats.systemInfo.memoryUsage.heapUsed)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Heap Total</span>
              <span className="text-sm font-mono">{formatBytes(stats.systemInfo.memoryUsage.heapTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">External</span>
              <span className="text-sm font-mono">{formatBytes(stats.systemInfo.memoryUsage.external)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Heap Usage</span>
              <span className="text-xs font-mono text-white/60">
                {Math.round((stats.systemInfo.memoryUsage.heapUsed / stats.systemInfo.memoryUsage.heapTotal) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((stats.systemInfo.memoryUsage.heapUsed / stats.systemInfo.memoryUsage.heapTotal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Estado Videos</h3>
          <div className="space-y-3">
            {Object.entries(stats.assetsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded ${statusColors[status] || 'bg-white/10 text-white/60'}`}>
                  {status.toUpperCase()}
                </span>
                <span className="text-sm font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">CPU User</span>
              <span className="text-xs font-mono text-white/60">
                {(stats.systemInfo.cpuUsage.user / 1000000).toFixed(2)}s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">CPU System</span>
              <span className="text-xs font-mono text-white/60">
                {(stats.systemInfo.cpuUsage.system / 1000000).toFixed(2)}s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Tiempo Actual</span>
              <span className="text-xs font-mono text-white/60">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Videos Recientes</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {stats.recentAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{asset.title}</p>
                  <p className="text-xs text-white/40">{new Date(asset.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[asset.status] || 'bg-white/10 text-white/60'}`}>
                    {asset.status.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-white/40">{asset.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Actividad Reciente</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {logs?.users.slice(0, 10).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-white/40">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.role === 'admin' ? 'bg-red-400/20 text-red-400' : 'bg-white/10 text-white/60'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-white/40">
                    {new Date(user.createdAt).toLocaleDateString()}
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
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
    green: 'from-green-500/20 to-green-600/5 border-green-500/20 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
    red: 'from-red-500/20 to-red-600/5 border-red-500/20 text-red-400',
  }

  return (
    <div className={`glass-card p-5 rounded-2xl border bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </div>
      </div>
      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold font-mono">{isText ? value : value.toLocaleString()}</p>
    </div>
  )
}