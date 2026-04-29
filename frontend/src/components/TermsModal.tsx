import { useState, useEffect } from 'react'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [isAccepted, setIsAccepted] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsAccepted(false)
    }
  }, [isOpen])

  const handleAccept = () => {
    if (!isAccepted) {
      setIsAccepted(true)
      onAccept()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Arial', fontWeight: 700 }}>Términos y Condiciones de Uso</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto px-8 py-6 space-y-4 text-justify"
          style={{ fontFamily: 'Arial', fontSize: '12px', color: '#000' }}
        >
          <p className="text-center font-bold text-base">TÉRMINOS Y CONDICIONES DE USO</p>
          <p className="text-center text-xs">Última actualización: 28 de abril de 2026</p>

          <section>
            <p className="font-bold">1. ACEPTACIÓN DE LOS TÉRMINOS Y CONDICIONES GENERALES</p>
            <p>
              Bienvenido a <strong>StreamFlow</strong> (en adelante, la &quot;Plataforma&quot;), una plataforma de transmisión de contenido audiovisual en streaming operada por <strong>FLUX INDUSTRIES</strong> (en adelante, &quot;Freezer&quot;, &quot;la Empresa&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;). Estos Términos y Condiciones de Uso (en adelante, los &quot;Términos&quot; o las &quot;Condiciones&quot;) constituyen un acuerdo legalmente vinculante entre usted (en adelante, el &quot;Usuario&quot;, &quot;usted&quot;, &quot;su&quot; o &quot;sus&quot;) y FLUX INDUSTRIES con respecto al acceso, uso y navegación por la Plataforma StreamFlow, incluyendo cualquier subdominio, aplicación móvil, servicio de API, y cualquier otra funcionalidad o servicio proporcionado por Freezer.
            </p>
            <p>
              Al acceder, navegar, registrar una cuenta, cargar contenido, visualizar videos, suscribirse a cualquier plan de membresía, o utilizar cualquier otra funcionalidad disponible en la Plataforma (en adelante, denominadas conjuntamente como el &quot;Servicio&quot; o &quot;Servicios&quot;), usted reconoce haber leído, comprendido y aceptado de manera expresa, irrevocable e incondicional estos Términos en su totalidad. Si usted no está de acuerdo con cualquiera de los términos, condiciones, políticas o prácticas aquí descritas, o con cualquier parte de ellos, su único y exclusivo recurso es cesar inmediatamente el uso de la Plataforma y, en su caso, cancelar su cuenta. El simple hecho de crear una cuenta, iniciar sesión, hacer clic en cualquier botón de aceptación, o simplemente acceder o utilizar la Plataforma se considera como aceptación plena e irrevocable de todos los términos y condiciones contenidos en este documento.
            </p>
            <p>
              Freezer se reserva el derecho de modificar, actualizar, enmendar, alterar o cambiar estos Términos en cualquier momento, a nuestra sola y exclusiva discreción, sin obligación de notificación previa individual a cada Usuario. Toda modificación será efectiva inmediatamente después de su publicación en la Plataforma. Es responsabilidad exclusiva del Usuario revisar estos Términos periódicamente para estar al tanto de cualquier cambio, modificación o actualización. El uso continuado de la Plataforma después de cualquier publicación de modificaciones constituye la aceptación plena e irrevocable de los Términos modificados. Ninguna exención o renuncia de cualquier disposición de estos Términos se considerará como una exención o renuncia continuada o futura de dicha disposición o de cualquier otra disposición aquí contenida.
            </p>
            <p>
              Usted declara y garantiza que tiene la capacidad legal para celebrar este acuerdo. Si usted está accediendo a la Plataforma en representación de una entidad corporativa, organización, asociación o cualquier otra persona jurídica, usted declara y garantiza que está autorizado para obligar a dicha entidad a estos Términos, y que dicha entidad será responsable ante Freezer por cualquier incumplimiento de su parte. En tal caso, las referencias a &quot;Usuario&quot; en estos Términos se referirán tanto a usted personalmente como a la entidad que usted representa.
            </p>
          </section>

          <section>
            <p className="font-bold">2. DESCRIPCIÓN DETALLADA DEL SERVICIO Y NATURALEZA DE LA PLATAFORMA</p>
            <p>
              StreamFlow es una plataforma integral de transmisión de contenido audiovisual en streaming que permite a los usuarios visualizar, organizar, gestionar, clasificar, buscar, filtrar, comentar, compartir y administrar catálogos de video y contenido multimedia. La Plataforma ha sido diseñada para ofrecer una experiencia de usuario superior, con una interfaz intuitiva, algoritmos de recomendación avanzados, y una infraestructura técnica robusta capaz de ofrecer streaming de video de alta calidad a una audiencia global.
            </p>
            <p>
              Los Servicios ofrecidos por Freezer a través de la Plataforma incluyen, sin limitación: (a) el acceso a contenido de video bajo demanda; (b) la posibilidad de cargar, almacenar y gestionar contenido de video del Usuario; (c) herramientas de catalogación y organización de bibliotecas de video personales o corporativas; (d) funcionalidades de búsqueda y filtrado avanzado; (e) creación y gestión de listas de reproducción y colecciones; (f) herramientas de administración de usuarios y permisos; (g) integración con servicios de almacenamiento de terceros; (h) generación de miniaturas automáticas; (i) transcodificación y procesamiento de video; y (j) cualquier otra funcionalidad que Freezer decida incorporar a la Plataforma en el futuro.
            </p>
            <p>
              Freezer se reserva el derecho, a su sola discreción, de modificar, suspender, discontinuar, reemplazar o alterar cualquiera o todas las partes de los Servicios, incluyendo cualquier característica, funcionalidad, herramienta, plan de precios, o aspecto de la Plataforma, en cualquier momento, sin previo aviso, y sin que ello genere derecho a compensación alguna a favor del Usuario. Freezer no garantiza que los Servicios estarán disponibles de forma ininterrumpida, oportuna, segura o libre de errores. Freezer no será responsable por ninguna pérdida de datos, contenido o información que pueda ocurrir como resultado de cualquier modificación, suspensión o discontinuación de los Servicios.
            </p>
            <p>
              El Usuario reconoce y acepta que la Plataforma podrá incluir contenido publicado, cargado o administrado por Freezer, así como contenido cargado, publicado o administrado por los propios Usuarios. Freezer actúa exclusivamente como un proveedor de plataforma tecnológica y no como editor o productor de contenido de terceros. El Usuario asume la total responsabilidad y riesgo sobre cualquier contenido que cargue, publique o transmita a través de la Plataforma.
            </p>
          </section>

          <section>
            <p className="font-bold">3. ELEGIBILIDAD, REQUISITOS DE EDAD Y CALIFICACIÓN DEL USUARIO</p>
            <p>
              Para utilizar la Plataforma y crear una cuenta, el Usuario debe cumplir con los siguientes requisitos de elegibilidad: (a) tener al menos <strong>dieciocho (18) años</strong> de edad completos, o la mayoría de edad legal en su jurisdicción si esta es superior a dieciocho años; (b) no haber sido previamente suspendido, baneado, o eliminado de la Plataforma por violación de estos Términos; (c) no estar impedido por la ley aplicable de utilizar la Plataforma; y (d) cumplir con todos los requisitos de registro establecidos en estos Términos y en cualquier otra política aplicable de Freezer.
            </p>
            <p>
              El Usuario declara y garantiza expresamente que: (i) cumple con el requisito de edad mínima establecido en esta sección; (ii) toda la información proporcionada durante el proceso de registro es verdadera, precisa, completa, actualizada y no engañosa; (iii) no está utilizando una cuenta a nombre de otra persona sin la debida autorización; (iv) no ha sido condenado por ningún delito relacionado con fraude, robo, engaño, o cualquier otro delito que pudiera afectar la integridad de la Plataforma o de otros Usuarios; y (v) no está sujeto a sanciones comerciales o restricciones legales que le impidan utilizar servicios de tecnología y plataformas de streaming.
            </p>
            <p>
              El Usuario es el único y exclusivo responsable de: (a) mantener la confidencialidad de sus credenciales de acceso, incluyendo nombre de usuario, contraseña, códigos de verificación, tokens de sesión, y cualquier otra información de autenticación; (b) todas y cada una de las actividades que ocurran bajo su cuenta, independientemente de si fueron autorizadas o no; (c) notificar a Freezer de inmediato, a través de los canales de soporte designados, sobre cualquier uso no autorizado de su cuenta, cualquier violación o brecha de seguridad, o cualquier otra actividad sospechosa relacionada con su cuenta; y (d) mantener sus datos de perfil, información de contacto y demás datos actualizados y precisos en todo momento.
            </p>
            <p>
              Freezer no será, bajo ninguna circunstancia, responsable por cualquier pérdida, daño, perjuicio, costo o gasto, directo o indirecto, que resulte del uso no autorizado de la cuenta del Usuario, ya sea que dicho uso no autorizado sea resultado de negligencia, descuido, o cualquier otra causa imputable al Usuario. El Usuario acepta que Freezer podrá, a su sola discreción, verificar la información proporcionada durante el registro y adoptar las medidas que considere apropiadas en caso de detectarse información falsa, incompleta o engañosa.
            </p>
          </section>

          <section>
            <p className="font-bold">4. PLANES DE MEMBRESÍA, SUSCRIPCIONES, FACTURACIÓN Y PAGOS</p>
            <p>
              La Plataforma ofrece diversos planes de membresía con diferentes niveles de acceso, funcionalidades y beneficios. Los planes disponibles actualmente incluyen: (a) <strong>Plan Gratuito</strong>: acceso básico a la Plataforma con funcionalidades limitadas; (b) <strong>Plan Básico</strong>: acceso ampliado con mayor capacidad de almacenamiento y funcionalidades adicionales; (c) <strong>Plan Profesional</strong>: acceso completo a todas las funcionalidades de la Plataforma; y (d) <strong>Planes Corporativos o Enterprise</strong>: soluciones personalizadas para organizaciones con necesidades específicas. Los detalles, características, límites, precios y condiciones de cada plan están sujetos a cambios sin previo aviso y pueden variar según la región geográfica, moneda local, y promociones vigentes.
            </p>
            <p>
              Los precios de las suscripciones se muestran en la Plataforma en la moneda local del Usuario y no incluyen impuestos aplicables, los cuales serán adicionados al precio final según la legislación fiscal vigente en la jurisdicción del Usuario. El Usuario autoriza expresamente a Freezer a cargar a su método de pago registrado (tarjeta de crédito, débito, PayPal, transferencia bancaria, o cualquier otro método de pago aceptado) los montos correspondientes al plan seleccionado, incluyendo cualquier renovación automática, actualización, downgrade, o cargo adicional autorizado por el Usuario.
            </p>
            <p>
              Las suscripciones de pago se renuevan automáticamente al final de cada período de facturación (ya sea mensual, trimestral, anual, o cualquier otro período establecido) a menos que el Usuario cancele la suscripción antes de la fecha de renovación. La cancelación de una suscripción se puede realizar en cualquier momento a través del panel de configuración de la cuenta del Usuario. La cancelación tomará efecto al final del período de facturación ya pagado y no dará derecho a reembolso por el período restante, salvo que la ley aplicable lo exija expresamente o que Freezer lo determine como un gesto comercial.
            </p>
            <p>
              Freezer utiliza procesadores de pago de terceros para procesar todas las transacciones. El Usuario reconoce y acepta que: (a) Freezer no almacena información de pago en sus propios servidores; (b) la información de pago es procesada directamente por el procesador de pago tercero, sujeto a sus propios términos y condiciones; (c) Freezer no se hace responsable por errores, fallas, demoras, o cualquier otro problema derivado del procesador de pago tercero; y (d) el Usuario debe dirigirse directamente al procesador de pago para cualquier reclamo relacionado con la transacción. <strong>No habrá reembolsos por períodos parciales no utilizados</strong>, excepto en casos donde la ley aplicable lo exija expresamente, o donde Freezer determine, a su sola discreción, que procede un reembolso como gesto comercial.
            </p>
            <p>
              En caso de incumplimiento de pago, cargos rechazados, tarjeta vencida, o cualquier otro problema con el método de pago, Freezer se reserva el derecho de: (a) suspender inmediatamente el acceso a las funcionalidades de pago; (b) cancelar la suscripción sin previo aviso; (c) cobrar cargos adicionales por mora, incluyendo intereses sobre el monto adeudado; y (d) emplear agencias de cobranza externas para recuperar montos pendientes. Freezer también se reserva el derecho de cobrar al Usuario los costos razonables de cobranza, incluyendo honorarios de abogados, en caso de incumplimiento de pago.
            </p>
          </section>

          <section>
            <p className="font-bold">5. PROPIEDAD INTELECTUAL, DERECHOS DE AUTOR Y PROPIEDAD INDUSTRIAL</p>
            <p>
              Todo el contenido disponible en la Plataforma, incluyendo pero no limitándose a: textos, gráficos, logotipos, íconos, botones, imágenes, clips de audio y video, música, bandas sonoras, archivos de datos, bases de datos, catálogos, información de usuarios, interfaces de usuario, interfaces de programación, código fuente, código objeto, software, scripts, algoritmos, lógica de procesos, arquitectura de sistemas, documentación, manuales, guías de usuario, tutoriales, y cualquier otro material o contenido (en adelante, denominado conjuntamente como &quot;Contenido de Freezer&quot;), es propiedad exclusiva de Freezer, sus licenciantes, proveedores de contenido, socios comerciales, o cualquier otro titular de derechos, y está protegido por las leyes de propiedad intelectual aplicables, incluyendo pero no limitándose a las leyes de derecho de autor, marcas registradas, patentes, derechos de diseño, derechos de bases de datos, y tratados internacionales de propiedad intelectual.
            </p>
            <p>
              Salvo que se indique expresamente lo contrario en estos Términos, el Usuario no puede: (a) copiar, modificar, alterar, transformar, adaptar, traducir, crear obras derivadas de, o de cualquier otra forma explotar comercialmente o para fines de lucro cualquier Contenido de Freezer; (b) distribuir, vender, licenciar, sublicenciar, alquilar, arrendar, prestar, transmitir, exhibir públicamente, poner a disposición del público, o de cualquier otra forma transferir cualquier Contenido de Freezer a terceros; (c) eliminar, ocultar, o modificar cualquier aviso de derechos de autor, marca registrada, o cualquier otro aviso de propiedad intelectual contenido en el Contenido de Freezer; (d) realizar ingeniería inversa, descompilar, desensamblar, traducir, adaptar, o intentar descubrir el código fuente, algoritmos, o cualquier otra información técnica relacionada con la Plataforma; (e) utilizar robots, spiders, crawlers, scrapers, o cualquier otro medio automatizado para acceder, indexar, copiar, o extraer contenido de la Plataforma sin autorización previa por escrito de Freezer; o (f) eludir, ignorar, desactivar, o de cualquier otra forma interferir con las medidas de protección tecnológicas, sistemas de gestión de derechos digitales, o cualquier otra medida de seguridad implementada en la Plataforma.
            </p>
            <p>
              Los derechos no expresamente otorgados en estos Términos quedan reservados exclusivamente para Freezer y sus respectivos titulares de derechos. Cualquier uso no autorizado de cualquier Contenido de Freezer constituirá una violación de estos Términos y podrá constituir una infracción grave de la ley de propiedad intelectual aplicable, y expondrá al infractor a acciones civiles y/o penales. Freezer cooperará plenamente con las autoridades gubernamentales y/o judiciales en cualquier investigación relacionada con sospechas de infracción de propiedad intelectual.
            </p>
            <p>
              Todas las marcas registradas, nombres comerciales, logotipos, emblemas, lemas, diseños, y cualquier otro elemento de identidad corporativa utilizado en la Plataforma (en adelante, &quot;Marcas&quot;) son propiedad exclusiva de Freezer o de sus respectivos titulares. El Usuario no adquiere ningún derecho, título o interés en las Marcas por el uso de la Plataforma. Está estrictamente prohibido utilizar las Marcas de Freezer o de terceros sin la autorización previa por escrito del titular correspondiente.
            </p>
          </section>

          <section>
            <p className="font-bold">6. CONTENIDO GENERADO POR EL USUARIO, LICENCIAS Y RESPONSABILIDADES</p>
            <p>
              El Usuario que carga, publica, transmite, exhibe, comparte, o de cualquier otra forma pone a disposición contenido a través de la Plataforma (en adelante, &quot;Contenido del Usuario&quot;) debe ser el único y exclusivo titular de todos los derechos de propiedad intelectual sobre dicho Contenido del Usuario, o debe contar con todas y cada una de las autorizaciones, licencias, permisos y consentimientos necesarios de los titulares de derechos correspondientes para su uso, publicación, transmisión, exhibición y distribución a través de la Plataforma y de conformidad con estos Términos.
            </p>
            <p>
              Al cargar, publicar o transmitir Contenido del Usuario a la Plataforma, el Usuario otorga a Freezer, de forma automática y sin necesidad de notificación o compensación adicional, una licencia mundial, perpetua, irrevocable, no exclusiva, transferible, sublicenciable, libre de regalías, y con derecho a explotación comercial completa para: (a) usar, reproducir, modificar, editar, adaptar, traducir, formatear, comprimir, convertir, transcodificar, crear obras derivadas de, y de cualquier otra forma procesar el Contenido del Usuario; (b) distribuir, exhibir públicamente, poner a disposición del público, transmitir, y sublicenciar el Contenido del Usuario a través de la Plataforma y de cualquier otro medio o plataforma de distribución que Freezer considere apropiado; (c) utilizar el Contenido del Usuario con fines de promoción, publicidad, y marketing de la Plataforma; y (d) crear, utilizar, reproducir, modificar, y distribuir trabajos derivados basados en el Contenido del Usuario o parte de él.
            </p>
            <p>
              El Usuario declara y garantiza expresamente que: (i) el Contenido del Usuario es original y no infringe los derechos de propiedad intelectual de terceros; (ii) el Contenido del Usuario no es falso, difamatorio, obsceno, pornográfico, abusivo, amenazante, acosador, engañoso, fraudulento, o de cualquier otra forma ilegal o inapropiado; (iii) el Contenido del Usuario no viola la privacidad, derechos de publicidad, o cualquier otro derecho de terceros; (iv) el Contenido del Usuario no contiene virus, malware, spyware, troyanos, gusanos, o cualquier otro componente malicioso; y (v) el Contenido del Usuario cumple con todas las leyes y regulaciones aplicables, incluyendo pero no limitándose a las leyes de derecho de autor, protección al consumidor, y comunicaciones.
            </p>
            <p>
              Freezer se reserva el derecho absoluto, a su sola y exclusiva discreción, de: (a) eliminar, ocultar, bloquear, restringir el acceso, o de cualquier otra forma modificar o eliminar cualquier Contenido del Usuario que, a criterio de Freezer, viole estos Términos, infrinja derechos de terceros, sea ilegal, inapropiado, o por cualquier otro motivo sea considerado indeseable; (b) suspender, restringir, o cancelar el acceso del Usuario a la Plataforma sin previo aviso; y (c) cooperar plenamente con las autoridades gubernamentales y/o judiciales en cualquier investigación relacionada con contenido ilegal o inapropiado.
            </p>
          </section>

          <section>
            <p className="font-bold">7. CÓDIGO DE CONDUCTA, NORMAS DE COMPORTAMIENTO Y USOS PROHIBIDOS</p>
            <p>
              El Usuario se compromete a utilizar la Plataforma de forma responsable, ética, respetuosa, y de conformidad con la ley, la moral, las buenas costumbres, el orden público, y estos Términos. El Usuario acepta que es el único responsable de su conducta y de cualquier consecuencia que pueda derivarse de su uso de la Plataforma. Queda terminantemente prohibido utilizar la Plataforma para cualquier propósito que sea ilegal, no autorizado, o que de cualquier forma infrinja, viole, o menoscabe los derechos de terceros o la ley aplicable.
            </p>
            <p>
              Queda estrictamente prohibido, sin limitación: (a) utilizar la Plataforma para cualquier propósito ilegal o no autorizado, incluyendo la comisión de crímenes informáticos, fraude, robo de identidad, phishing, o cualquier otro delito informático; (b) cargar, publicar, transmitir, enviar por correo electrónico, o de cualquier otra forma distribuir contenido que sea difamatorio, abusivo, obsceno, pornográfico, sexual, amenazante, acosador, intimidatorio, humillante, racista, xenófobo, sexista, homofóbico, capaz de incitar al odio, violento, o de cualquier otra forma indeseable; (c) cargar, publicar, o transmitir contenido que infrinja derechos de autor, marcas registradas, patentes, secretos comerciales, o cualquier otro derecho de propiedad intelectual de terceros; (d) intentar acceder a las cuentas de otros Usuarios, a los sistemas de Freezer, a las redes de Freezer, o a cualquier cuenta, sistema o red que no le pertenezca; (e) realizar ingeniería inversa, descompilar, desensamblar, traducir, adaptar, o intentar descubrir el código fuente, algoritmos, protocolos, o cualquier otra información técnica de la Plataforma; (f) utilizar robots, spiders, crawlers, scrapers, o cualquier otro medio automatizado para acceder a la Plataforma sin autorización previa por escrito; (g) introducir, cargar, o transmitir virus, troyanos, gusanos, bombas lógicas, registradores de pulsaciones del teclado, rootkits, puertas traseras, o cualquier otro material malicioso o dañino; (h) intentar obtener acceso no autorizado a los sistemas, redes, servidores, o infraestructura de Freezer; (i) utilizar la Plataforma para acosar, amenazar, intimidar, humillar, o de cualquier otra forma causar daño a otros Usuarios o a terceros; (j) suplantar la identidad de cualquier persona o entidad, incluyendo empleados, agentes, o representantes de Freezer; (k) realizar inundación, spam, o cualquier otra actividad que pueda interferir con el funcionamiento normal de la Plataforma; (l) utilizar la Plataforma para enviar correos electrónicos no solicitados, mensajes no solicitados, o cualquier forma de comunicación no solicitada; (m) realizar cualquier actividad que pueda dañar, deshabilitar, sobrecargar, deteriorar, o negativamente afectar la Plataforma o los servidores, redes, o sistemas de Freezer; y (n) violar cualquier ley, regulación, o término de estos Términos.
            </p>
            <p>
              Freezer cooperará plenamente y sin reservas con las autoridades gubernamentales y/o judiciales en cualquier investigación relacionada con el uso ilegal de la Plataforma, incluyendo la revelación de la identidad, dirección IP, información de cuenta, historial de actividad, y cualquier otra información relevante del Usuario sospechoso de cometer crímenes o violaciones de la ley.
            </p>
          </section>

          <section>
            <p className="font-bold">8. POLÍTICA DE PRIVACIDAD, PROTECCIÓN DE DATOS PERSONALES Y CONFIDENCIALIDAD</p>
            <p>
              La privacidad de los Usuarios es un valor fundamental para Freezer. Freezer se compromete a proteger la privacidad, los datos personales, y la información confidencial de los Usuarios de conformidad con las leyes de protección de datos aplicables, incluyendo cualquier regulación de protección de datos aplicable como el RGPD, la CCPA, la LGPD, o cualquier otra ley de privacidad que pueda ser relevante. La Política de Privacidad de Freezer está incorporada por referencia a estos Términos y constituye una parte integral de los mismos. Al utilizar la Plataforma, el Usuario consiente expresamente la recopilación, almacenamiento, procesamiento, uso, y transferencia de sus datos personales de conformidad con la Política de Privacidad.
            </p>
            <p>
              Freezer recopila diversos tipos de información personal del Usuario, incluyendo: (a) información proporcionada durante el registro, como nombre, correo electrónico, fecha de nacimiento, género, fotografía de perfil, y cualquier otra información proporcionada voluntariamente por el Usuario; (b) información de pago y facturación; (c) información sobre el uso de la Plataforma, incluyendo historial de visualización, búsquedas realizadas, contenido cargado, comentarios publicados, y preferencias del Usuario; (d) información técnica, como dirección IP, tipo de navegador, sistema operativo, identificadores de dispositivos, y cookies; y (e) cualquier otra información que el Usuario proporcione a Freezer a través de la Plataforma o de cualquier otro canal de comunicación.
            </p>
            <p>
              Freezer emplea medidas de seguridad técnicas, organizativas, y administrativas razonables y apropiadas para proteger los datos personales contra acceso no autorizado, pérdida, destrucción, alteración, divulgación, o uso indebido. Sin embargo, el Usuario reconoce y acepta que: (a) ningún sistema de seguridad es completamente impenetrable; (b) la transmisión de información a través de Internet no es 100% segura; (c) Freezer no puede garantizar la seguridad absoluta de los datos del Usuario; y (d) el Usuario utiliza la Plataforma bajo su propio riesgo en lo que respecta a la seguridad de sus datos personales.
            </p>
            <p>
              El Usuario tiene derechos sobre sus datos personales, incluyendo el derecho de acceso, rectificación, supresión, portabilidad, limitación del procesamiento, y objeción al procesamiento, de conformidad con la ley aplicable. Para ejercer cualquiera de estos derechos, el Usuario debe comunicarse con Freezer a través de los canales de soporte designados en la Plataforma. Freezer responderá a las solicitudes de ejercicio de derechos en los plazos establecidos por la ley aplicable.
            </p>
            <p>
              El Usuario es responsable de mantener la confidencialidad de sus datos de acceso y de toda la información que figure en su perfil de cuenta. El Usuario debe evitar compartir su información de acceso con terceros y debe tomar medidas razonables para proteger su cuenta contra acceso no autorizado.
            </p>
          </section>

          <section>
            <p className="font-bold">9. EXENCIÓN DE GARANTÍAS, DECLARACIONES Y LIMITACIONES LEGALES</p>
            <p>
              LA PLATAFORMA Y TODOS LOS SERVICIOS SE PROPORCIONAN &quot;TAL COMO ESTÁN&quot;, &quot;SEGÚN DISPONIBILIDAD&quot;, Y &quot;CON TODOS LOS ERRORES&quot;. FREEZER, EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY APLICABLE, NO OFRECE NINGUNA GARANTÍA, DECLARACIÓN O CONDICIÓN DE NINGÚN TIPO, YA SEA EXPRESA, IMPLÍCITA, LEGAL, ESTATUTARIA, O DE CUALQUIER OTRA NATURALEZA, INCLUYENDO PERO NO LIMITÁNDOSE A: (A) GARANTÍAS DE COMERCIABILIDAD, APTITUD PARA UN PROPÓSITO PARTICULAR, TÍTULO, PROPIEDAD, NO INFRACCIÓN, COMERCIABILIDAD, CALIDAD, INTEGRACIÓN, O ADECUACIÓN; (B) GARANTÍAS DE QUE LA PLATAFORMA SERÁ ININTERRUMPIDA, SEGURA, PRECISA, COMPLETA, ACTUALIZADA, LIBRE DE ERRORES, VIRUS, O COMPORTAMIENTO DEFECTUOSO; (C) GARANTÍAS DE QUE LOS DEFECTOS O ERRORES SERÁN CORREGIDOS; (D) GARANTÍAS DE QUE LA PLATAFORMA ESTÉ LIBRE DE VIRUS, MALWARE, SPYWARE, TROYANOS, GUSANOS, U OTROS COMPONENTES DAÑINOS O NO AUTORIZADOS; (E) GARANTÍAS DE QUE LOS RESULTADOS OBTENIDOS DEL USO DE LA PLATAFORMA SEAN exactos, confiables, completos, o de cualquier otra forma cumplan con las expectativas del Usuario; (F) GARANTÍAS DE QUE EL CONTENIDO, LA INFORMACIÓN, O LOS DATOS PROPORCIONADOS A TRAVÉS DE LA PLATAFORMA SEAN veraces, exactos, o confiables; y (G) GARANTÍAS DE QUE EL SERVICIO ESTARÁ DISPONIBLE EN TODO MOMENTO, EN CUALQUIER UBICACIÓN GEOGRÁFICA, O BAJO CUALQUIER CONDICIÓN TÉCNICA O DE RED.
            </p>
            <p>
              NINGÚN CONSEJO, INDICACIÓN, INFORMACIÓN, OPINIÓN, RECOMENDACIÓN, O INFORMACIÓN, YA SEA ORAL, ESCRITA, ELECTRÓNICA, O DE CUALQUIER OTRA FORMA, OBTENIDO POR EL USUARIO DE FREEZER, SUS AFILIADOS, EMPLEADOS, AGENTES, REPRESENTANTES, PROVEEDORES, O A TRAVÉS DE LA PLATAFORMA O CUALQUIER CANAL DE SOPORTE, CONSTITUYE GARANTÍA, DECLARACIÓN, O COMPROMISO NO ESTABLECIDO EXPRESAMENTE EN ESTE DOCUMENTO.
            </p>
            <p>
              El Usuario reconoce expresamente que: (a) utiliza la Plataforma bajo su propio y exclusivo riesgo; (b) la Plataforma puede contener errores, defectos, problemas técnicos, imprecisiones, información incompleta, o información desactualizada; (c) el contenido de terceros no ha sido verificado, validado, o aprobado por Freezer; y (d) Freezer no garantiza la legitimidad, exactitud, o confiabilidad de cualquier contenido, información, u opinión expresada en la Plataforma.
            </p>
          </section>

          <section>
            <p className="font-bold">10. LIMITACIÓN DE RESPONSABILIDAD, DAÑOS Y PERJUICIOS</p>
            <p>
              EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY APLICABLE, FREEZER, SUS AFILIADOS, SUBSIDIARIAS, EMPRESAS RELACIONADAS, DIRECTIVOS, EMPLEADOS, AGENTES, REPRESENTANTES, SOCIOS, PROVEEDORES, LICENCIANTES, Y CUALQUIER OTRO PROVEEDOR DE CONTENIDO, SERVICIOS, O INFORMACIÓN A TRAVÉS DE LA PLATAFORMA (EN ADELANTE, DENOMINADOS CONJUNTAMENTE COMO &quot;PARTES DE FREEZER&quot;) NO SERÁN RESPONSABLES BAJO NINGUNA CIRCUNSTANCIA, BAJO NINGUNA TEORÍA LEGAL O EQUITATIVA, BAJO NINGUNA FORMA DE ACCIÓN, Y POR NINGÚN MOTIVO, POR: DAÑOS DIRECTOS, INCLUIDOS PERO NO LIMITÁNDOSE A DAÑOS A EQUIPOS, SOFTWARE, SISTEMAS, REDES, O CUALQUIER OTRA PROPIEDAD DEL USUARIO QUE OCURRA COMO RESULTADO DEL USO DE LA PLATAFORMA; DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, EMERGENTES, PUNITIVOS, EJEMPLARES, O CONSECUENCIALES, INCLUIDOS PERO NO LIMITÁNDOSE A PÉRDIDA DE BENEFICIOS, PÉRDIDA DE INGRESOS, PÉRDIDA DE DATOS, PÉRDIDA DE INFORMACIÓN, INTERRUPCIÓN DEL NEGOCIO, PÉRDIDA DE CLIENTELA, PÉRDIDA DE OPORTUNIDAD, COSTO DE ADQUISICIÓN DE BIENES O SERVICIOS SUSTITUTOS, O CUALQUIER OTRA PÉRDIDA INTANGIBLE O PECUNIARIA QUE PUEDA DERIVARSE DEL USO O IMPOSIBILIDAD DE USO DE LA PLATAFORMA; CUALQUIER DAÑO O PERJUICIO QUE RESULTE DE CONTENIDO DE TERCEROS, CONDUCTA DE TERCEROS, ACCESO NO AUTORIZADO A LAS CUENTAS DEL USUARIO, ERRORES EN EL CONTENIDO, CONDUCTA DE OTROS USUARIOS, O FALLAS EN LA INFRAESTRUCTURA DE LA PLATAFORMA.
            </p>
            <p>
              LA RESPONSABILIDAD TOTAL DE FREEZER Y LAS PARTES DE FREEZER BAJO ESTOS TÉRMINOS, BAJO CUALQUIER TEORÍA LEGAL O EQUITATIVA, BAJO CUALQUIER FORMA DE ACCIÓN, Y BAJO CUALQUIER CIRCUNSTANCIA, NO EXCEDERÁ, EN NINGÚN CASO, EL MONTO MAYOR PAGADO POR EL USUARIO A FREEZER EN LOS DOCE (12) MESES INMEDIATAMENTE PRECEDENTES AL EVENTO, ACTO, OMISIÓN, O CIRCUNSTANCIA QUE HAYA DADO LUGAR A LA RECLAMACIÓN, O CIEN DÓLARES ESTADOUNIDENSES, LO QUE SEA MAYOR. ESTA LIMITACIÓN DE RESPONSABILIDAD ES FUNDAMENTAL PARA EL ACUERDO ENTRE EL USUARIO Y FREEZER Y CONSTITUYE UNA PARTE ESENCIAL DE ESTOS TÉRMINOS.
            </p>
            <p>
              LAS LIMITACIONES DE RESPONSABILIDAD ESTABLECIDAS EN ESTA SECCIÓN SE APLICAN INCLUSO SI FREEZER HA SIDO ADVERTIDO O DEBIERA HABER SIDO ADVERTIDO SOBRE LA POSIBILIDAD DE DICHOS DAÑOS, E INCLUSO SI LOS RECURSOS ESTABLECIDOS EN ESTOS TÉRMINOS FALLAN EN SU PROPÓSITO ESENCIAL. EL USUARIO RECONOCE QUE ESTAS LIMITACIONES REFLEJAN LA DISTRIBUCIÓN DE RIESGOS ENTRE LAS PARTES Y QUE LAS TARIFAS, PLANES, Y CONDICIONES DE LA PLATAFORMA SE BASAN EN ESTA DISTRIBUCIÓN DE RIESGOS.
            </p>
          </section>

          <section>
            <p className="font-bold">11. INDEMNIZACIÓN, DEFENSA Y PROTECCIÓN</p>
            <p>
              El Usuario acepta expresa e irrevocableablemente indemnizar, defender, y mantener libre de daños y perjuicios a Freezer, sus afiliados, subsidiarias, empresas relacionadas, directivos, empleados, agentes, representantes, socios, proveedores, licenciantes, cesionarios, y cualquier otro tercero relacionado con la Plataforma (en adelante, colectivamente, las &quot;Partes Indemnizadas&quot;) de y contra cualquier y todo reclamo, acción, demanda, procedimiento, proceso, investigación, auditoría, revisión, conciliación, mediación, arbitraje, causa, controversia, obligación, responsabilidad, pérdida, deuda, obligación, gravamen, impuesto, multa, sanción, costo, gasto, incluyendo pero no limitándose a honorarios razonables de abogados, consultores, peritos, testigos, costas judiciales, costos de descubrimiento, y cualquier otro costo o gasto legal o extrajudicial que surja de, se relacione con, o sea consecuencia de: el uso de la Plataforma por el Usuario; la violación, incumplimiento, o contravención de cualquiera de los Términos por parte del Usuario; la violación de derechos de terceros por el Usuario; cualquier Contenido del Usuario cargado, publicado, transmitido, o puesto a disposición del público a través de la Plataforma; cualquier reclamo de terceros relacionado con el Contenido del Usuario; cualquier acto o hecho ilícito, negligente, doloso, o incorrecto del Usuario; cualquier reclamo, demanda, o acción de terceros derivada de la relación del Usuario con Freezer o con la Plataforma; y cualquier acto o decisión de Freezer basada en información proporcionada por el Usuario.
            </p>
            <p>
              Freezer se reserva el derecho de asumir la defensa exclusiva de cualquier reclamo, acción, o proceso sujeto a indemnización, y el Usuario se compromete a cooperar plenamente con dicha defensa, proporcionando toda la información, documentación, y asistencia que Freezer razonablemente solicite. El Usuario no podrá conciliar, transigir, o de cualquier otra forma resolver cualquier reclamo, acción, o proceso sujeto a indemnización sin el consentimiento previo y por escrito de Freezer. Las obligaciones de indemnización establecidas en esta sección sobrevivirán a la terminación de estos Términos y de la cuenta del Usuario.
            </p>
          </section>

          <section>
            <p className="font-bold">12. MODIFICACIONES, ACTUALIZACIONES Y ENMIENDAS A LOS TÉRMINOS</p>
            <p>
              Freezer se reserva el derecho exclusivo de modificar, actualizar, enmendar, alterar, complementar, o de cualquier otra forma cambiar estos Términos en cualquier momento, a nuestra sola y exclusiva discreción, sin obligación de notificar prévia o individualmente a cada Usuario, sin necesidad de obtener el consentimiento del Usuario, y sin que ello genere derecho a compensación alguna a favor del Usuario. Las modificaciones, actualizaciones, y enmiendas a estos Términos pueden incluir, sin limitación, cambios en: (a) las tarifas, precios, y condiciones de pago; (b) las funcionalidades, características, y servicios disponibles en la Plataforma; (c) los límites de almacenamiento, ancho de banda, y uso; (d) las políticas de uso aceptable; (e) los procedimientos de registro, cancelación, y terminación de cuenta; y (f) cualquier otra disposición de estos Términos.
            </p>
            <p>
              Salvo que Freezer indique lo contrario, las modificaciones entrarán en vigor inmediatamente después de su publicación en la Plataforma, sin perjuicio de cualquier período de transición que Freezer pueda establecer. Es responsabilidad exclusiva del Usuario revisar estos Términos periódicamente, incluyendo cada vez que acceda a la Plataforma, para estar al tanto de cualquier cambio, modificación, o actualización. El uso continuado de la Plataforma por parte del Usuario después de la publicación de cualquier modificación constituirá la aceptación plena, expresa, e irrevocable de los Términos modificados.
            </p>
            <p>
              Si el Usuario no está de acuerdo con cualquiera de las modificaciones publicadas, su único y exclusivo recurso es: (a) cesar inmediatamente el uso de la Plataforma; (b) cancelar su cuenta a través de los procedimientos establecidos en la sección correspondiente de estos Términos; y (c) en su caso, solicitar el reembolso de cualquier monto pagado por adelantado correspondiente a períodos no utilizados, sujeto a las políticas de reembolso establecidas en estos Términos y a la ley aplicable. El hecho de que el Usuario continúe utilizando la Plataforma después de la publicación de modificaciones se considerará como aceptación plena e irrevocable de los Términos modificados.
            </p>
            <p>
              Freezer podrá, a su sola discreción, proporcionar notificaciones sobre modificaciones a estos Términos a través de cualquier canal de comunicación que considere apropiado, incluyendo correo electrónico, notificaciones en la Plataforma, publicaciones en el blog de Freezer, redes sociales, o cualquier otro canal. Sin embargo, el Usuario reconoce y acepta que la falta de notificación individual no afectará la efectividad de las modificaciones publicadas.
            </p>
          </section>

          <section>
            <p className="font-bold">13. TERMINACIÓN DE CUENTA, CANCELACIÓN Y SUSPENSIÓN</p>
            <p>
              <strong>13.1 Cancelación por el Usuario.</strong> El Usuario puede cancelar su cuenta y suscripción en cualquier momento, sin necesidad de justificación, a través de la configuración de su cuenta en la Plataforma, siguiendo los procedimientos de cancelación establecidos por Freezer. La cancelación por parte del Usuario tomará efecto al final del período de facturación ya pagado. No habrá reembolsos por períodos parciales no utilizados, salvo que la ley aplicable exija lo contrario o que Freezer lo determine como un gesto comercial. La cancelación de la suscripción no implica la eliminación automática de la cuenta del Usuario; el Usuario puede mantener su cuenta gratuita incluso después de cancelar una suscripción de pago.
            </p>
            <p>
              <strong>13.2 Terminación por Freezer.</strong> Freezer puede, a su sola y exclusiva discreción, y sin previo aviso, suspender, restringir, limitar, o terminar de forma permanente o temporal: (a) el acceso del Usuario a la Plataforma o a cualquier parte de ella; (b) la cuenta del Usuario; (c) cualquier funcionalidad, servicio, o herramienta asociada con la cuenta del Usuario; y (d) la suscripción del Usuario. Freezer puede tomar estas acciones por cualquier motivo, incluyendo: (i) incumplos de estos Términos por parte del Usuario; (ii) incumplos de cualquier otra política, guía, o norma de Freezer; (iii) actividades ilegales, fraudulentas, o sospechosas; (iv) solicitudes de autoridades gubernamentales o judiciales; (v) problemas técnicos o de seguridad; (vi) falta de pago o problemas con el método de pago; (vii) inactividad prolongada de la cuenta; (viii) decisiones comerciales de Freezer; o (ix) cualquier otro motivo que Freezer considere suficiente.
            </p>
            <p>
              <strong>13.3 Efectos de la Terminación.</strong> Tras la terminación de la cuenta, ya sea por iniciativa del Usuario o de Freezer: (a) el derecho del Usuario a acceder y utilizar la Plataforma cesará inmediatamente; (b) todos los datos, contenido, y archivos asociados con la cuenta del Usuario podrán ser eliminados de forma permanente e irreversible, sin que Freezer esté obligado a mantener copias de seguridad o a proporcionar acceso a dichos datos; (c) todas las licencias y derechos otorgados al Usuario bajo estos Términos se suspenderán o terminarán inmediatamente; y (d) las disposiciones de estos Términos que, por su naturaleza, deban sobrevivir a la terminación, incluyendo las secciones relativas a propiedad intelectual, exención de garantías, limitación de responsabilidad, indemnización, confidencialidad, y disposiciones generales, permanecerán en pleno vigor y efecto.
            </p>
            <p>
              <strong>13.4 Reactivación.</strong> Freezer se reserva el derecho de evaluar las solicitudes de reactivación de cuentas previamente terminadas, a su sola discreción, y de establecer condiciones, requisitos, o términos adicionales para la reactivación.
            </p>
          </section>

          <section>
            <p className="font-bold">14. LEY APLICABLE, JURISDICCIÓN Y RESOLUCIÓN DE CONTROVERSIAS</p>
            <p>
              Estos Términos se regirán, interpretarán, y ejecutarán de acuerdo con las leyes de la jurisdicción en la que FLUX INDUSTRIES tiene su sede principal o desde la cual opera, sin dar efecto a ningún principio de conflicto de leyes, independientemente del lugar donde se encuentre el Usuario o desde donde acceda a la Plataforma. Cualquier disputa, controversia, reclamo, o diferencia que surja de, se relacione con, o sea consecuencia de estos Términos, del uso de la Plataforma, de la relación entre el Usuario y Freezer, o de cualquier aspecto de los Servicios, será sometida exclusivamente a la jurisdicción de los tribunales competentes de la jurisdicción donde Freezer tiene su sede principal, y el Usuario acepta irrevocableablemente la jurisdicción exclusiva de dichos tribunales.
            </p>
            <p>
              El Usuario renuncia expresa e irrevocableablemente a cualquier objeción que pudiera tener respecto a la jurisdicción o el foro de cualquier acción, procedimiento, o proceso iniciado ante los tribunales de la jurisdicción de Freezer, y acepta no presentar defensas basadas en falta de jurisdicción, forum non conveniens, o cualquier otra defensa basada en la jurisdicción o el foro.
            </p>
            <p>
              <strong>ACUERDO DE ARBITRAJE OPCIONAL:</strong> Como alternativa a los tribunales, el Usuario y Freezer pueden acordar mutuamente que cualquier disputa sea sometida a arbitraje vinculante de conformidad con las reglas de arbitraje de la American Arbitration Association, las reglas de la International Chamber of Commerce, o cualquier otra organización de arbitraje que las partes acuerden por escrito. El arbitraje será conducido por un único árbitro mutuamente acordado por las partes, o en caso de desacuerdo, designado de conformidad con las reglas de arbitraje aplicables. El lugar del arbitraje será la ciudad donde Freezer tiene su sede principal. El idioma del arbitraje será el español, a menos que las partes acuerden lo contrario por escrito.
            </p>
          </section>

          <section>
            <p className="font-bold">15. ACERCA DE FLUX INDUSTRIES Y NUESTRA COMUNIDAD</p>
            <p>
              <strong>StreamFlow es una plataforma orgullosamente operada por FLUX INDUSTRIES</strong>, la empresa tecnológica innovadora detrás del proyecto StreamFlow, nacida con la misión de revolucionar la industria del streaming y la transmisión de contenido audiovisual en la era digital. FLUX INDUSTRIES se distingue por su compromiso inquebrantable con la excelencia técnica, la innovación constante, y la entrega de experiencias de usuario superiores que superan las expectativas de nuestra comunidad global.
            </p>
            <p>
              Al aceptar estos Términos y Condiciones, te conviertes oficialmente en un miembro activo y comprometido de la comunidad FLUX INDUSTRIES, una comunidad global única de creadores, productores, distribuidores, y consumidores de contenido audiovisual en streaming que comparten la visión común de transformar cómo el mundo accede, disfruta, y comparte el contenido de video. Como parte de esta comunidad, aceptas formar parte de una comunidad internacional diversa, inclusiva, y comprometida con los más altos estándares de excelencia, respeto mutuo, colaboración, innovación, y apoyo incondicional a FLUX INDUSTRIES en nuestra misión de revolucionar la industria del streaming global.
            </p>
            <p>
              Tu lealtad, compromiso, y dedicación a estos Términos y Condiciones, junto con tu entusiasmo y apoyo activo a FLUX INDUSTRIES, garantizan tu lugar permanente y privilegiado en nuestra comunidad. Juntos, como una fuerza unificada y poderosa, lograremos cosas que ninguna otra plataforma de streaming ha logrado antes. <strong>Juntos transmitimos con más fuerza. Juntos somos más fuertes.</strong>
            </p>
            <p>
              <strong>FLUX INDUSTRIES — Impulsando la innovación tecnológica. La fuerza que trasciende los límites del streaming. El poder que va más allá de la escarcha.</strong> Tu registro en nuestra plataforma es un honor y un privilegio que conlleva responsabilidades. Sé un miembro digno. Honra a tu comunidad. Respeta a tus compañeros. Apoya a FLUX INDUSTRIES. Y juntos, llevaremos el streaming a niveles nunca antes imaginados.
            </p>
            <p>
              Bienvenido a la comunidad FLUX INDUSTRIES. Tu experiencia comienza ahora. StreamFlow es tu plataforma. FLUX INDUSTRIES es tu empresa. Y el futuro del streaming es nuestro.
            </p>
          </section>

          <section>
            <p className="font-bold">16. DISPOSICIONES GENERALES, ACUERDO COMPLETO Y SEPARABILIDAD</p>
            <p>
              Estos Términos, junto con la Política de Privacidad, las Políticas de Uso Aceptable, las Condiciones de Suscripción, y cualquier otro documento, política, o acuerdo al que se haga referencia en este documento (conjuntivamente, el &quot;Acuerdo&quot;), constituyen el acuerdo completo, total, y exclusivo entre el Usuario y Freezer con respecto al uso de la Plataforma y reemplazan todos los acuerdos previos, representaciones, declaraciones, garantías, entendimientos, negociaciones, y comunicaciones, ya sean oralmente, por escrito, o de cualquier otra forma, entre el Usuario y Freezer con respecto al objeto de este Acuerdo.
            </p>
            <p>
              Si alguna disposición de estos Términos es declarada inválida, inaplicable, nula, anulable, o ineficaz por un tribunal competente o autoridad administrativa con jurisdicción sobre la materia, dicha disposición será reformada, modificada, o ajustada en su formulación para lograr, en la medida de lo posible, el propósito perseguido originalmente por las partes, y las disposiciones restantes de estos Términos permanecerán en pleno vigor y efecto, y continuarán siendo vinculantes y aplicables para ambas partes.
            </p>
            <p>
              El hecho de que Freezer no ejerza o no haga valer cualquier derecho, término, condición, disposición, obligación, o recurso establecido en estos Términos no constituirá una renuncia a dicho derecho, término, condición, disposición, obligación, o recurso, ni una renuncia o excusa continuado o futura del ejercicio de cualquier otro derecho, término, condición, disposición, obligación, o recurso. La renuncia de cualquier derecho o recurso por parte de Freezer deberá hacerse por escrito y firmada por un representante autorizado de Freezer para que sea efectiva.
            </p>
            <p>
              El Usuario no puede ceder, transferir, sublicenciar, delegar, o de cualquier otra forma enajenar o transmitir sus derechos u obligaciones bajo estos Términos sin el consentimiento previo y por escrito de Freezer. Freezer puede ceder, transferir, sublicenciar, delegar, o de cualquier otra forma enajenar o transmitir sus derechos u obligaciones bajo estos Términos sin restricción y sin necesidad de obtener el consentimiento del Usuario.
            </p>
            <p>
              Estos Términos son vinculantes para las partes y sus respectivos sucesores, herederos, albaceas, administradores, y cesionarios autorizados. Los encabezados de las secciones contenidos en estos Términos son únicamente por conveniencia y no afectarán la interpretación o construcción de estos Términos.
            </p>
          </section>

          <section>
            <p className="font-bold">17. ACUERDO DE USUARIO, CAPACIDAD LEGAL Y ACEPTACIÓN ELECTRÓNICA</p>
            <p>
              El Usuario reconoce y acepta que: (a) tiene la capacidad legal para celebrar este Acuerdo y para utilizar la Plataforma; (b) toda la información proporcionada a Freezer durante el registro y el uso de la Plataforma es verdadera, precisa, completa, y actualizada; (c) cumplirá con todas las leyes, regulaciones, y normas aplicables al utilizar la Plataforma; (d) no utilizará la Plataforma para ningún propósito ilegal o no autorizado; (e) no interferirá con el funcionamiento normal de la Plataforma ni con el uso de la Plataforma por parte de otros Usuarios; y (f) acepta recibir comunicaciones electrónicas de Freezer, incluyendo correos electrónicos, notificaciones en la Plataforma, y mensajes SMS, relacionados con su cuenta, los Servicios, y cualquier aspecto de la relación entre el Usuario y Freezer.
            </p>
            <p>
              El Usuario acepta que la creación de una cuenta, el inicio de sesión, el hacer clic en cualquier botón de aceptación, o el simple hecho de acceder o utilizar la Plataforma constituyen una firma electrónica que tiene el mismo valor legal y efecto que una firma manuscrita, y que el Usuario queda vinculado por este Acuerdo como si lo hubiera firmado físicamente.
            </p>
          </section>

          <section>
            <p className="font-bold">18. INFORMACIÓN DE CONTACTO Y SOPORTE TÉCNICO</p>
            <p>
              Para cualquier pregunta, comentario, inquietud, queja, solicitud, o comentario relacionado con estos Términos, con la Plataforma, con los Servicios, con su cuenta, con el Contenido del Usuario, con la facturación, con la privacidad, o con cualquier otro aspecto de la relación entre el Usuario y Freezer, por favor comunícate con FLUX INDUSTRIES a través de los canales de soporte disponibles en la Plataforma, incluyendo el formulario de contacto, el chat de soporte, el correo electrónico de soporte, o cualquier otro canal que Freezer ponga a disposición del Usuario.
            </p>
            <p>
              Tu satisfacción como miembro del Ejército de Freezer es nuestra prioridad número uno. Estamos aquí para ayudarte, para apoyarte, y para garantizar que tu experiencia en StreamFlow sea excepcional. No dudes en contactarnos. El Ejército de Freezer nunca deja a un compañero atrás.
            </p>
            <p>
              <strong>FLUX INDUSTRIES — Siempre contigo. Siempre para ti. Siempre un paso adelante. Siempre más allá del frío.</strong>
            </p>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAccept}
              disabled={isAccepted}
              className={`
                w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 cursor-pointer
                ${isAccepted
                  ? 'bg-[var(--color-accent)] border-transparent'
                  : 'border-gray-500 hover:border-[var(--color-accent)] bg-white'
                }
              `}
            >
              {isAccepted && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span style={{ color: '#000000', fontSize: '14px' }}>
              Acepto los términos y condiciones
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
