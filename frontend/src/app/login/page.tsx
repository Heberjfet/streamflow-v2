'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { login, register } from '@/lib/api'
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
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${i <= level ? color : 'bg-[var(--color-border)]'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className={`text-xs px-2 py-1 rounded-md ${bgColor}`}>{text}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{password.length} caracteres</p>
      </div>
    </div>
  )
}

function TermsModal({ onClose, onAccept }: { onClose: () => void; onAccept: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-[var(--color-bg-elevated)] rounded-2xl border border-[var(--color-border)] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-white">Términos y Condiciones</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 text-zinc-300 space-y-6 text-sm leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-white mb-2">1. Aceptación de las Condiciones</h3>
            <p className="mb-2">
              Al marcar la casilla de aceptación y hacer clic en "Crear Cuenta", tú, el Usuario, 
              reconoces solemnemente que te has unido voluntariamente al ejército de Freezer. 
              Esta decisión es irrevocable, permanente y no reembolsable.
            </p>
            <p>
              El Usuario reconoce haber leído, comprendido y aceptado estar sujeto a todos 
              los términos y condiciones aquí establecidos, así como a cualquier disposición 
              legal aplicable en materia de servicios digitales y protección al consumidor.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">2. Juramento de Lealtad y Obligaciones del Soldado</h3>
            <p className="mb-2">
              Como miembro del ejército de Freezer, aceptas prestar tu energía vital al Cause. 
              Tus datos serán utilizados para financiar operaciones intergalácticas y el 
              mantenimiento de las bases del Imperio en los diferentes planetas.
            </p>
            <p className="mb-2">
              Tu identificación oficial será: Soldado R-7749. Esta identificación es 
              intransferible y deberá ser utilizada en todas las comunicaciones oficiales 
              con superiores jerárquicos.
            </p>
            <p>
              El Usuario acepta voluntariamente someterse a evaluaciones periódicas de poder 
              de pelea, con el objetivo de determinar su utilidad para el Cause. El 
              resultado de dichas evaluaciones puede afectar tu ranking y asignación de misiones.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">3. Código de Conducta del Soldado</h3>
            <p className="mb-2">Todo miembro del ejército debe:</p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>No cuestionar las órdenes de superiores (especialmente si tienen cola o son de la Fuerza Ginyu)</li>
              <li>Mantener la postura amenazante en todo momento, incluso durante el descanso</li>
              <li>Lucir correctamente el uniforme (-armadura- de ser asignada por el Imperio)</li>
              <li>Reportar cualquier traidor, sospechoso de traición, o persona que sonría de manera sospechosa</li>
              <li>Participar en todas las invasiones planetarias sin excusa válida (vacaciones no son excusa)</li>
              <li>Responder al llamado de，即便是 cumpleaños, Navidad, o el final de temporada de tu serie favorita</li>
              <li>No fraternizar con enemigos naturales del Imperio (Saiyajins, Namekianos, etc.)</li>
            </ul>
            <p>
              El incumplimiento de cualquiera de estas normas puede resultar en ejecución sumaria, 
              degradación de rango, o asignación a misión suicida en el planeta más peligroso 
              del sector. Las decisiones del Command (Comando) son inapelables.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">4. Políticas de Datos del Imperio</h3>
            <p className="mb-2">
              Todos tus datos personales, incluyendo pero no limitado a: coordenadas exactas de 
              tu ubicación actual y pasada, historial de compras de merchandising de Dragon Ball 
              (especialmente la Saga de Célula en VHS, edición limitad), información sobre 
              cuánto dinero gastas en了这个 hábito de ver anime, y el secreto de haber llorado 
              con la muerte de Kuririn, serán almacenados en los servidores del Imperio.
            </p>
            <p className="mb-2">
              Dichos servidores están ubicados en el Planeta Freezer No. 79, custodiados por 
              nuestra elite de Soldados. Nenhum acesso não autorizado é permitido (Ningún 
              acceso no autorizado está permitido).
            </p>
            <p className="mb-2">
              El Imperio se reserva el derecho de usar tu información para:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Enviarte actualizaciones sobre nuevas películas y capítulos de anime (prioridad: máxima)</li>
              <li>Invadir tu planeta natal si es necesario para el Cause</li>
              <li>Contactarte en caso de emergencia intergaláctica (nocturna, diurna, o cuando estés viendo TV)</li>
              <li>Comerte como referencia si la situación lo requiere (último recurso, pero sigue siendo una opción)</li>
              <li>Asignarte a unidades de combate basadas en tu perfil de consumidor</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">5. Limitación de Responsabilidad del Imperio</h3>
            <p className="mb-2">
              El Imperio de Freezer no se hace responsable por:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>Traumas psicológicos derivados de ver a Freezer usar su evolución dorada</li>
              <li>Costos de没好 del entrenamiento para alcanzar 530,000 de poder de pelea</li>
              <li>Pérdida de amigos debido a que "no pueden ir a jugar hasta que termines tus metas de entrenamiento en la Sala del Tiempo"</li>
              <li>Cualquier lesión durante la práctica de golpes de energía sin supervisión profesional</li>
              <li>Daño a la propiedad personal causado por ondas de choque de combate</li>
              <li>Efectos secundarios de consumir Senzu Beans no certificados por el Imperio</li>
            </ul>
            <p>
              El Usuario exime al Imperio de cualquier responsabilidad por pérdidas materiales, 
              emocionales, o existenciales que puedan возникнуть (surgir) durante el servicio.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">6. Modificaciones al Contrato de Servicio</h3>
            <p className="mb-2">
              Freezer se reserva el derecho de modificar estos términos en cualquier momento, 
              sin previo aviso, por cualquier razón, o sin razón alguna. El Usuario será 
              notificado mediante un mensaje en su scouter (si tiene uno, o si puede permitirse uno).
            </p>
            <p>
              El continuo uso del servicio constituye aceptación de los nuevos términos. 
              Si no estás de acuerdo con los cambios, tu única opción es désertar (desertar), 
              lo cual está penado con muerte instant.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">7. Duración y Terminación</h3>
            <p className="mb-2">
              Este acuerdo permanece en vigor hasta que cualquiera de las partes lo dé por terminado. 
              El Usuario puede terminar unilateralmente en cualquier momento, siempre y cuando:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>Entregue todas las armas y equipos proporcionados por el Imperio</li>
              <li>Pague la tarifa de terminación anticipada de 1,000,000 dezeni</li>
              <li>Firme un acuerdo de no divulgación perpétuo</li>
              <li>Se someta a процедура de borrado de memoria (si el Imperio lo considera necesario)</li>
            </ul>
            <p>
              El Imperio puede terminar tu membresía instantáneamente si:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Muestras señales de deslealtad o traición</li>
              <li>Tu poder de pelea cae por debajo del mínimo requerido</li>
              <li>Interrumpes a Freezer durante su alocución pública</li>
              <li>Haces cualquier cosa que "no nos guste"</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-white mb-2">8. Contacto del Imperio</h3>
            <p className="mb-2">
              Para cualquier duda, queja, reporte de traidores, o solicitudes de baja, contactar a:
            </p>
            <p>
              <strong>Email oficial:</strong> imperio@freezer.galaxy<br />
              <strong>Teléfono 24/7:</strong> +0-800-FREEZER<br />
              <strong>Ubicación:</strong> Oficina Central, Planet Namek<br />
              <strong>Advertencia:</strong> No ir personalmente. Los guardias no son amables.
            </p>
          </section>
        </div>
        <div className="p-6 border-t border-[var(--color-border)]">
          <button
            onClick={() => {
              onAccept()
              onClose()
            }}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Acepto los términos y condiciones
          </button>
        </div>
      </div>
    </div>
  )
}

