'use client'

import Link from 'next/link'

export default function PrivacyPage() {
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
          Política de Privacidad
        </h1>

        <div className="glass-card p-8 space-y-8 text-zinc-300 leading-relaxed">
          <p className="text-lg">Última actualización: 24 de Abril de 2026</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Introducción</h2>
            <p>
              En StreamFlow ("nosotros", "nuestro" o "la Plataforma"), respetamos tu privacidad y 
              nos comprometemos a proteger tus datos personales. Esta Política de Privacidad 
              explica cómo recopilamos, usamos, almacenamos, transferimos y protegemos tu 
              información cuando utilizas nuestros servicios.
            </p>
            <p>
              Esta política se aplica a todos los usuarios de StreamFlow, incluyendo aquellos 
              que simplemente navegan por la plataforma sin crear una cuenta. Al utilizar 
              nuestros servicios, aceptas las prácticas descritas en este documento.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Información que Recopilamos</h2>
            <p>
              Recopilamos diferentes tipos de información para proporcionar y mejorar 
              nuestros servicios. Esta información puede incluir:
            </p>
            
            <h3 className="text-xl font-semibold text-white mt-4">2.1 Información que Proporcionas Directamente</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Datos de registro:</strong> Nombre, dirección de email, contraseña hasheada, 
              y cualquier información adicional que decidas proporcionarnos durante el registro</li>
              <li><strong>Información de perfil:</strong> Fotografía de perfil, biografía, enlaces 
              a redes sociales, y otras preferencias de usuario</li>
              <li><strong>Contenido generado por el usuario:</strong> Videos subidos, miniaturas, 
              títulos, descripciones, categorizaciones y metadatos asociados</li>
              <li><strong>Comunicaciones:</strong> Información que proporcionas al contactar nuestro 
              soporte, participar en encuestas, o comunicarte con otros usuarios</li>
              <li><strong>Datos de transacciones:</strong> Información relacionada con pagos, 
              aunque no almacenamos datos de tarjetas de crédito directamente</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">2.2 Información Recopilada Automáticamente</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Datos de uso:</strong> Páginas visitadas, tiempo pasado en cada página, 
              clicks realizados, y patrones de navegación</li>
              <li><strong>Información del dispositivo:</strong> Tipo de navegador, sistema operativo, 
              dirección IP, identificadores de dispositivo, y tipo de conexión</li>
              <li><strong>Datos de streaming:</strong> Calidad de video seleccionada, resolución, 
              bitrate, tiempo de buffering, y métricas de reproducción</li>
              <li><strong>Logs del servidor:</strong> Requests realizados, timestamps, status codes, 
              y datos de error para diagnóstico y mejora del servicio</li>
              <li><strong>Cookies y tecnologías similares:</strong> Como se describe en la Sección 6</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">2.3 Información de Terceros</h3>
            <p>
              Podemos recibir información sobre ti de terceros, incluyendo proveedores de análisis, 
              redes publicitarias, y servicios de autenticación OAuth (como Google o GitHub 
              si eliges usar estos métodos de registro).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Cómo Usamos tu Información</h2>
            <p>
              Utilizamos la información recopilada para los siguientes propósitos:
            </p>
            
            <h3 className="text-xl font-semibold text-white mt-4">3.1 Provisión del Servicio</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Crear y gestionar tu cuenta de usuario</li>
              <li>Procesar y almacenar tu contenido de video</li>
              <li>Transcodificar videos a múltiples resoluciones y formatos</li>
              <li>Generar y mostrar miniaturas y sprites de preview</li>
              <li>Distribuir tu contenido a través de nuestro sistema de streaming</li>
              <li>Permitirte visualizar y gestionar tu biblioteca de contenido</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">3.2 Mejora y Personalización</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Analizar patrones de uso para mejorar la experiencia del usuario</li>
              <li>Personalizar recomendaciones de contenido basado en tu historial</li>
              <li>Desarrollar nuevas funcionalidades y mejorar las existentes</li>
              <li>Optimizar el rendimiento del streaming adaptativo</li>
              <li>Realizar pruebas A/B para validar cambios en la interfaz</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">3.3 Seguridad y Cumplimiento</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Detectar y prevenir accesos no autorizados a cuentas</li>
              <li>Identificar y bloquear actividades maliciosas o fraudulentas</li>
              <li>Monitorear el cumplimiento de nuestros Términos de Servicio</li>
              <li>Responder a solicitudes legales válidas de autoridades</li>
              <li>Proteger la integridad de nuestra plataforma y usuarios</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">3.4 Comunicación</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Enviar notificaciones relacionadas con tu cuenta y contenido</li>
              <li>Proporcionar soporte técnico y responder consultas</li>
              <li>Enviar actualizaciones de servicio y anuncios importantes</li>
              <li>Marketing directo (solo con tu consentimiento explícito)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Base Legal para el Procesamiento</h2>
            <p>
              Procesamos tus datos personales bajo las siguientes bases legales, 
              conforme al GDPR y otras regulaciones aplicables:
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">4.1 Ejecución de Contrato</h3>
            <p>
              El procesamiento de ciertos datos es necesario para ejecutar el contrato 
              de servicios contigo. Por ejemplo: procesar tu login, almacenar tu 
              contenido, y proporcionarte acceso a funcionalidades de la plataforma.
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">4.2 Intereses Legítimos</h3>
            <p>
              Podemos procesar datos cuando sea necesario para nuestros intereses legítimos 
              o los de un tercero, siempre que estos intereses no prevalezcan sobre tus 
              derechos. Por ejemplo: prevención de fraude, seguridad de la red, 
              y mejoras del servicio.
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">4.3 Consentimiento</h3>
            <p>
              Para ciertos procesamientos, solicitamos tu consentimiento explícito. 
              Puedes retirar este consentimiento en cualquier momento contactándonos.
              Por ejemplo: marketing directo, cookies no esenciales.
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">4.4 Cumplimiento Legal</h3>
            <p>
              Podemos procesar datos cuando sea necesario para cumplir con obligaciones 
              legales a las que estamos sujetos, como requerimientos de retención de datos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Compartir y Transferir Información</h2>
            
            <h3 className="text-xl font-semibold text-white mt-4">5.1 Compartimos Con</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar, 
              incluyendo: servicios de cloud hosting (almacenamiento en la nube), 
              procesamiento de pagos, análisis de datos, servicio al cliente, 
              y herramientas de email marketing</li>
              <li><strong>Autoridades legales:</strong> Cuando sea requerido por ley o necesario 
              para proteger nuestros derechos, privacy (privacidad), seguridad o propiedad</li>
              <li><strong>Socios comerciales:</strong> Con tu consentimiento, podemos compartir 
              información con socios para ofrecerte integraciones o servicios conjuntamente</li>
              <li><strong>Adquisiciones potenciales:</strong> En caso de fusión, adquisición, 
              o venta de activos, tu información puede ser transferida como parte del negocio</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">5.2 No Compartimos</h3>
            <p>
              No vendemos, alquilamos ni intercambiamos tus datos personales con fines 
              de marketing con terceros sin tu consentimiento.
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">5.3 Transferencias Internacionales</h3>
            <p>
              Tu información puede ser transferida y procesada en países fuera del tuyo. 
              Cuando transferimos datos internacionalmente, implementamos medidas de 
              seguridad apropiadas, incluyendo:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Cláusulas contractuales estándar aprobadas</li>
              <li>Decisiones de adecuación de la Comisión Europea</li>
              <li>Certificaciones y códigos de conducta aplicables</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Cookies y Tecnologías de Rastreo</h2>
            
            <h3 className="text-xl font-semibold text-white mt-4">6.1 Qué Son las Cookies</h3>
            <p>
              Las cookies son pequeños archivos de texto almacenados en tu dispositivo cuando 
              visitas un sitio web. Nosotros usamos cookies y tecnologías similares 
              (localStorage, sessionStorage, pixels, web beacons) para recopilar 
              y almacenar información.
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">6.2 Tipos de Cookies que Usamos</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Cookies esenciales:</strong> Requeridas para que el sitio funcione 
              correctamente. No pueden ser desactivadas. Incluyen: autenticación, 
              seguridad, sesión, y preferencias básicas</li>
              <li><strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo los 
              visitantes interactúan con nuestro sitio, proporcionándonos información 
              sobre áreas visitadas y errores encontrados</li>
              <li><strong>Cookies de funcionalidad:</strong> Permiten recordar tus 
              preferencias y elecciones (como idioma o región) para una experiencia 
              más personalizada</li>
              <li><strong>Cookies de targeting/publicidad:</strong> Usadas para mostrarte 
              anuncios relevantes y medir la efectividad de campañas. Estas cookies 
              requieren tu consentimiento</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">6.3 Gestión de Cookies</h3>
            <p>
              Puedes controlar las cookies a través de:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Nuestro banner de cookies al visitar el sitio</li>
              <li>Configuración de tu navegador para bloquear o eliminar cookies</li>
              <li>Configuración de tu cuenta (disponible para ciertas preferencias)</li>
            </ul>
            <p>
              Ten en cuenta que bloquear cookies esenciales puede afectar la 
              functionality (funcionalidad) del sitio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Retención de Datos</h2>
            <p>
              Conservamos tu información personal solo durante el tiempo necesario para 
              los propósitos descritos en esta política. Los criterios para determinar 
              el período de retención incluyen:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>La duración de tu relación contractual con nosotros</li>
              <li>Requisitos legales de retención (ej: regulaciones fiscales, antifraude)</li>
              <li>El tiempo necesario para resolver disputas o litigios</li>
              <li>Patrocinio de retención de datos por razones de seguridad</li>
            </ul>
            <p>
              Como referencia general:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Datos de cuenta:</strong> Conservados mientras la cuenta esté activa</li>
              <li><strong>Contenido de video:</strong> Retenido mientras tu cuenta esté activa</li>
              <li><strong>Logs de acceso:</strong> Conservados por 90 días</li>
              <li><strong>Información de marketing:</strong> Eliminada si retiras tu consentimiento</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Tus Derechos</h2>
            <p>
              Tienes varios derechos respecto a tu información personal. Puedes 
              ejercer estos derechos contactándonos a través de los canales indicados:
            </p>

            <h3 className="text-xl font-semibold text-white mt-4">8.1 Derechos bajo GDPR (Usuarios EEA)</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Derecho de acceso:</strong> Obtener una copia de tus datos personales</li>
              <li><strong>Derecho de rectificación:</strong> Corregir información inexacta o incompleta</li>
              <li><strong>Derecho de erasure (borrado):</strong> Solicitar la eliminación de tus datos 
              ("derecho al olvido"), sujeto a ciertas excepciones</li>
              <li><strong>Derecho de restricción:</strong> Limitar el procesamiento de tus datos</li>
              <li><strong>Derecho de portabilidad:</strong> Recibir tus datos en formato estructurado 
              y legible por máquina</li>
              <li><strong>Derecho de objeción:</strong> Oponerte al procesamiento basado en 
              intereses legítimos o marketing directo</li>
              <li><strong>Derecho a no ser objeto de decisiones automatizadas:</strong> No ser 
              sorprendido por decisiones basadas únicamente en procesamiento automatizado</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">8.2 Derechos Adicionales (varies by jurisdiction)</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>California (CCPA):</strong> Derecho a conocer, eliminar, y optar por no 
              participar en la "venta" de información personal</li>
              <li><strong>Brasil (LGPD):</strong> Derechos de confirmación, acceso, corrección, 
              anonimización, portabilidad y eliminación</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4">8.3 Cómo Ejercer tus Derechos</h3>
            <p>
              Puedes ejercer la mayoría de tus derechos directamente desde la configuración 
              de tu cuenta. Para solicitudes más complejas, puedes:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Email:</strong> privacy@streamflow.example.com</li>
              <li><strong>Portal:</strong> Tu panel de cuenta → Configuración de privacidad</li>
              <li><strong>Respuesta:</strong> Intentamos responder dentro de 30 días</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">9. Seguridad de Datos</h2>
            <p>
              Implementamos medidas técnicas y organizacionales apropiadas para proteger 
              tu información personal contra acceso no autorizado, alteración, divulgación 
              o destrucción. Nuestras medidas de seguridad incluyen:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Encriptación:</strong> Datos en tránsito via TLS/SSL; datos en reposo 
              encriptados usando AES-256</li>
              <li><strong>Control de acceso:</strong> Principio de mínimo privilegio, acceso 
              basado en roles, autenticación multifactor para administradores</li>
              <li><strong>Monitoreo:</strong> Sistemas de detección de intrusiones, logging 
              de auditoría, alertas de seguridad 24/7</li>
              <li><strong>Infraestructura:</strong> Firewalls, segmentación de red, 
              backups encriptados regulares</li>
              <li><strong>Capacitación:</strong> Entrenamiento obligatorio de seguridad 
              para empleados con acceso a datos</li>
            </ul>
            <p>
              Aunque implementamos robustas medidas de seguridad, ningún sistema es 
              completamente impenetrable. Te recomendamos:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Usar contraseñas fuertes y únicas</li>
              <li>Mantener tu software y navegadores actualizados</li>
              <li>Ser cauteloso con phishing y intentos de ingeniería social</li>
              <li>Revisar regularmente la actividad de tu cuenta</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">10. Children's Privacy</h2>
            <p>
              Nuestros servicios no están diseñados para niños menores de 16 años. 
              No recopilamos intencionalmente información personal de niños. Si 
              descubrimos que hemos recopilado datos de un niño menor de 16 años, 
              tomaremos medidas para eliminar esa información inmediatamente.
            </p>
            <p>
              Si eres padre o tutor y crees que tu hijo nos ha proporcionado 
              información personal, por favor contáctanos para que podamos tomar 
              las acciones necesarias.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">11. Cambios a Esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. 
              Los cambios significativos te serán notificados mediante:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Email a la dirección asociada a tu cuenta</li>
              <li>Aviso prominente en la plataforma (banner o notificación)</li>
              <li>Actualización de la fecha de "Última actualización" indicada arriba</li>
            </ul>
            <p>
              Para cambios menores (como correcciones gramaticales o clarificaciones), 
              la política actualizada será efectiva inmediatamente upon posting (al publicarse).
            </p>
            <p>
              Te recomendamos revisar esta página regularmente para mantenerte informado 
              sobre cualquier cambio. Tu uso continuado de nuestros servicios después de 
              la publicación de cambios constituye aceptación de la política actualizada.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">12. Información de Contacto</h2>
            <p>
              Si tienes preguntas, comentarios o preocupaciones sobre esta Política de 
              Privacidad o nuestras prácticas de datos, no dudes en contactarnos:
            </p>
            <ul className="list-none space-y-3 mt-4">
              <li>
                <strong>Email de Privacidad:</strong><br />
                <span className="text-[var(--color-accent)]">privacy@streamflow.example.com</span>
              </li>
              <li>
                <strong>Delegado de Protección de Datos (DPO):</strong><br />
                <span className="text-[var(--color-accent)]">dpo@streamflow.example.com</span>
              </li>
              <li>
                <strong>Portal de Soporte:</strong><br />
                <span className="text-[var(--color-accent)]">support.streamflow.example.com</span>
              </li>
              <li>
                <strong>Dirección Postal:</strong><br />
                StreamFlow Inc.<br />
                Departamento de Privacidad<br />
                [Dirección de la empresa]<br />
                [Ciudad, Estado, Código Postal]<br />
                [País]
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">13. Recursos Adicionales</h2>
            <p>
              Para más información sobre protección de datos y tus derechos, 
              puedes consultar:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><a href="https://gdpr.eu" className="text-[var(--color-accent)] hover:underline" target="_blank" rel="noopener noreferrer">GDPR Official Website (EU)</a></li>
              <li><a href="https://oag.ca.gov/privacy/ccpa" className="text-[var(--color-accent)] hover:underline" target="_blank" rel="noopener noreferrer">California Attorney General - CCPA (US)</a></li>
              <li><a href="https://www.cnpd.cpd.br" className="text-[var(--color-accent)] hover:underline" target="_blank" rel="noopener noreferrer">LGPD (Brasil)</a></li>
              <li><a href="https://ico.org.uk/your-data-matters/" className="text-[var(--color-accent)] hover:underline" target="_blank" rel="noopener noreferrer">ICO - UK Data Protection</a></li>
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