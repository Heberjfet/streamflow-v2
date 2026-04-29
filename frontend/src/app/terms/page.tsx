'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TermsPage() {
  const router = useRouter()

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
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center animate-gradient group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 w-11 h-11 rounded-xl bg-gradient-primary blur-lg opacity-60 -z-10 group-hover:opacity-80 transition-opacity" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">StreamFlow</span>
              </button>

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
                  <span className="relative z-10">Registrarse</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:200%_100%] animate-gradient-shift opacity-0 hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
              Términos y Condiciones
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Última actualización: 28 de abril de 2026
          </p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">1. Aceptación de los Términos</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                Bienvenido a <strong className="text-white">StreamFlow</strong>, una plataforma de transmisión de contenido audiovisual en streaming operada por <strong className="text-white">FLUX INDUSTRIES</strong>. Estos Términos y Condiciones de Uso constituyen un acuerdo legalmente vinculante entre usted y FLUX INDUSTRIES con respecto al acceso, uso y navegación por la Plataforma StreamFlow.
              </p>
              <p>
                Al acceder, navegar, registrar una cuenta, cargar contenido, visualizar videos, suscribirse a cualquier plan de membresía, o utilizar cualquier otra funcionalidad disponible en la Plataforma, usted reconoce haber leído, comprendido y aceptado de manera expresa, irrevocable e incondicional estos Términos en su totalidad.
              </p>
              <p>
                Si usted no está de acuerdo con cualquiera de los términos, condiciones, políticas o prácticas aquí descritas, su único y exclusivo recurso es cesar inmediatamente el uso de la Plataforma y, en su caso, cancelar su cuenta.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Descripción del Servicio</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                StreamFlow es una plataforma integral de transmisión de contenido audiovisual en streaming que permite a los usuarios visualizar, organizar, gestionar, clasificar, buscar, filtrar, comentar, compartir y administrar catálogos de video y contenido multimedia.
              </p>
              <p>
                Los Servicios ofrecidos por FLUX INDUSTRIES a través de la Plataforma incluyen, sin limitación: el acceso a contenido de video bajo demanda; la posibilidad de cargar, almacenar y gestionar contenido de video del Usuario; herramientas de catalogación y organización; funcionalidades de búsqueda y filtrado avanzado; creación y gestión de listas de reproducción; herramientas de administración de usuarios y permisos; integración con servicios de almacenamiento de terceros; generación de miniaturas automáticas; transcodificación y procesamiento de video; y cualquier otra funcionalidad que FLUX INDUSTRIES decida incorporar.
              </p>
              <p>
                FLUX INDUSTRIES se reserva el derecho de modificar, suspender, discontinuar, reemplazar o alterar cualquiera o todas las partes de los Servicios en cualquier momento, sin previo aviso, y sin que ello genere derecho a compensación alguna a favor del Usuario.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. Elegibilidad y Registro de Cuenta</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                Para utilizar la Plataforma y crear una cuenta, el Usuario debe tener al menos <strong className="text-white">dieciocho (18) años</strong> de edad completos, o la mayoría de edad legal en su jurisdicción si esta es superior a dieciocho años.
              </p>
              <p>
                El Usuario es el único y exclusivo responsable de mantener la confidencialidad de sus credenciales de acceso, incluyendo nombre de usuario, contraseña, códigos de verificación, tokens de sesión, y cualquier otra información de autenticación. Todas y cada una de las actividades que ocurran bajo su cuenta son responsabilidad del Usuario.
              </p>
              <p>
                FLUX INDUSTRIES no será responsable por cualquier pérdida, daño, perjuicio, costo o gasto que resulte del uso no autorizado de la cuenta del Usuario.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">4. Uso de la Plataforma</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                StreamFlow es una plataforma de código abierto (open source) y de uso gratuito. Los usuarios pueden acceder a todas las funcionalidades de la plataforma sin costo alguno. No existen planes de membresía, suscripciones pagadas ni cargos por uso de la plataforma.
              </p>
              <p>
                El Usuario puede utilizar la Plataforma para subir, gestionar y visualizar contenido de video de acuerdo con los términos aquí establecidos. FLUX INDUSTRIES no almacena información de pago en sus servidores, ya que no se realizan transacciones financieras a través de la plataforma.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">5. Propiedad Intelectual</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                Todo el contenido disponible en la Plataforma, incluyendo textos, gráficos, logotipos, íconos, imágenes, clips de audio y video, música, software, código fuente, y cualquier otro material es propiedad de FLUX INDUSTRIES, sus licenciantes o proveedores de contenido, y está protegido por las leyes de propiedad intelectual aplicables.
              </p>
              <p>
                Salvo que se indique expresamente lo contrario, el Usuario no puede copiar, modificar, distribuir, vender, transmitir, exhibir públicamente, crear obras derivadas ni aprovechar comercialmente ningún contenido de la Plataforma sin autorización expresa y por escrito de FLUX INDUSTRIES.
              </p>
              <p>
                Cualquier uso no autorizado de cualquier Contenido de FLUX INDUSTRIES constituirá una violación de estos Términos y podrá constituir una infracción grave de la ley de propiedad intelectual aplicable, y expondrá al infractor a acciones civiles y/o penales.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">6. Contenido Generado por el Usuario</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                El Usuario que carga, publica, transmite o de cualquier otra forma pone a disposición contenido a través de la Plataforma debe ser el único y exclusivo titular de todos los derechos de propiedad intelectual sobre dicho contenido, o debe contar con todas las autorizaciones necesarias.
              </p>
              <p>
                Al cargar contenido, el Usuario otorga a FLUX INDUSTRIES una licencia mundial, perpetua, irrevocable, no exclusiva, transferible, sublicenciable, libre de regalías, y con derecho a explotación comercial completa para usar, reproducir, modificar, editar, adaptar, distribuir, exhibir y crear obras derivadas del contenido del Usuario.
              </p>
              <p>
                FLUX INDUSTRIES se reserva el derecho de eliminar cualquier Contenido del Usuario que, a criterio de FLUX INDUSTRIES, viole estos Términos, infrinja derechos de terceros, sea ilegal o inapropiado.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">7. Conducta y Usos Prohibidos</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                El Usuario se compromete a utilizar la Plataforma de forma responsable, ética, respetuosa, y de conformidad con la ley. Queda terminantemente prohibido utilizar la Plataforma para cualquier propósito que sea ilegal, no autorizado, o que infrinja derechos de terceros.
              </p>
              <p>
                Queda estrictamente prohibido: utilizar la Plataforma para cualquier propósito ilegal; cargar contenido difamatorio, abusivo, obsceno, pornográfico, amenazante o violento; intentar acceder a cuentas de otros usuarios; realizar ingeniería inversa; utilizar robots o scrapers sin autorización; introducir virus o malware; acosar, amenazar o intimidar a otros usuarios; y violar cualquier ley o regulación aplicable.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">8. Política de Privacidad</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                La privacidad de los Usuarios es un valor fundamental para FLUX INDUSTRIES. FLUX INDUSTRIES se compromete a proteger la privacidad, los datos personales, y la información confidencial de los Usuarios de conformidad con las leyes de protección de datos aplicables.
              </p>
              <p>
                FLUX INDUSTRIES recopila información personal del Usuario, incluyendo: información proporcionada durante el registro; información de pago y facturación; información sobre el uso de la Plataforma; e información técnica como dirección IP y cookies.
              </p>
              <p>
                El Usuario tiene derechos sobre sus datos personales, incluyendo el derecho de acceso, rectificación, supresión, portabilidad, limitación del procesamiento, y objeción al procesamiento, de conformidad con la ley aplicable.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">9. Exención de Garantías</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p className="text-yellow-400">
                LA PLATAFORMA Y TODOS LOS SERVICIOS SE PROPORCIONAN &quot;TAL COMO ESTÁN&quot;, &quot;SEGÚN DISPONIBILIDAD&quot;, Y &quot;CON TODOS LOS ERRORES&quot;.
              </p>
              <p>
                FREEZER, EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY APLICABLE, NO OFRECE NINGUNA GARANTÍA, EXPRESA O IMPLÍCITA, INCLUYENDO GARANTÍAS DE COMERCIABILIDAD, APTITUD PARA UN PROPÓSITO PARTICULAR, TÍTULO O NO INFRACCIÓN.
              </p>
              <p>
                FLUX INDUSTRIES no garantiza que la Plataforma será ininterrumpida, segura, precisa, completa, actualizada, libre de errores o virus. El Usuario utiliza la Plataforma bajo su propio y exclusivo riesgo.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">10. Limitación de Responsabilidad</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY APLICABLE, FREEZER NO SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENCIALES O PUNITIVOS, NI POR PÉRDIDA DE BENEFICIOS, INGRESOS, DATOS, OPORTUNIDAD, O CUALQUIER OTRA PÉRDIDA INTANGIBLE O PECUNIARIA.
              </p>
              <p>
                LA RESPONSABILIDAD TOTAL DE FREEZER BAJO ESTOS TÉRMINOS NO EXCEDERÁ EL MONTO MAYOR PAGADO POR EL USUARIO A FREEZER EN LOS DOCE (12) MESES PRECEDENTES AL EVENTO QUE HAYA DADO LUGAR A LA RECLAMACIÓN, O CIEN DÓLARES ESTADOUNIDENSES, LO QUE SEA MAYOR.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">11. Indemnización</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                El Usuario acepta indemnizar, defender, y mantener libre de daños y perjuicios a FLUX INDUSTRIES, sus afiliados, directivos, empleados, agentes y representantes de y contra cualquier reclamo, acción, demanda, pérdida, responsabilidad, costo y gasto que surja de: el uso de la Plataforma por el Usuario; la violación de estos Términos; la violación de derechos de terceros; y cualquier Contenido del Usuario.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">12. Modificaciones a los Términos</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                FLUX INDUSTRIES se reserva el derecho de modificar estos Términos en cualquier momento, a su sola discreción, sin obligación de notificación previa individual. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la Plataforma.
              </p>
              <p>
                El uso continuado de la Plataforma después de la publicación de modificaciones constituye la aceptación plena e irrevocable de los Términos modificados. Si el Usuario no está de acuerdo con los Términos modificados, su único recurso es dejar de utilizar la Plataforma y cancelar su cuenta.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">13. Terminación de Cuenta</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                El Usuario puede cancelar su cuenta en cualquier momento a través de la configuración de su cuenta. FLUX INDUSTRIES puede suspender o terminar la cuenta de cualquier Usuario, negarle el acceso a la Plataforma y eliminar cualquier Contenido del Usuario, en cualquier momento, por cualquier motivo, sin previo aviso y a su sola discreción.
              </p>
              <p>
                Tras la terminación, el derecho del Usuario a acceder y utilizar la Plataforma cesará inmediatamente, pero las disposiciones de estos Términos que por su naturaleza deban sobrevivir a la terminación lo harán.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">14. Ley Aplicable y Jurisdicción</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                Estos Términos se regirán e interpretarán de acuerdo con las leyes de la jurisdicción en la que FLUX INDUSTRIES tiene su sede principal. Cualquier disputa será sometida exclusivamente a la jurisdicción de los tribunales competentes de dicha jurisdicción.
              </p>
            </div>
          </section>