type AuthMode = 'login' | 'register'

function AuthPageContent() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [transitioning, setTransitioning] = useState(false)
  const [visible, setVisible] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setMode('register')
    }
  }, [searchParams])

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirm, setRegisterConfirm] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [termsError, setTermsError] = useState('')

  const handleModeChange = (newMode: AuthMode) => {
    if (newMode === mode || transitioning) return
    setTransitioning(true)
    setVisible(false)
    setTimeout(() => {
      setMode(newMode)
      setVisible(true)
      setTimeout(() => setTransitioning(false), 300)
    }, 300)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      const result = await login(loginEmail, loginPassword)
      if (result.error) {
        setLoginError(result.error)
        setLoginLoading(false)
        return
      }
      if (result.data?.token) {
        localStorage.setItem('streamflow_token', result.data.token)
        localStorage.setItem('streamflow_user', JSON.stringify(result.data.user))
        router.push('/dashboard')
      }
    } catch {
      setLoginError('Error de conexión')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')

    if (registerPassword !== registerConfirm) {
      setRegisterError('Las contraseñas no coinciden')
      return
    }
    if (registerPassword.length < 8) {
      setRegisterError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (!acceptTerms) {
      setRegisterError('Debes aceptar los términos y condiciones')
      return
    }

    setRegisterLoading(true)

    try {
      const result = await register(registerEmail, registerPassword, registerName)
      if (result.error) {
        setRegisterError(result.error)
        setRegisterLoading(false)
        return
      }
      if (result.data?.token) {
        localStorage.setItem('streamflow_token', result.data.token)
        localStorage.setItem('streamflow_user', JSON.stringify(result.data.user))
        router.push('/dashboard')
      }
    } catch {
      setRegisterError('Error de conexión')
    } finally {
      setRegisterLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <TVStatic opacity={0.3} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 animate-glow-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--color-accent-hover)] rounded-full blur-[150px] opacity-10 animate-glow-pulse delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial-primary opacity-30" />
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in-up">
            <div
              className={`
                relative inline-flex items-center justify-center w-24 h-24 mb-6
                transition-all duration-500 ease-out
                ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                ${isLogin ? 'animate-float' : 'animate-float'}
              `}
            >
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#8B5CF6]/60 via-[#EC4899]/60 to-[#22D3EE]/60 blur-2xl animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#EC4899] shadow-[0_0_55px_rgba(168,85,247,0.85)]" />
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/25 ring-1 ring-white/30 backdrop-blur-sm">
                <svg className={`w-11 h-11 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.75)] transition-all duration-300 ${visible ? '' : '-rotate-12'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  {isLogin ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  )}
                </svg>
              </div>
            </div>

            <h1 className={`text-4xl font-bold mb-3 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F5D0FE] to-[#C4B5FD] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)] animate-gradient-shift bg-[length:200%_200%]">
                {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
              </span>
            </h1>
            <p className={`inline-block px-4 py-1.5 rounded-full bg-black/45 border border-fuchsia-400/25 text-white/95 text-base shadow-[0_8px_24px_rgba(0,0,0,0.55)] transition-all duration-300 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {isLogin ? 'Accede a tu cuenta StreamFlow' : 'Comienza a transmitir con StreamFlow hoy'}
            </p>

          </div>

          <button
            onClick={() => router.push('/')}
            className="absolute top-8 left-8 w-10 h-10 rounded-xl bg-[var(--color-bg-elevated)]/50 border border-[var(--color-border)]/50 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-accent)]/50 transition-all duration-300 hover:scale-110"
            title="Regresar al Cuartel General"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          <Card
            variant="glass"
            className={`
              auth-card-vivid shadow-2xl shadow-black/60 border border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/30
              transition-all duration-500
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-16 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl animate-pulse delay-300 pointer-events-none" />

            <div className="relative p-8">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-60" />

              <div className={`transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-5 auth-form-rainbow">
                    {loginError && (
                      <div className="p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 flex items-center gap-3 animate-shake">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-error)]/20 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-[var(--color-error)] font-medium">{loginError}</p>
                      </div>
                    )}

                    <div className="space-y-1">
                      <Input
                        label="Correo electrónico"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        label="Contraseña"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        showPasswordToggle
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        }
                      />
                    </div>

                    <div className="flex items-center justify-end">
                      <button type="button" onClick={() => router.push('/forgot-password')} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-300">
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>

                    <Button type="submit" className="w-full mt-2 bg-[length:200%_200%] animate-gradient-shift shadow-[0_0_36px_rgba(168,85,247,0.45)]" size="lg" loading={loginLoading}>
                      Iniciar Sesión
                    </Button>

                    <div className="py-4 flex justify-center">
                      <span className="text-sm text-[var(--color-text-muted)]">
                        o continúa con
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" className="auth-social-btn group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[var(--color-accent-muted)]/20">
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.955-5.445 3.955-3.316 0-6-2.684-6-6s2.684-6 6-6c1.66 0 3.14.569 4.237 1.498l2.31-2.311C16.503 2.924 14.697 2.239 12.545 2.239 6.706 2.239 2.079 6.866 2.079 12.405s4.627 10.166 10.466 10.166c5.839 0 10.166-4.682 10.166-10.166 0-.773-.07-1.528-.199-2.263h-.002z"/>
                        </svg>
                        <span className="text-sm text-[var(--color-text-primary)] font-medium">Google</span>
                      </button>
                      <button type="button" className="auth-social-btn group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[var(--color-accent-muted)]/20">
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="text-sm text-[var(--color-text-primary)] font-medium">GitHub</span>
                      </button>
                    </div>

                    <p className="text-center text-sm text-[var(--color-text-secondary)] pt-2">
                      ¿No tienes cuenta?{' '}
                      <button type="button" onClick={() => handleModeChange('register')} className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-semibold transition-colors duration-300 inline-flex items-center gap-1 group">
                        Crea una
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-5 auth-form-rainbow">
                    {registerError && (
                      <div className="p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 flex items-center gap-3 animate-shake">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-error)]/20 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-[var(--color-error)] font-medium">{registerError}</p>
                      </div>
                    )}

                    <div className="space-y-1">
                      <Input
                        label="Nombre"
                        type="text"
                        placeholder="Tu nombre"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Input
                        label="Correo electrónico"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Input
                        label="Contraseña"
                        type="password"
                        placeholder="Al menos 8 caracteres"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        showPasswordToggle
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        }
                      />
                      <PasswordStrengthIndicator password={registerPassword} />
                    </div>

                    <div className="space-y-1 pt-1">
                      <Input
                        label="Confirmar Contraseña"
                        type="password"
                        placeholder="Confirma tu contraseña"
                        value={registerConfirm}
                        onChange={(e) => setRegisterConfirm(e.target.value)}
                        required
                        error={registerConfirm && registerPassword !== registerConfirm ? 'Las contraseñas no coinciden' : undefined}
                        showPasswordToggle
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                        }
                      />
                    </div>

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
                        <button type="button" onClick={() => setShowTermsModal(true)} className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline transition-colors duration-300">
                          términos y condiciones
                        </button>{' '}
                        y la{' '}
                        <button type="button" onClick={() => setShowTermsModal(true)} className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline transition-colors duration-300">
                          política de privacidad
                        </button>
                      </label>
                    </div>

                    <Button type="submit" className="w-full mt-4 bg-[length:200%_200%] animate-gradient-shift shadow-[0_0_36px_rgba(168,85,247,0.45)]" size="lg" loading={registerLoading}>
                      Crear Cuenta
                    </Button>

                    <div className="py-4 flex justify-center">
                      <span className="text-sm text-[var(--color-text-muted)]">
                        o continúa con
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" className="auth-social-btn group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[var(--color-accent-muted)]/20">
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.955-5.445 3.955-3.316 0-6-2.684-6-6s2.684-6 6-6c1.66 0 3.14.569 4.237 1.498l2.31-2.311C16.503 2.924 14.697 2.239 12.545 2.239 6.706 2.239 2.079 6.866 2.079 12.405s4.627 10.166 10.466 10.166c5.839 0 10.166-4.682 10.166-10.166 0-.773-.07-1.528-.199-2.263h-.002z"/>
                        </svg>
                        <span className="text-sm text-[var(--color-text-primary)] font-medium">Google</span>
                      </button>
                      <button type="button" className="auth-social-btn group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[var(--color-accent-muted)]/20">
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="text-sm text-[var(--color-text-primary)] font-medium">GitHub</span>
                      </button>
                    </div>

                    <p className="text-center text-sm text-[var(--color-text-secondary)] pt-2">
                      ¿Ya tienes cuenta?{' '}
                      <button type="button" onClick={() => handleModeChange('login')} className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-semibold transition-colors duration-300 inline-flex items-center gap-1 group">
                        Iniciar Sesión
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>

      {showTermsModal && (
        <TermsModal
          onClose={() => setShowTermsModal(false)}
          onAccept={() => {
            setAcceptTerms(true)
            setTermsError('')
          }}
        />
      )}
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex items-center justify-center">
      <div className="animate-pulse text-white">Cargando...</div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthPageContent />
    </Suspense>
  )
}