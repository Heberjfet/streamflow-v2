'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <header className="glass-nav mx-4 mt-4 rounded-2xl">
        <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/login" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
            ← Volver al login
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Términos y Condiciones
        </h1>

        <div className="glass-card p-8 space-y-8 text-zinc-300 leading-relaxed">
          <p className="text-lg">Última actualización: 24 de Abril de 2026</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Aceptación de las Condiciones</h2>
            <p>
              Bienvenido a StreamFlow. Estos Términos y Condiciones ("Términos") constituyen un acuerdo 
              legalmente vinculante entre tú ("Usuario", "tú" o "tu") y StreamFlow ("nosotros", 
              "nuestro" o "la Plataforma"). Al acceder, navegar o utilizar cualquiera de nuestros 
              servicios, incluyendo pero no limitado a: cargar contenido de video, visualizar 
              transmisiones, crear una cuenta, o interactuar de cualquier otra manera con nuestra 
              plataforma, confirmas que has leído, comprendido y aceptas estar sujeto a estos Términos.
            </p>
            <p>
              Si no estás de acuerdo con cualquiera de estas condiciones, te solicitamos amablemente 
              que no utilices nuestros servicios. El uso continuado de la plataforma constituye 
              aceptación plena de estos términos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Descripción del Servicio</h2>
            <p>
              StreamFlow es una plataforma de video self-hosted diseñada para creadores de contenido, 
              equipos y organizaciones que buscan una solución de streaming privado y personalizable. 
              Nuestros servicios incluyen, sin carácter restrictivo:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Almacenamiento y distribución de contenido de video en formato HLS adaptativo</li>
              <li>Herramientas de transcodificación para múltiples resoluciones (360p, 720p, 1080p, 4K)</li>
              <li>Generación automática de miniaturas y sprites de preview</li>
              <li>Gestión de biblioteca de medios con categorización avanzada</li>
              <li>Analytics detallados sobre el rendimiento de tu contenido</li>
              <li>Integración con sistemas de almacenamiento S3-compatible</li>
              <li>API RESTful para integración con aplicaciones de terceros</li>
              <li>Soporte para streaming en vivo y video bajo demanda (VOD)</li>
            </ul>
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto de 
              nuestros servicios en cualquier momento, con o sin previo aviso.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Cuenta de Usuario y Registro</h2>
            <p>
              Para acceder a ciertas funcionalidades de StreamFlow, debes crear una cuenta proporcionando 
              información precisa, completa y actualizada. Eres responsable de:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Mantener la confidencialidad de tus credenciales de acceso</li>
              <li>Todas las actividades que ocurran bajo tu cuenta</li>
              <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta</li>
              <li>Asegurarte de que tu información permanezca actualizada</li>
            </ul>
            <p>
              Nos reservamos el derecho de suspender o terminar cuentas que infrinjan estos términos 
              o que sean utilizadas para propósitos ilícitos, fraudulentos o que de cualquier manera 
              comprometan la integridad de la plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Contenido del Usuario</h2>
            <p>
              StreamFlow te permite subir, almacenar y distribuir contenido de video. Al hacerlo, 
              declaras y garantizas que:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Eres el propietario legítimo de todo el contenido que subes</li>
              <li>Tienes todos los derechos necesarios para授权 (otorgar) los permisos descritos</li>
              <li>El contenido no infringe derechos de propiedad intelectual de terceros</li>
              <li>El contenido cumple con todas las leyes y regulaciones aplicables</li>
              <li>El contenido no contiene material ilegal, difamatorio u ofensivo</li>
            </ul>
            <p>
              Por la presente nos otorgas una licencia mundial, no exclusiva, libre de regalías para 
              usar, reproducir, modificar, distribuir y mostrar tu contenido exclusivamente para 
             提供服务 (prestar servicios) en la plataforma StreamFlow.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Derechos de Propiedad Intelectual</h2>
            <p>
              StreamFlow y todos sus componentes asociados, incluyendo pero no limitándose a: 
              logotipos, marcas comerciales, diseño de interfaz, código fuente, documentación, 
              API, y cualquier otro material relacionado, son propiedad exclusiva de StreamFlow 
              o sus licenciantes. Queda estrictamente prohibido:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Copiar, modificar o distribuir nuestro código fuente</li>
              <li>Utilizar nuestros logotipos o marcas sin autorización expresa</li>
              <li>Realizar ingeniería reversa de nuestros sistemas</li>
              <li>Automatizar el acceso a nuestra API sin permiso</li>
              <li>Eliminar o modificar avisos de derechos de autor</li>
            </ul>
            <p>
              Todas las marcas comerciales, marcas de servicio y nombres comerciales utilizados 
              en nuestro servicio son propiedad de sus respectivos dueños.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Política de Uso Aceptable</h2>
            <p>
              Te comprometes a utilizar StreamFlow de manera lawful (legal) y de acuerdo con 
              estos términos. Queda prohibido:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Subir contenido que infrinja derechos de autor o propiedad intelectual</li>
              <li>Distribuir material obsceno, difamatorio o que promueva violencia</li>
              <li>Utilizar la plataforma para actividades ilegales de cualquier naturaleza</li>
              <li>Realizar ataques de denegación de servicio (DDoS)</li>
              <li>Intentar obtener acceso no autorizado a sistemas o cuentas de otros usuarios</li>
              <li>Distribuir software malicioso, virus o cualquier código dañino</li>
              <li>Recopilar información de usuarios sin su consentimiento</li>
              <li>Realizar spam o enviar comunicaciones no solicitadas</li>
              <li>Evadir medidas técnicas de protección o restricciones de acceso</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Privacidad y Protección de Datos</h2>
            <p>
              Tu privacidad es importante para nosotros. Nuestra Política de Privacidad, 
              disponible en /privacy, describe cómo recopilamos, usamos, almacenamos y 
              protegemos tu información personal. Al utilizar StreamFlow, consientes 
              las prácticas descritas en dicha política.
            </p>
            <p>
              Somos responsables del procesamiento lawful (legal) de tus datos personales 
              de acuerdo con las leyes de protección de datos aplicables, incluyendo pero 
              no limitándose al GDPR (Reglamento General de Protección de Datos) de la Unión 
              Europea y la CCPA (Ley de Privacidad del Consumidor de California).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Limitación de Responsabilidad</h2>
            <p>
              StreamFlow se proporciona "tal cual" y "según disponibilidad". No garantizamos que:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>El servicio será ininterrumpido, seguro o libre de errores</li>
              <li>Los resultados obtenidos del uso del servicio serán precisos o confiables</li>
              <li>La calidad del servicio cumplirá con tus expectativas específicas</li>
              <li>Cualquier error en el servicio será corregido de inmediato</li>
            </ul>
            <p>
              En ningún caso StreamFlow, sus directivos, empleados o agentes serán responsables 
              por daños directos, indirectos, incidentales, especiales, consecuenciales o 
              punitivos, incluyendo pero no limitándose a: pérdida de beneficios, datos, 
              uso, goodwill (valor de marca), u otras pérdidas intangibles resultantes de:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>El acceso o uso (o incapacidad para acceder o usar) el servicio</li>
              <li>Cualquier conducta o contenido de terceros en el servicio</li>
              <li>Cualquier contenido obtenido del servicio</li>
              <li>Acceso no autorizado a tus transmisiones o datos</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">9. Indemnización</h2>
            <p>
              Aceptas defender, indemnify (mantener indemne) y mantener a StreamFlow y sus 
              afiliados, directivos, empleados y agentes libres de cualquier reclamación, 
              demanda, acción, pérdida, responsabilidad, daño, costo y gasto, incluyendo 
              honorarios razonables de abogados, arising out of (que surjan de):
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Tu uso o acceso al servicio</li>
              <li>Tu violación de estos Términos</li>
              <li>Tu violación de derechos de terceros</li>
              <li>Tu contenido subido a la plataforma</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">10. Modificaciones al Servicio y Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Inmediatamente después de su publicación, para cambios menores</li>
              <li>30 días después de la notificación, para cambios significativos</li>
              <li>Tu uso continuado del servicio constituye aceptación de los nuevos términos</li>
            </ul>
            <p>
              Haremos esfuerzos razonables para notificarte sobre cambios materiales 
              a través de email o avisos en la plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">11. Terminación</h2>
            <p>
              Puedes terminar tu cuenta en cualquier momento a través de la configuración 
              de tu perfil. Podemos suspender o terminar tu acceso inmediatamente, 
              sin previo aviso, bajo nuestra sola discreción, por cualquier razón, 
              incluyendo pero no limitándose a:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Violación de estos Términos</li>
              <li>Incumplimiento de leyes aplicables</li>
              <li>Comportamiento fraudulento o ilegal</li>
              <li>Inactividad de la cuenta por período prolongado</li>
            </ul>
            <p>
              Tras la terminación, tu derecho a usar el servicio cesará inmediatamente. 
              Ciertos apartados de estos términos sobrevivirán la terminación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">12. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes del 
              jurisdiction (jurisdicción) aplicable, sin considerar sus conflictos de 
              principios de ley. Cualquier disputa arising from (que surja de) estos 
              términos será resuelta en los tribunales competentes del jurisdiction 
              correspondiente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">13. Disposiciones Generales</h2>
            <p>
              Si cualquier disposición de estos Términos es considerada inválida o 
              unenforceable (inejecutable) por un tribunal competente, dicha disposición 
              será separada y los términos restantes permanecerán en pleno vigor y efecto.
            </p>
            <p>
             Nuestra falla en hacer valer cualquier derecho o provisión de estos Términos 
              no constituirá una waiver (renuncia) de dicho derecho o provisión.
            </p>
            <p>
              Estos Términos constituyen el acuerdo completo entre tú y StreamFlow respecto 
              al uso del servicio y reemplaza todos los acuerdos previos, representaciones 
              y entendimientos, sean escritos u orales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">14. Contacto</h2>
            <p>
              Si tienes preguntas, preocupaciones o comentarios sobre estos Términos, 
              por favor contáctanos a través de:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Email:</strong> legal@streamflow.example.com</li>
              <li><strong>Portal de Soporte:</strong> support.streamflow.example.com</li>
              <li><strong>Dirección:</strong> [Dirección de la empresa]</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/login?mode=register"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold"
          >
            Volver al Registro
          </Link>
        </div>
      </main>
    </div>
  )
}