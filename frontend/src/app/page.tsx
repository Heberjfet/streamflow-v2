'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const features = [
  {
    title: 'CDN Global',
    description: 'Edge caching en todo el mundo. Tu contenido llega más rápido, sin importar la distancia.',
  },
  {
    title: 'Privado y Seguro',
    description: 'Control total sobre quién ve tu contenido. Tokens de acceso, autenticación y cifrado.',
  },
  {
    title: 'Análisis',
    description: 'Métricas en tiempo real. Vistas, retención y rendimiento detallado.',
  },
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
    <div className="min-h-screen relative overflow-hidden bg-[#050505] text-white">
      <div className="noise-overlay" />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] animate-pulse-glow gradient-radial-primary opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] animate-pulse-glow gradient-radial-secondary opacity-30" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-nav mx-4 mt-4 rounded-2xl">
          <nav className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center hover-glow transition-all">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold uppercase italic">StreamFlow</span>
              </div>

              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm"
                >
                  Comenzar Gratis
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO ESTRUCTURAL 100DVH */}
        <section className="h-[100dvh] min-h-[800px] flex flex-col justify-center px-8 max-w-[1400px] mx-auto">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-[#121212]/50 mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm font-medium text-zinc-300">
                Infraestructura de video
              </span>
            </div>

            <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black uppercase leading-none mb-8">
              <span className="block text-white mb-2">Transmite tu</span>
              <span className="gradient-text">Contenido</span>
            </h1>

            <p className="text-xl lg:text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl mb-12">
              La plataforma de video self-hosted minimalista.
              <span className="text-white font-medium"> Sin límites, sin comisiones.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/register" className="btn-primary w-full sm:w-auto px-10 py-5 text-base hover-glow text-center">
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </section>

        {/* GRID DE FUNCIONES (MOVIDO DESPUÉS DEL HERO) */}
        <section className="py-16 px-8 max-w-[1400px] mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`glass-card p-10 rounded-3xl hover-glow transition-all duration-500 animate-fade-in-up delay-100`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <div className="w-4 h-4 rounded-full gradient-button" />
                </div>
                <h3 className="text-2xl font-bold uppercase mb-4">
                  {feature.title}
                </h3>
                <p className="text-base text-zinc-400 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN INTERACTIVA: UPLOAD (MENOS PADDING Y REDIRECCIÓN A LOGIN) */}
        <section className="py-16 px-8 max-w-[1400px] mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold uppercase leading-tight">
                Sube contenido <br />
                <span className="text-zinc-500">al instante</span>
              </h2>
              <p className="text-lg text-zinc-400 font-light max-w-md">
                Arrastra y suelta tus archivos en nuestro gestor impulsado por edge-computing. Procesamiento inmediato sin tiempos de espera.
              </p>
            </div>

            <Link href="/login" className="order-1 lg:order-2 block glass-card p-6 rounded-3xl group cursor-pointer animate-fade-in-up hover-glow transition-all duration-500 relative overflow-hidden">
              {/* Controles de ventana tipo macOS */}
              <div className="flex items-center gap-2 mb-6 px-2 relative z-10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              {/* Zona de Drop Interactiva */}
              <div className="border border-dashed border-white/20 rounded-2xl p-16 flex flex-col items-center justify-center bg-[#050505]/50 group-hover:bg-purple-500/10 transition-colors duration-500 relative overflow-hidden z-10">
                <svg className="w-16 h-16 text-purple-400 mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <div className="text-xl font-medium mb-2 text-white">Iniciar sesión para subir</div>
                <div className="text-sm text-zinc-500">Haz clic para continuar</div>
              </div>
            </Link>
          </div>
        </section>

        {/* SECCIÓN INTERACTIVA: PLAYER (MENOS PADDING Y REDIRECCIÓN A LOGIN) */}
        <section className="py-16 px-8 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Link href="/login" className="block glass-card p-6 rounded-3xl group cursor-pointer animate-fade-in-up delay-100 hover-glow transition-all duration-500">
              <div className="flex items-center gap-2 mb-6 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              {/* Reproductor Interactivo */}
              <div className="relative aspect-video bg-[#050505] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center group-hover:border-purple-500/50 transition-colors duration-500">
                <div className="absolute inset-0 gradient-radial-primary opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

                <div className="play-button w-20 h-20 rounded-full gradient-button flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Controles de reproducción animados */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-sm font-mono text-white">EN VIVO</div>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-white/20 group-hover:gradient-button transition-all duration-500" />
                  </div>
                  <div className="text-sm font-mono text-white">Calidad Original</div>
                </div>
              </div>
            </Link>

            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold uppercase leading-tight">
                Reproducción <br />
                <span className="gradient-text italic">Inmersiva</span>
              </h2>
              <p className="text-lg text-zinc-400 font-light max-w-md">
                Un reproductor minimalista diseñado para mantener la atención de tu audiencia. Fidelidad absoluta, sin distracciones visuales.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN CON DISEÑO FIXED */}
        <section className="relative py-40 border-y border-white/10 bg-fixed bg-center" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, #050505 80%)' }}>
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <div className="relative z-10 max-w-[1400px] mx-auto px-8 text-center">
            <h2 className="text-5xl lg:text-7xl font-black uppercase text-white mb-6 mix-blend-overlay opacity-80">
              Escalabilidad Soberana
            </h2>
            <p className="text-xl lg:text-3xl text-zinc-400 font-light max-w-3xl mx-auto">
              Diseñado estructuralmente para soportar desde tu primer espectador hasta una audiencia masiva global, manteniendo siempre el control de tu lado.
            </p>
          </div>
        </section>

        {/* CTA FINAL IMPACTANTE (100DVH CON DESCRIPCIÓN) */}
        <section className="h-[100dvh] min-h-[800px] flex items-center justify-center px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />

          <div className="glass-card w-full max-w-6xl mx-auto rounded-[3rem] p-12 md:p-24 lg:p-32 text-center border-white/20 animate-fade-in-up overflow-hidden relative group shadow-[0_0_80px_rgba(168,85,247,0.1)] hover:shadow-[0_0_120px_rgba(168,85,247,0.2)] transition-shadow duration-700">
            <div className="absolute inset-0 gradient-radial-primary opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative z-10">
              <h2 className="text-6xl lg:text-8xl xl:text-9xl font-black uppercase leading-none mb-8">
                Toma el <br />
                <span className="gradient-text">Control</span>
              </h2>

              <p className="text-xl lg:text-2xl text-zinc-300 font-light max-w-2xl mx-auto mb-16 leading-relaxed">
                Únete a la nueva generación de creadores que deciden las reglas. Aloja, distribuye y monetiza tu contenido en una plataforma verdaderamente tuya.
              </p>

              <Link href="/register" className="btn-primary inline-block px-16 py-6 text-xl hover-glow transition-all uppercase font-black">
                INICIAR AHORA
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-8 py-10 border-t border-white/10 bg-[#050505] relative z-20">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <span className="text-xl font-bold uppercase italic">StreamFlow</span>
          <span className="text-sm text-zinc-500 font-medium">Derechos Reservados</span>
        </div>
      </footer>
    </div>
  )
}