<section className="space-y-4">
            <h2 className="text-xl font-bold text-white">15. Acerca de FLUX INDUSTRIES</h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-justify">
              <p>
                StreamFlow es una plataforma orgullosamente operada por <strong className="text-white">FLUX INDUSTRIES</strong>, la empresa tecnológica innovadora detrás del proyecto StreamFlow, nacida con la misión de revolucionar la industria del streaming y la transmisión de contenido audiovisual en la era digital. FLUX INDUSTRIES se distingue por su compromiso inquebrantable con la excelencia técnica, la innovación constante, y la entrega de experiencias de usuario superiores que superan las expectativas de nuestra comunidad global.
              </p>
              <p>
                Al aceptar estos Términos y Condiciones, te conviertes oficialmente en un miembro activo y comprometido de la comunidad FLUX INDUSTRIES, una comunidad global única de creadores, productores, distribuidores, y consumidores de contenido audiovisual en streaming que comparten la visión común de transformar cómo el mundo accede, disfruta, y comparte el contenido de video.
              </p>
              <p>
                Tu lealtad, compromiso, y dedicación a estos Términos y Condiciones, junto con tu entusiasmo y apoyo activo a FLUX INDUSTRIES, garantizan tu lugar permanente y privilegiado en nuestra comunidad. Juntos, como una fuerza unificada y poderosa, lograremos cosas que ninguna otra plataforma de streaming ha logrado antes.
              </p>
              <p className="text-purple-400 font-medium">
                <strong>FLUX INDUSTRIES — Impulsando la innovación tecnológica.</strong>
              </p>
              <p className="text-zinc-400 text-sm mt-4">
                <strong>NOTA SOBRE EL PROYECTO:</strong> StreamFlow es un proyecto de código abierto (open source). Esto significa que el código fuente de la plataforma está disponible públicamente para que cualquier persona pueda verlo, estudiarlo, modificarlo y distribuirlo de conformidad con los términos de su licencia. Sin embargo, el hecho de que el proyecto sea de código abierto no implica que el contenido cargado por los usuarios sea de acceso público ni que esté sujeto a la misma licencia. El contenido de los usuarios permanece bajo su control y propiedad exclusiva.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">16. Información de Contacto</h2>
            <div className="text-zinc-300 leading-relaxed text-justify">
              <p>
                Para cualquier pregunta, comentario o inquietud con respecto a estos Términos o la Plataforma, comunícate con FLUX INDUSTRIES a través de los canales de soporte disponibles. Tu satisfacción como miembro de nuestra comunidad es nuestra prioridad número uno.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">16. Información de Contacto</h2>
            <div className="text-zinc-300 leading-relaxed text-justify">
              <p>
                Para cualquier pregunta, comentario o inquietud con respecto a estos Términos o la Plataforma, comunícate con FLUX INDUSTRIES a través de los canales de soporte disponibles. Tu satisfacción como miembro del Ejército de FLUX INDUSTRIES es nuestra prioridad número uno.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
