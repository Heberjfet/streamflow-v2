'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Hosting de Video 4K',
    description: 'Transmite contenido de altísima calidad con streaming adaptativo que se ajusta a cada conexión.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'CDN Global',
    description: 'Edge caching en todo el mundo. Tu contenido llega más rápido, sin importar la distancia.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Privado y Seguro',
    description: 'Control total sobre quién ve tu contenido. Tokens de acceso, autenticación y cifrado.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Análisis',
    description: 'Métricas en tiempo real. Vistas, engagement, retención y rendimiento detalhado.',
  },
]

const stats = [
  { value: '4K', label: 'Resolución' },
  { value: '99.9%', label: 'Uptime' },
  { value: '∞', label: 'Transmisiones' },
]

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050505]">
      <div className="noise-overlay" />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] animate-float">
          <div className="w-full h-full bg-gradient-radial from-purple-600/30 via-purple-900/10 to-transparent rounded-full blur-[120px]" />
        </div>
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] animate-float" style={{ animationDelay: '-3s' }}>
          <div className="w-full h-full bg-gradient-radial from-pink-600/25 via-pink-900/10 to-transparent rounded-full blur-[100px]" />
        </div>
        <div className="absolute bottom-[-30%] left-[20%] w-[900px] h-[500px] animate-float" style={{ animationDelay: '-5s' }}>
          <div className="w-full h-full bg-gradient-radial from-purple-500/20 via-transparent to-transparent rounded-full blur-[150px]" />
        </div>
        <div className="absolute top-[60%] left-[40%] w-[400px] h-[400px] animate-pulse-glow opacity-40">
          <div className="w-full h-full bg-gradient-radial from-fuchsia-600/15 via-transparent to-transparent rounded-full blur-[80px]" />
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-nav mx-4 mt-4 rounded-2xl">
          <nav className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center animate-gradient group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 w-11 h-11 rounded-xl bg-gradient-primary blur-lg opacity-60 -z-10 group-hover:opacity-80 transition-opacity" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">StreamFlow</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Link 
                  href="/login"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/register"
                  className="btn-primary text-sm py-2.5 px-5 relative overflow-hidden"
                >
                  <span className="relative z-10">Comenzar Gratis</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:200%_100%] animate-gradient-shift opacity-0 hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative pt-48 pb-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: '0ms' }}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-zinc-300 font-medium tracking-wide">
                  Plataforma de video self-hosted
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
                <span className="block text-white mb-3">Transmite tu contenido,</span>
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-shift">a tu manera</span>
                  <span className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-zinc-400 mb-16 max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
                La plataforma de video self-hosted más poderosa.
                <span className="text-zinc-300 font-medium"> Sin límites, sin comisiones.</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up opacity-0" style={{ animationDelay: '300ms' }}>
                <Link href="/register" className="group relative px-8 py-4 rounded-xl font-semibold text-base overflow-hidden flex items-center justify-center gap-3 w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-primary animate-gradient-shift bg-[length:200%_100%]" />
                  <div className="absolute inset-[2px] rounded-xl bg-[#050505] transition-colors group-hover:bg-[#0a0a0a]" />
                  <span className="relative z-10 text-white">Comenzar Gratis</span>
                  <svg className="relative z-10 w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/login" className="group px-8 py-4 rounded-xl font-semibold text-base border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto">
                  <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.554z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-zinc-300 group-hover:text-white transition-colors">Iniciar Sesión</span>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-16 mt-20 animate-fade-in-up opacity-0" style={{ animationDelay: '400ms' }}>
                {stats.map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-sm text-zinc-500 mt-2 tracking-wide group-hover:text-zinc-400 transition-colors">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-28 relative animate-fade-in-up opacity-0" style={{ animationDelay: '500ms' }}>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/40 via-pink-600/30 to-purple-600/40 rounded-3xl blur-2xl opacity-60 animate-pulse-glow" />
              <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
                <div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-gradient-shift bg-[length:200%_100%]" />
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="play-button group cursor-pointer">
                      <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-glow">
                        <svg className="w-10 h-10 text-white ml-1 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-semibold text-zinc-200 tracking-wide">LIVE</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                      <span className="text-sm text-zinc-400">2,847 espectadores</span>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-xs text-zinc-300 font-medium">4K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-40 px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-24">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0ms' }}>
                Todo lo que necesitas para{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">transmitir</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
                Funciones poderosas diseñadas para creadores que buscan control total sobre su contenido de video.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div 
                  key={feature.title}
                  className="group relative p-8 rounded-2xl bg-[#121212]/80 backdrop-blur-sm border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:scale-[1.02] hover:bg-[#1a1a1a] animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${150 + i * 100}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-2xl bg-purple-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                  
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="relative text-xl font-semibold text-white mb-3 group-hover:text-purple-100 transition-colors">{feature.title}</h3>
                  <p className="relative text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-40 px-6 lg:px-8 relative">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-600/10 to-transparent rounded-full blur-[150px]" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm mb-10 animate-fade-in-up opacity-0">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="text-sm text-zinc-300">Potencia profesional</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '100ms' }}>
              ¿Listo para{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">comenzar</span>?
            </h2>
            
            <p className="text-zinc-400 text-lg mb-14 max-w-xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '200ms' }}>
              Únete a miles de creadores que confían en StreamFlow para su hosting de video.
            </p>
            
            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '300ms' }}>
              <Link href="/register" className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-primary animate-gradient-shift bg-[length:200%_100%]" />
                <div className="absolute inset-[2px] rounded-xl bg-[#050505] transition-colors group-hover:bg-[#0a0a0a]" />
                <span className="relative z-10 text-white">Crear Tu Cuenta</span>
                <svg className="relative z-10 w-6 h-6 text-purple-300 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            <p className="text-zinc-500 text-sm mt-10 animate-fade-in-up opacity-0" style={{ animationDelay: '400ms' }}>
              Sin tarjeta de crédito requerida · Configuración en minutos
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 pt-16 pb-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center animate-gradient group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute inset-0 w-11 h-11 rounded-xl bg-gradient-primary blur-lg opacity-50 -z-10 group-hover:opacity-70 transition-opacity" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">StreamFlow</span>
                <p className="text-sm text-zinc-500 mt-0.5">Tu contenido, tu control.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <a href="#" className="group w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="#" className="group w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="group w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="#" className="group w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              © 2024 StreamFlow. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-8 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}