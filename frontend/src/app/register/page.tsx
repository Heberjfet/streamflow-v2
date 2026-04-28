'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { register } from '@/lib/api'
import { TVStatic } from '@/components/TVStatic'

function PasswordStrengthIndicator({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return { level: 0, text: '', color: '', bgColor: '' }
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 1) return { level: 1, text: 'Muy débil', color: 'bg-[var(--color-error)]', bgColor: 'bg-[var(--color-error)]/20 text-[var(--color-error)]' }
    if (strength <= 2) return { level: 2, text: 'Débil', color: 'bg-orange-500', bgColor: 'bg-orange-500/20 text-orange-500' }
    if (strength <= 3) return { level: 3, text: 'Regular', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/20 text-yellow-500' }
    if (strength <= 4) return { level: 4, text: 'Fuerte', color: 'bg-green-500', bgColor: 'bg-green-500/20 text-green-500' }
    return { level: 5, text: 'Muy fuerte', color: 'bg-[var(--color-success)]', bgColor: 'bg-[var(--color-success)]/20 text-[var(--color-success)]' }
  }

  const { level, text, color, bgColor } = getStrength()

  if (!password) return null

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`
              h-1.5 flex-1 rounded-full transition-all duration-500 ease-out
              ${i <= level ? `${color} shadow-lg` : 'bg-[var(--color-border)]'}
            `}
            style={{
              boxShadow: i <= level ? `0 0 10px ${i <= level ? color.replace('bg-', 'rgba(').replace('-500)', ', 0.5)') : 'transparent'}` : 'none'
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className={`text-xs px-2 py-1 rounded-md ${bgColor}`}>
          {text}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {password.length} caracteres
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    setLoading(true)

    try {
      const result = await register(email, password, name)
      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }
      if (result.data?.token) {
        localStorage.setItem('streamflow_token', result.data.token)
        localStorage.setItem('streamflow_user', JSON.stringify(result.data.user))
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <TVStatic opacity={0.3} />
      <button
        onClick={() => router.push('/')}
        className="fixed top-6 left-6 z-50 flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-bg-elevated)]/80 backdrop-blur-sm border border-[var(--color-border)]/50 text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-elevated)] transition-all duration-300 group"
      >
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 animate-glow-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--color-accent-hover)] rounded-full blur-[150px] opacity-10 animate-glow-pulse delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial-primary opacity-30" />
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6 animate-float">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#8B5CF6]/60 via-[#EC4899]/60 to-[#22D3EE]/60 blur-2xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#EC4899] shadow-[0_0_55px_rgba(168,85,247,0.85)]" />
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/25 ring-1 ring-white/30 backdrop-blur-sm">
                <svg className="w-11 h-11 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.75)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F5D0FE] to-[#C4B5FD] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)] animate-gradient-shift bg-[length:200%_200%]">
                Crea tu cuenta
              </span>
            </h1>
            <p className="inline-block px-4 py-1.5 rounded-full bg-black/45 border border-fuchsia-400/25 text-white/95 text-lg shadow-[0_8px_24px_rgba(0,0,0,0.55)]">
              Comienza a transmitir con StreamFlow hoy
            </p>
          </div>

          <Card
            variant="glass"
            className="auth-card-vivid shadow-2xl shadow-black/60 animate-fade-in-up delay-200 border border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/30"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-16 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl animate-pulse delay-300 pointer-events-none" />

            <div className="relative p-8">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60" />

              <form onSubmit={handleSubmit} className="space-y-5 auth-form-rainbow">
                {error && (
                  <div className="p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 flex items-center gap-3 animate-shake">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-error)]/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--color-error)] font-medium">{error}</p>
                  </div>
                )}

                <Input
                  label="Nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                />

                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                />

                <div>
                  <Input
                    label="Contraseña"
                    type="password"
                    placeholder="Al menos 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    }
                  />
                  <PasswordStrengthIndicator password={password} />
                </div>

                <Input
                  label="Confirmar Contraseña"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  error={confirmPassword && password !== confirmPassword ? 'Las contraseñas no coinciden' : undefined}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  }
                />

                <div className="flex items-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAcceptTerms(!acceptTerms)}
                    className={`
                      mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0
                      ${acceptTerms
                        ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] border-transparent shadow-lg shadow-[var(--color-accent-muted)]/30 animate-[checkboxPop_280ms_cubic-bezier(0.2,0.9,0.3,1.4)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50 bg-transparent'
                      }
                    `}
                  >
                    {acceptTerms && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <label className="text-sm text-[var(--color-text-secondary)] cursor-pointer leading-relaxed">
                    Acepto los{' '}
                    <Link href="/terms" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline transition-colors duration-300">
                      términos y condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link href="/privacy" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline transition-colors duration-300">
                      política de privacidad
                    </Link>
                  </label>
                </div>

                <Button type="submit" className="w-full mt-4 bg-[length:200%_200%] animate-gradient-shift shadow-[0_0_36px_rgba(168,85,247,0.45)]" size="lg" loading={loading}>
                  Crear Cuenta
                </Button>

                <div className="py-4 flex justify-center">
                  <span className="text-sm text-[var(--color-text-muted)]">
                    o continúa con
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="auth-social-btn group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[var(--color-accent-muted)]/20"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.955-5.445 3.955-3.316 0-6-2.684-6-6s2.684-6 6-6c1.66 0 3.14.569 4.237 1.498l2.31-2.311C16.503 2.924 14.697 2.239 12.545 2.239 6.706 2.239 2.079 6.866 2.079 12.405s4.627 10.166 10.466 10.166c5.839 0 10.166-4.682 10.166-10.166 0-.773-.07-1.528-.199-2.263h-.002z"/>
                    </svg>
                    <span className="text-sm text-[var(--color-text-primary)] font-medium">Google</span>
                  </button>
                  <button
                    type="button"
                    className="auth-social-btn group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[var(--color-accent-muted)]/20"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-sm text-[var(--color-text-primary)] font-medium">GitHub</span>
                  </button>
                </div>

                <p className="text-center text-sm text-[var(--color-text-secondary)] pt-2">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-semibold transition-colors duration-300 inline-flex items-center gap-1 group">
                    Iniciar Sesión
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </p>
              </form>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
